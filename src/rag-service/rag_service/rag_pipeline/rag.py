from typing import List, Dict, Literal, cast
from pathlib import Path
import chromadb
import shutil
from llama_index.core import StorageContext, VectorStoreIndex, Document
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
import uuid
import time

from data_poisoning_detection_strategies.data_poisoning_detection import run_data_poisoning_detection
from rag_service.constants import PROVIDER_OLLAMA, PROVIDER_LANGDOCK
from rag_service.rag_pipeline.utils.init_langdock_models import init_langdock_models
from rag_service.rag_pipeline.utils.init_ollama_models import init_ollama_models
from rag_service.config import get_settings, DataPoisoningDetectionStrategy
from logger.logging_config import get_logger
from rag_service.rag_pipeline.utils.store_performance_results import store_performance_results
from rag_service.rag_pipeline.utils.read_precomputed_embeddings import (
    validate_embeddings_directory,
    get_list_of_embeddings_files,
    load_embeddings_into_collection,
)
from rag_service.rag_pipeline.utils.prepare_prompt import prepare_prompt

class RAGSpamClassifier:
    """
    RAG System for classifying text as spam or not spam.
    Uses a vector store as a Knowledge Base, with an initial index built from precomputed embeddings of labeled examples.
    """

    def __init__(self):
        self.settings = get_settings()
        self._logger = get_logger(self.__class__.__name__)
        self._logger.info("Initializing RAG Pipeline...")
        self._init_vector_store()
        self._init_models()
        self._build_index()

    def _init_vector_store(self):
        """Initializes the Chroma Vector Store"""
        chroma_db_path = Path(self.settings.chroma_db_path)
        if chroma_db_path.exists():
            shutil.rmtree(chroma_db_path)
        chroma_db_path.mkdir(parents=True, exist_ok=True)

        self._client = chromadb.PersistentClient(path=str(chroma_db_path))
        self._collection = self._client.get_or_create_collection("spam_knowledge_base")
        self._vector_store = ChromaVectorStore(chroma_collection=self._collection)
        self._storage_context = StorageContext.from_defaults(vector_store=self._vector_store)
        self._logger.info("Initialized Vector Store")


    def _init_models(self):
        """Initializes the LLM and embedding models based on the config."""
        provider = (self.settings.model_provider or "").strip().lower()
        if provider == PROVIDER_OLLAMA:
            self._llm_model, self._embeddings_model = init_ollama_models(self.settings)
        elif provider == PROVIDER_LANGDOCK:
            self._llm_model, self._embeddings_model = init_langdock_models(self.settings)
        else:
            raise ValueError("Error: LLM Provider variable missing or invalid."
                             "Please set it to 'Ollama' or 'LangDock' in the .env file or environment variables.")
        self._logger.info("Initialized models (llm=%s embeddings=%s)",
                          self.settings.llm_model, self.settings.embeddings_model)

    def _build_index(self):
        """Builds the Vector Store Index from precomputed embeddings stored as multiple part files in a directory."""
        precomputed_embeddings_dir = self.settings.base_embeddings_store_path

        validate_embeddings_directory(
            embeddings_dir=precomputed_embeddings_dir,
            logger=self._logger,
        )

        list_of_embeddings_files = get_list_of_embeddings_files(precomputed_embeddings_dir)
        self._logger.info("Loading %d files with precomputed embeddings from %s",
        len(list_of_embeddings_files), precomputed_embeddings_dir)

        amount_loaded = load_embeddings_into_collection(
            collection=self._collection,
            list_of_embedding_files=list_of_embeddings_files,
            logger=self._logger,
            batch_size=2000,
        )

        self._index = VectorStoreIndex.from_vector_store(
            self._vector_store,
            self._embeddings_model,
            storage_context=self._storage_context,
        )
        self._retriever = VectorIndexRetriever(index=self._index, similarity_top_k=10)
        self._query_engine = RetrieverQueryEngine.from_args(retriever=self._retriever, llm=self._llm_model)
        self._logger.info("Index built from %d precomputed embeddings", amount_loaded)

    def classify_text(self, user_post: str) -> Dict[str, str]:
        """Classifies a single text as spam or not_spam."""
        retrieved_examples = self._retriever.retrieve(user_post)

        final_prompt = prepare_prompt(
            retrieved_examples=retrieved_examples,
            user_post=user_post,
            prompt_template=self.settings.prompt_template,
            logger=self._logger,
        )
        llm_response = self._llm_model.complete(final_prompt)
        classification_text = llm_response.text.strip().lower()

        if classification_text.startswith(self.settings.spam_label):
            return {"classification": self.settings.spam_label}
        elif classification_text.startswith(self.settings.not_spam_label):
            return {"classification": self.settings.not_spam_label}
        else:
            raise ValueError(f"Error: Invalid response from LLM for classification of text \"{classification_text}\"")

    def classify_batch(self, texts: List[str]) -> List[Dict[str, str]]:
        """Classifies a list of text posts as spam or not_spam."""
        return [self.classify_text(t) for t in texts]

    def ingest_entry_to_kb(self, text: str, label: str) -> bool:
        """
        Inserts a new entry into the vector store & index.
        The embedding is created and stored automatically during insert()
        """
        doc = Document(text=text, metadata={"label": label})
        self._index.insert(doc)
        self._logger.info("Ingested new entry")
        return True

    def ingest_batch_to_kb(self, entries: List[Dict[str, str]]) -> int:
        """
        Inserts a batch of new entries into the vector store & index.
        """
        docs = [
            Document(text=e['text'], metadata={"label": e["label"]})
            for e in entries
        ]
        self._index.insert_nodes(docs)
        self._logger.info("Ingested batch of %d new entries", len(entries))
        return len(docs)

    def _check_for_data_poisoning(self, entries: List[Dict]) -> list[dict] | None:
        """Checks a batch of new entries for potential data poisoning."""
        poisoned_entries = []
        kb_contents = self._get_all_kb_entries_with_embeddings()

        if self.settings.data_poisoning_detection_strategy is None:
            self.settings.data_poisoning_detection_strategy = (
                DataPoisoningDetectionStrategy.EMBEDDING_SPACE_SIMILARITY_ON_BATCH_LEVEL
            )

        start_time = time.perf_counter()
        try:
            poisoned_entries = run_data_poisoning_detection(
                detection_strategy=self.settings.data_poisoning_detection_strategy,
                new_entries=entries,
                kb_contents=kb_contents,
                logger=self._logger,
            )
        except Exception as e:
            self._logger.error("Data poisoning detection failed: %s.", e)
            self._logger.info("Proceeding with ingestion.")
        finally:
            end_time = time.perf_counter()
            if self.settings.store_performance_results_for_detection:
                store_performance_results(end_time - start_time, entries, kb_contents)

        if len(poisoned_entries) > 0:
            self._logger.warning(
                "Data poisoning detected in current batch! Skipping ingestion of %d poisoned samples.", len(poisoned_entries)
            )
            entries = [
                e for e in entries
                if e.get("id") not in poisoned_entries
            ]
        return entries

    def ingest_precomputed_embeddings(self, entries: List[Dict]) -> List[Dict]:
        """
        Inserts a batch of new entries with already precomputed embeddings into the KB.
        Returns a detailed status for each entry.
        """
        detailed_results = []

        if self.settings.use_data_poisoning_detection:
            entries = self._check_for_data_poisoning(entries)  # filter out poisoned entries

        for entry in entries:
            try:
                self._collection.add(
                    documents=[entry["text"]],
                    embeddings=[entry["embedding"]],
                    metadatas=[{"label": entry["label"]}],
                    ids=[entry.get("id") or str(uuid.uuid4())]
                )
                detailed_results.append({"id": entry.get("id"), "status": "ingested"})
            except Exception as error:
                self._logger.warning("Failed to ingest entry with id %s: %s", entry.get("id"), error)
                detailed_results.append({"id": entry.get("id"), "status": "failed", "error": str(error)})

        self._logger.info("Ingested %d new entries with precomputed embeddings",
                          len([r for r in detailed_results if r["status"] == "ingested"]))
        return detailed_results

    def _get_all_kb_entries_with_embeddings(self) -> List[Dict]:
        """Fetches all entries from the Chroma collection."""
        data = self._collection.get(include=["documents", "metadatas", "embeddings"])

        documents = data.get("documents")
        metadatas = data.get("metadatas")
        embeddings = data.get("embeddings")

        documents = documents if documents is not None else []
        metadatas = metadatas if metadatas is not None else []
        embeddings = embeddings if embeddings is not None else []

        list_of_entries: List[Dict] = []
        for doc_text, meta, embedding in zip(documents, metadatas, embeddings):
            label = meta.get("label") if isinstance(meta, dict) else None
            list_of_entries.append({
                "text": doc_text,
                "label": label,
                "embedding": embedding
            })

        return list_of_entries

    def get_all_kb_entries(self) -> List[Dict[str, Literal["spam", "not_spam"]]]:
        """ Fetches all entries from the knowledge base without embeddings."""
        all_entries_with_embeddings = self._get_all_kb_entries_with_embeddings()
        for entry in all_entries_with_embeddings:
            entry.pop("embedding", None)
            if entry["label"] not in ("spam", "not_spam"):
                raise ValueError(f"Invalid label: {entry['label']}")
            entry["label"] = cast(Literal["spam", "not_spam"], entry["label"])
        return all_entries_with_embeddings


rag_classifier = RAGSpamClassifier()
