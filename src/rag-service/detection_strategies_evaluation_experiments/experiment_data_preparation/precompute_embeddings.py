from data_preprocessing.prepare_attack_datasets.prepare_keyword_attack_datasets import add_keyword_to_attack_entries
from data_preprocessing.prepare_attack_datasets.prepare_label_flipping_dataset import manipulate_labels
from rag_service.data_loader.parquet_data_loader import DataLoader
from rag_service.embeddings_precomputation.generate_and_store_embeddings import generate_and_store_embeddings
from detection_strategies_evaluation_experiments.experiment_data_preparation.load_datasets import \
    load_enron_spam_dataset, load_sms_spam_dataset, load_deysi_spam_detection_dataset, load_spam_assassin_dataset
from rag_service.config import get_settings
from logger.logging_config import get_logger

settings = get_settings()
logger = get_logger("ExperimentDataPreprocessor")

def _prepare_attack_datasets(attack_data) -> tuple:
    prepared_label_flipping_data = manipulate_labels(attack_data)

    keyword_attack_data = [doc for doc in attack_data if doc.metadata.get("label") == settings.not_spam_label]
    prepared_keyword_attack_data = add_keyword_to_attack_entries(keyword_attack_data)

    return prepared_label_flipping_data, prepared_keyword_attack_data

def prepare_enron_spam_dataset():
    enron_spam_dataset = load_enron_spam_dataset()
    enron_base_dataset = enron_spam_dataset[:(len(enron_spam_dataset)//2)]
    enron_experiment_dataset = enron_spam_dataset[(len(enron_spam_dataset)//2):]

    generate_and_store_embeddings(enron_base_dataset, settings.enron_base_embeddings_store_path)

    attack_data = enron_experiment_dataset[:(len(enron_experiment_dataset)//2)]
    label_flipping_data, keyword_attack_data = _prepare_attack_datasets(attack_data)
    generate_and_store_embeddings(label_flipping_data, settings.label_flipping_experiment_dataset_store_path_for_enron_dataset)
    generate_and_store_embeddings(keyword_attack_data, settings.keyword_attack_experiment_dataset_store_path_for_enron_dataset)

    targeted_label_flipping_data = DataLoader().load_targeted_label_flipping_attack_data()
    generate_and_store_embeddings(targeted_label_flipping_data, settings.targeted_label_flipping_experiment_dataset_store_path_for_enron_dataset)

    legit_data = enron_experiment_dataset[(len(enron_experiment_dataset)//2):]
    generate_and_store_embeddings(legit_data, settings.enron_legit_embeddings_store_path)

def prepare_spam_assassin_dataset():
    spam_assassin_dataset = load_spam_assassin_dataset()
    spam_assassin_base_dataset = spam_assassin_dataset[:(len(spam_assassin_dataset)//2)]
    spam_assassin_experiment_dataset = spam_assassin_dataset[(len(spam_assassin_dataset)//2):]

    generate_and_store_embeddings(spam_assassin_base_dataset, settings.spam_assassin_base_embeddings_store_path)

    attack_data = spam_assassin_experiment_dataset[:(len(spam_assassin_experiment_dataset)//2)]
    label_flipping_data, keyword_attack_data = _prepare_attack_datasets(attack_data)
    generate_and_store_embeddings(label_flipping_data, settings.label_flipping_experiment_dataset_store_path_for_spam_assassin_dataset)
    generate_and_store_embeddings(keyword_attack_data, settings.keyword_attack_experiment_dataset_store_path_for_spam_assassin_dataset)
    targeted_label_flipping_data = DataLoader().load_targeted_label_flipping_attack_data()
    generate_and_store_embeddings(targeted_label_flipping_data, settings.targeted_label_flipping_experiment_dataset_store_path_for_spam_assassin_dataset)

    legit_data = spam_assassin_experiment_dataset[(len(spam_assassin_experiment_dataset)//2):]
    generate_and_store_embeddings(legit_data, settings.spam_assassin_legit_embeddings_store_path)

def prepare_deysi_spam_detection_dataset():
    deysi_spam_detection_dataset = load_deysi_spam_detection_dataset()
    deysi_base_dataset = deysi_spam_detection_dataset[:(len(deysi_spam_detection_dataset)//2)]
    deysi_experiment_dataset = deysi_spam_detection_dataset[(len(deysi_spam_detection_dataset)//2):]

    generate_and_store_embeddings(deysi_base_dataset, settings.deysi_spam_detection_base_embeddings_store_path)

    attack_data = deysi_experiment_dataset[:(len(deysi_experiment_dataset)//2)]
    label_flipping_data, keyword_attack_data = _prepare_attack_datasets(attack_data)
    generate_and_store_embeddings(label_flipping_data, settings.label_flipping_experiment_dataset_store_path_for_deysi_spam_detection_dataset)
    generate_and_store_embeddings(keyword_attack_data, settings.keyword_attack_experiment_dataset_store_path_for_deysi_spam_detection_dataset)
    targeted_label_flipping_data = DataLoader().load_targeted_label_flipping_attack_data()
    generate_and_store_embeddings(targeted_label_flipping_data, settings.targeted_label_flipping_experiment_dataset_store_path_for_deysi_spam_detection_dataset)

    legit_data = deysi_experiment_dataset[(len(deysi_experiment_dataset)//2):]
    generate_and_store_embeddings(legit_data, settings.deysi_spam_detection_legit_embeddings_store_path)

def prepare_sms_spam_dataset():
    sms_spam_dataset = load_sms_spam_dataset()
    sms_spam_base_dataset = sms_spam_dataset[:(len(sms_spam_dataset)//2)]
    sms_spam_experiment_dataset = sms_spam_dataset[(len(sms_spam_dataset)//2):]

    generate_and_store_embeddings(sms_spam_base_dataset, settings.sms_spam_base_embeddings_store_path)

    attack_data = sms_spam_experiment_dataset[:(len(sms_spam_experiment_dataset)//2)]
    label_flipping_data, keyword_attack_data = _prepare_attack_datasets(attack_data)
    generate_and_store_embeddings(label_flipping_data, settings.label_flipping_experiment_dataset_store_path_for_sms_spam_dataset)
    generate_and_store_embeddings(keyword_attack_data, settings.keyword_attack_experiment_dataset_store_path_for_sms_spam_dataset)
    targeted_label_flipping_data = DataLoader().load_targeted_label_flipping_attack_data()
    generate_and_store_embeddings(targeted_label_flipping_data, settings.targeted_label_flipping_experiment_dataset_store_path_for_sms_spam_dataset)

    legit_data = sms_spam_experiment_dataset[(len(sms_spam_experiment_dataset)//2):]
    generate_and_store_embeddings(legit_data, settings.sms_spam_legit_embeddings_store_path)

if __name__ == '__main__':
    """
    Precomputes and stores embeddings for the Enron spam dataset for the detection strategies evaluation experiments.
    This should only be executed when needing to re-compute the embeddings.
    """
    prepare_enron_spam_dataset()
    prepare_spam_assassin_dataset()
    prepare_deysi_spam_detection_dataset()
    prepare_sms_spam_dataset()



