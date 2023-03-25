import hashlib

def hash_keys(*keys: str) -> str:
    hasher = hashlib.sha256()

    for key in keys:
        hasher.update(key.encode())

    hash_bytes = hasher.digest()
    return hash_bytes.hex()

