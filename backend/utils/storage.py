# Simple in-memory storage for demo
_storage = {
    "doc1": None,
    "doc2": None
}

def store_doc(doc_num: int, content: str):
    key = f"doc{doc_num}"
    _storage[key] = content

def get_doc(doc_num: int):
    key = f"doc{doc_num}"
    return _storage.get(key)
