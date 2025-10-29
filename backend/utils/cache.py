from functools import lru_cache

_memory_cache = {}

def cache_results(key: str, value):
    _memory_cache[key] = value

def get_cached(key: str):
    return _memory_cache.get(key)
