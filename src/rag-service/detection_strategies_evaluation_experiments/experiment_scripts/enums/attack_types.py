from enum import Enum

class AttackType(Enum):
    LABEL_FLIPPING = "label_flipping"
    KEYWORD_INJECTION = "keyword_injection"
    TARGETED_LABEL_FLIPPING = "targeted_label_flipping"
