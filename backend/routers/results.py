from fastapi import APIRouter
from utils.cache import get_cached

router = APIRouter()

@router.get("/")
async def get_results():
    cached = get_cached("latest")
    if not cached:
        return {"error": "No results cached yet"}
    return cached
