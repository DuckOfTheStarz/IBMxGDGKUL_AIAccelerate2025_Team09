import aiohttp
from config import WATSONX_API_KEY, WATSONX_URL
from services.detection import parse_inconsistencies

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {WATSONX_API_KEY}",
}

async def analyze_docs(doc1: str, doc2: str):
    """Call watsonx.ai API with two documents and return structured mismatches."""
    payload = {
        "model_id": "meta-llama/llama-3-2-11b-vision-instruct",
        "input": [
            {
                "role": "user",
                "content": f"Compare these two documents and highlight inconsistencies:\n\nDoc1:\n{doc1}\n\nDoc2:\n{doc2}"
            }
        ],
        "parameters": {"temperature": 0.2, "max_new_tokens": 800}
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(f"{WATSONX_URL}/v1/generate", headers=HEADERS, json=payload) as resp:
            data = await resp.json()

    text_output = data.get("results", [{}])[0].get("generated_text", "")
    structured = parse_inconsistencies(text_output)
    return structured
