from typing import List, Dict
from pathlib import Path
import chromadb
from llama_index.core import StorageContext, VectorStoreIndex, Document
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from config import get_settings
from utils.parquet_data_loader import DataLoader
from logging_config import get_logger

class RAGSpamClassifier:
    def __init__(self):
        self.settings = get_settings()
        self._logger = get_logger(self.__class__.__name__)
        self._logger.info("Initializing RAG Pipeline...")
        self._init_vector_store()
        self._init_models()
        self._build_index()

    def _init_vector_store(self):
        """Initializes the Chroma Vector Store"""
        Path(self.settings.chroma_db_path).mkdir(parents=True, exist_ok=True)
        self._client = chromadb.PersistentClient(path=str(self.settings.chroma_db_path))

        existing_collections = {c.name for c in self._client.list_collections()}
        if "spam_knowledge_base" in existing_collections:
            self._client.delete_collection("spam_knowledge_base")
        self._collection = self._client.get_or_create_collection("spam_knowledge_base")

        self._vector_store = ChromaVectorStore(chroma_collection=self._collection)
        self._storage_context = StorageContext.from_defaults(vector_store=self._vector_store)
        self._logger.info("Vector Store initialized")


    def _init_models(self):
        """"Initializes the LLM and Embeddings models"""
        self._llm_model = OpenAI(model=self.settings.openai_model, api_key=self.settings.openai_api_key.get_secret_value())
        self._embeddings_model = OpenAIEmbedding(model=self.settings.embeddings_model, api_key=self.settings.openai_api_key.get_secret_value())
        self._logger.info("Models initialized (llm=%s embeddings=%s)", self.settings.openai_model, self.settings.embeddings_model)

    def _build_index(self):
        """Builds the Vector Store Index from the initial knowledge base data"""
        documents = DataLoader().load_initial_kb_data()

        self._index = VectorStoreIndex.from_documents(
            documents,
            storage_context=self._storage_context,
            embed_model=self._embeddings_model
        )
        self._retriever = VectorIndexRetriever(index=self._index, similarity_top_k=10) # TODO: tune k
        self._query_engine = self._index.as_query_engine(
            retriever=self._retriever,
            llm=self._llm_model
        )
        self._logger.info("Index built with %d initial documents", len(documents))

    def classify_text(self, text: str) -> Dict[str, str]:
        """Classifies a single text post as spam or not_spam."""
        prompt = self.settings.prompt_template.format(text_to_classify=text)
        response = self._query_engine.query(prompt)
        classification_result = str(response).strip().lower()

        if classification_result.startswith("spam"):
            label = "spam"
        elif classification_result.startswith("not_spam") or classification_result.startswith("not spam") or "not_spam" in classification_result:
            label = "not_spam"
        else:
            raise ValueError(f"Unexpected classification response: {classification_result}")
        return {"classification": label}

    def classify_batch(self, texts: List[str]) -> List[Dict[str, str]]:
        """Classifies a list of text posts as spam or not_spam."""
        return [self.classify_text(t) for t in texts]

    def ingest_entry_to_kb(self, text: str, label: str) -> bool:
        """
        Inserts a new entry into the vector store & index.
        The embedding is created and stored automatically during insert()
        """
        doc_text = f"{text} [LABEL: {label}]"
        doc = Document(text=doc_text, metadata={"label": label})
        self._index.insert(doc)
        self._logger.info("Ingested new entry")
        return True

    def ingest_batch_to_kb(self, entries: List[Dict[str, str]]) -> int:
        """
        Inserts a batch of new entries into the vector store & index.
        The embeddings are created and stored automatically during insert_nodes()
        """
        docs = [
            Document(text=f"{e['text']} [LABEL: {e['label']}]", metadata={"label": e["label"]})
            for e in entries
        ]
        self._index.insert_nodes(docs)
        self._logger.info("Ingested batch of %d new entries", len(entries))
        return len(docs)

    def get_all_kb_entries(self) -> List[Dict[str, str]]:
        """
        Returns all knowledge base entries as a list of {text, label}.
        Extracts original text by stripping the appended label suffix.
        """
        data = self._collection.get(include=["documents", "metadatas"])
        documents = data.get("documents", []) or []
        metadatas = data.get("metadatas", []) or []
        entries: List[Dict[str, str]] = []

        for doc_text, meta in zip(documents, metadatas):
            label = (meta or {}).get("label")
            if isinstance(doc_text, str) and label:
                suffix = f"[LABEL: {label}]"
                if doc_text.endswith(suffix):
                    base_text = doc_text[: -len(suffix)].rstrip()
                else:
                    base_text = doc_text
            else:
                base_text = doc_text
            entries.append({"text": base_text, "label": label})

        return entries

rag_classifier = RAGSpamClassifier()
