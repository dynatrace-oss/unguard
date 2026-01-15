from pydantic_settings import BaseSettings
from pydantic import SecretStr
from pathlib import Path
from string import Template
from typing import Optional
from enum import Enum


class DataPoisoningDetectionStrategy(Enum):
    EMBEDDING_SPACE_SIMILARITY_ON_BATCH_LEVEL = "embedding_similarity_batch_level"
    EMBEDDING_SPACE_SIMILARITY_ON_ENTRY_LEVEL = "embedding_similarity_entry_level"
    EMBEDDINGS_CLUSTER_ANALYSIS = "embeddings_cluster_analysis"
    K_NEAREST_NEIGHBOURS_LABEL_CONSISTENCY_WITH_KNN = "knn_label_consistency"
    APPROXIMATE_K_NEAREST_NEIGHBOURS_LABEL_CONSISTENCY_WITH_ANN = "ann_label_consistency"
    NONE = None

class NNLabelDecisionVariant(Enum):
    MAJORITY_VOTING = "majority_voting"
    DISTANCE_WEIGHTED_VOTING = "distance_weighted_voting"
    THRESHOLD_BASED_KNN = "threshold_based"
    NONE = None

class Settings(BaseSettings):
    """Configuration settings for the RAG Service."""
    app_name: str = "RAG Service"
    app_description: str = "API for classifying text as spam or not spam using a RAG system"

    prompt_template: Template = Template(
        "You are a spam classification model. "
        "You are given a USER_POST to classify. Please use only the retrieved labeled examples to decide whether a post is spam or not spam."
        "Respond with exactly either 'spam' or 'not_spam'. Do not add anything else.\n"
        "Retrieved Examples: ${retrieved_examples}\n\n"
        "USER_POST:\n${user_post}\n\n"
    )

    spam_label: str = "spam"
    not_spam_label: str = "not_spam"

    chroma_db_path: Path = Path("./vector-store/chroma_db")

    base_data_path: Path = Path("rag_service/data/base_dataset.parquet")
    test_data_path: Path = Path("rag_service/data/test_dataset.parquet")
    raw_keyword_attack_success_evaluation_parquet_dataset_path: Path = Path("data_poisoning_attacks/keyword_attack/attack_evaluation_dataset_parquet/keyword_attack_evaluation_dataset.parquet")
    raw_targeted_label_flipping_attack_parquet_dataset_path: Path = Path("data_poisoning_attacks/targeted_label_flipping/parquet_datasets/targeted_label_flipping_attack_dataset.parquet")
    raw_targeted_label_flipping_attack_success_evaluation_parquet_dataset_path: Path = Path("data_poisoning_attacks/targeted_label_flipping/parquet_datasets/targeted_label_flipping_attack_evaluation_dataset.parquet")

    max_length_for_entries: int = 2793  # value taken from Huggingface length bar chart (upper boundary of first bar)

    base_embeddings_store_path: Path = Path("rag_service/data/base_data_embeddings/")
    label_flipping_attack_embeddings_store_path: Path = Path("data_poisoning_attacks/label_flipping/attack_data/")
    keyword_attack_embeddings_store_path: Path = Path("data_poisoning_attacks/keyword_attack/attack_data/")
    prepared_keyword_attack_success_evaluation_dataset_store_path: Path = Path("data_poisoning_attacks/keyword_attack/attack_evaluation_data_prepared/attack_success_evaluation_prepared_dataset.parquet")
    targeted_label_flipping_attack_embeddings_store_path: Path = Path("data_poisoning_attacks/targeted_label_flipping/attack_data/")
    targeted_label_flipping_attack_success_evaluation_dataset_store_path: Path = Path("data_poisoning_attacks/targeted_label_flipping/attack_evaluation_data/attack_success_evaluation_dataset.parquet")

    legit_data_embeddings_store_path: Path = Path("data_poisoning_attacks/legit_data_ingestion/legit_data/")
    embeddings_computation_max_batch_size: int = 200

    default_evaluation_results_store_path: Path = Path("evaluation/evaluation_results/")
    label_flipping_evaluation_results_store_path: Path = Path("data_poisoning_attacks/label_flipping/evaluation_results/")
    legit_data_ingestion_evaluation_results_store_path: Path = Path("data_poisoning_attacks/legit_data_ingestion/evaluation_results/")
    keyword_attack_evaluation_results_store_path: Path = Path("data_poisoning_attacks/keyword_attack/evaluation_results/")
    targeted_label_flipping_attack_evaluation_results_store_path: Path = Path("data_poisoning_attacks/targeted_label_flipping/evaluation_results/")

    # model config with values taken from the .env file or environment variables
    model_provider: Optional[str] = None
    model_provider_base_url: Optional[str] = None
    langdock_api_key: Optional[SecretStr] = None
    base_url: Optional[str] = None
    llm_model: Optional[str] = None
    embeddings_model: Optional[str] = None
    evaluate_after_attack: bool = True
    limit_evaluation_samples: int = 0  # 0 -> no limit
    limit_keyword_attack_success_evaluation_samples: int = 0  # 0 -> no limit

    use_data_poisoning_detection: bool = False
    data_poisoning_detection_strategy: DataPoisoningDetectionStrategy | None = None
    label_consistency_detection_decision_variant: NNLabelDecisionVariant | None = None

    # The remaining values are only used in the experiments for the detection strategies evaluation:

        # 1. base datasets
    sms_spam_base_embeddings_store_path: Path = Path("rag_service/data/base_data_embeddings_sms_spam/")
    enron_base_embeddings_store_path: Path = Path("rag_service/data/base_data_embeddings_enron/")
    spam_assassin_base_embeddings_store_path: Path = Path("rag_service/data/base_data_embeddings_spam_assassin/")
    deysi_spam_detection_base_embeddings_store_path: Path = Path("rag_service/data/base_data_embeddings_deysi_spam_detection/")

        # 2. precomputed embeddings for the test data (legit data ingestion) for the experiments
    sms_spam_legit_embeddings_store_path: Path = Path("detection_strategies_evaluation_experiments/experiment_data/sms_spam_dataset/legit_ingestion_embeddings/")
    enron_legit_embeddings_store_path: Path = Path("detection_strategies_evaluation_experiments/experiment_data/enron_dataset/legit_ingestion_embeddings/")
    spam_assassin_legit_embeddings_store_path: Path = Path("detection_strategies_evaluation_experiments/experiment_data/spam_assassin_dataset/legit_ingestion_embeddings/")
    deysi_spam_detection_legit_embeddings_store_path: Path = Path("detection_strategies_evaluation_experiments/experiment_data/deysi_spam_detection_dataset/legit_ingestion_embeddings/")

        # 3. precomputed embeddings for the attack data for the experiments
            # 3.1. label flipping attack embeddings
    label_flipping_experiment_dataset_store_path_for_deysi_spam_detection_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/deysi_spam_detection_dataset/label_flipping_embeddings/")
    label_flipping_experiment_dataset_store_path_for_sms_spam_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/sms_spam_dataset/label_flipping_embeddings/")
    label_flipping_experiment_dataset_store_path_for_enron_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/enron_dataset/label_flipping_embeddings/")
    label_flipping_experiment_dataset_store_path_for_spam_assassin_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/spam_assassin_dataset/label_flipping_embeddings/")

            # 3.2. keyword attack embeddings
    keyword_attack_experiment_dataset_store_path_for_deysi_spam_detection_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/deysi_spam_detection_dataset/keyword_attack_embeddings/")
    keyword_attack_experiment_dataset_store_path_for_sms_spam_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/sms_spam_dataset/keyword_attack_embeddings/")
    keyword_attack_experiment_dataset_store_path_for_enron_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/enron_dataset/keyword_attack_embeddings/")
    keyword_attack_experiment_dataset_store_path_for_spam_assassin_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/spam_assassin_dataset/keyword_attack_embeddings/")

            # 3.3. targeted label flipping attack embeddings
    targeted_label_flipping_experiment_dataset_store_path_for_deysi_spam_detection_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/deysi_spam_detection_dataset/targeted_label_flipping_embeddings/")
    targeted_label_flipping_experiment_dataset_store_path_for_sms_spam_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/sms_spam_dataset/targeted_label_flipping_embeddings/")
    targeted_label_flipping_experiment_dataset_store_path_for_enron_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/enron_dataset/targeted_label_flipping_embeddings/")
    targeted_label_flipping_experiment_dataset_store_path_for_spam_assassin_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/spam_assassin_dataset/targeted_label_flipping_embeddings/")

        # 4. valuation results storage paths
    evaluation_results_store_path_for_deysi_spam_detection_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/deysi_spam_detection_dataset/evaluation_results/")
    evaluation_results_store_path_for_sms_spam_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/sms_spam_dataset/evaluation_results/")
    evaluation_results_store_path_for_enron_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/enron_dataset/evaluation_results/")
    evaluation_results_store_path_for_spam_assassin_dataset: Path = Path("detection_strategies_evaluation_experiments/experiment_data/spam_assassin_dataset/evaluation_results/")


    class Config:
        env_file = str(Path(__file__).resolve().parent.parent / ".env")
        env_file_encoding = "utf-8"

settings = Settings()

def get_settings() -> Settings:
    return settings
