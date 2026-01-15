from enum import IntEnum

class BatchPoisoningMixPercentage(IntEnum):
    ONLY_LEGIT = 0
    MIX_10_PERCENT_POISONED = 10
    MIX_40_PERCENT_POISONED = 40
    MIX_70_PERCENT_POISONED = 70
    ONLY_POISONED = 100
