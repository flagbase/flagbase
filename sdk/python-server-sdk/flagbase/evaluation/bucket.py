import xxhash
from typing import List, Dict

BUCKET_SIZE = 100

def precalculate_accumulated_weights(variations: List[Dict[str, int]]) -> List[int]:
    accumulated_weights = [0] * len(variations)
    current_bucket = 0
    for i, v in enumerate(variations):
        current_bucket += v['weight']
        accumulated_weights[i] = current_bucket
    return accumulated_weights

def derive_variation_with_accumulated_weights(
    salt: str,
    variations: List[Dict[str, int]],
    accumulated_weights: List[int],
) -> str:
    hash = xxhash.xxh64()
    hash.update(salt.encode())
    hash_val = hash.intdigest()
    user_bucket = hash_val % BUCKET_SIZE

    for i, current_bucket in enumerate(accumulated_weights):
        if user_bucket < current_bucket:
            return variations[i]['variationKey']

    return variations[len(variations) - 1]['variationKey']

def derive_variation(
    salt: str,
    variations: List[Dict[str, int]],
) -> str:
    accumulated_weights = precalculate_accumulated_weights(variations)
    return derive_variation_with_accumulated_weights(salt, variations, accumulated_weights)
