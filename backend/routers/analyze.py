from fastapi import APIRouter
from services.watsonx_client import analyze_docs
from utils.cache import cache_results

router = APIRouter()

@router.post("/")
async def analyze(docs: dict):
    """
    Expected JSON:
    {
        "doc1": "string text",
        "doc2": "string text"
    }
    """
    result = await analyze_docs(docs.get("doc1", ""), docs.get("doc2", ""))
    cache_results("latest", result)
    return {"status": "ok", "results": result}
