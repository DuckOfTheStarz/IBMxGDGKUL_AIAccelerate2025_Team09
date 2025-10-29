from fastapi import APIRouter
from utils.storage import get_doc
from services.watsonx_client import analyze_docs

router = APIRouter()

@router.post("/")
async def compare():
    doc1 = get_doc(1)
    doc2 = get_doc(2)

    if not doc1 or not doc2:
        return {"error": "Both documents must be uploaded before comparing."}

    result = await analyze_docs(doc1, doc2)
    return result
