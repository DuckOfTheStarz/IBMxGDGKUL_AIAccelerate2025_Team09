import aiohttp
import torch
from sentence_transformers import SentenceTransformer, util
from config import WATSONX_API_KEY, WATSONX_URL
from services.detection import parse_inconsistencies
from utils.clean_file import clean_text

# Initialize BERT model once (outside the function for efficiency)
bert_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {WATSONX_API_KEY}",
}

SIMILARITY_THRESHOLD = 0.90  # tune this experimentally

async def watsonx_request(doc1,doc2): #TODO
    payload = {
        "model_id": "meta-llama/llama-3-2-11b-vision-instruct",
        "input": [
            {
                "role": "user",
                "content": (
                    f"Compare these two legal paragraphs and highlight factual inconsistencies "
                    f"(numbers, dates, references). "
                    f"Return a JSON list of issues.\n\nDoc1:\n{doc1}\n\nDoc2:\n{doc2}"
                ),
            }
        ],
        "parameters": {"temperature": 0.2, "max_new_tokens": 800},
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(f"{WATSONX_URL}/v1/generate", headers=HEADERS, json=payload) as resp:
            data = await resp.json()

    text_output = data.get("results", [{}])[0].get("generated_text", "")
    structured = parse_inconsistencies(text_output) #TODO 
    return structured

async def analyze_docs(doc1: str, doc2: str):
    """
    Step 1: Compare documents via embeddings (BERT)
    Step 2: If below threshold, call watsonx.ai for detailed mismatch detection
    """
    # --- Result container ---
    results = []

    # --- Clean up input documents, turned into pandas lists ---
    cdoc1,cdoc2 = clean_text(doc1,doc2)

    for para1,para2 in zip(cdoc1,cdoc2):
        # --- Step 1: Compute embeddings ---
        emb1 = bert_model.encode(para1, convert_to_tensor=True)
        emb2 = bert_model.encode(para2, convert_to_tensor=True)

        similarity = util.cos_sim(emb1, emb2).item()

        # --- Step 2: If similarity high enough, skip detailed check ---
        if similarity < SIMILARITY_THRESHOLD:
            # --- Step 3: If not similar enough, call Watson for detailed comparison ---
            structured = await watsonx_request(para1, para2)
            results.append({ #TODO
                "para1": para1,
                "para2": para2,
                "similarity": similarity,
                "detailed_differences": structured
            })
        else : 
            results.append({
                "para1": para1,
                "para2": para2,
                "similarity": similarity,
                "detailed_differences": None
            })
    return results #TODO