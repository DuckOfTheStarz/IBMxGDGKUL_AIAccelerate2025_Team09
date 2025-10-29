
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from ibm_watsonx_ai.foundation_models import Model
from ibm_watsonx_ai import Credentials

import re
from typing import Any, Tuple
import json

def process_parallel_jsons(json_left: Any, json_right: Any, text_key: str = "para") -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Given two JSON objects (already-loaded Python structures),
    return two aligned DataFrames with columns ['para', 'para_number'],
    dropping rows where neither side contains a digit in 'para'.
    """
    def normalize_to_df(json_obj: Any) -> pd.DataFrame:
        # Accept list[dict] or dict; coerce to DataFrame
        if isinstance(json_obj, list):
            base = pd.DataFrame(json_obj)
        else:
            base = pd.DataFrame([json_obj])
        # Explode the nested paragraphs
        exploded = base.explode(text_key, ignore_index=True)
        nested = pd.json_normalize(exploded[text_key])
        out = exploded.drop(columns=[text_key]).join(nested)
        # Ensure only desired columns returned if present
        cols = [c for c in ["para", "para_number"] if c in out.columns]
        return out[cols].copy() if cols else out.copy()
    
    def remove_special_characters(text):
        return re.sub(r'[\n\t]', '', text)

    left_df = normalize_to_df(json_left)
    right_df = normalize_to_df(json_right)

    # Align lengths and indices
    n = min(len(left_df), len(right_df))
    left = left_df.reset_index(drop=True).iloc[:n].copy()
    right = right_df.reset_index(drop=True).iloc[:n].copy()

    left["para"] = left["para"].apply(remove_special_characters)
    right["para"] = right["para"].apply(remove_special_characters)

    # Filter: keep if either side has any digit in 'para'
    left_has_num = left["para"].astype(str).str.contains(r"\d", regex=True, na=False) if "para" in left.columns else pd.Series([False]*n)
    right_has_num = right["para"].astype(str).str.contains(r"\d", regex=True, na=False) if "para" in right.columns else pd.Series([False]*n)
    keep = left_has_num | right_has_num

    return left[keep].reset_index(drop=True), right[keep].reset_index(drop=True)

WATSONX_URL = "https://eu-de.ml.cloud.ibm.com"

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {WATSONX_API_KEY}",
}

SIMILARITY_THRESHOLD = 0.94  # tune this experimentally
PROMPT = """
Compare the following two paragraphs — one in English and one in German — and list only the factual differences between them. 
Focus on numbers, dates, names, and measurable data. 
Ignore translation or stylistic differences. 
If there are no factual differences, return "No differences found.
"""

async def model2(doc1,doc2): #TODO
    creds = Credentials(
        url=WATSONX_URL,
        api_key=WATSONX_API_KEY
    )

    params = {
        "max_new_tokens": 100,
        "temperature": 0.7,
    }

    model = Model(
        model_id="ibm/granite-3-3-8b-instruct",
        credentials=creds,
        project_id="01633454-ef09-4635-9e28-2bed4c90724c",
        params=params
    )

    completed_prompt = PROMPT + f"\nEnglish paragraph: {doc1}\nGerman paragraph: {doc2}\n Return only a concise list of factual differences." 
    response = model.generate(prompt=completed_prompt)
    print(response['results'][0]['generated_text'])
    return response['results'][0]['generated_text'] #TODO

# async def analyze_docs(doc1: str, doc2: str):
#     """
#     Step 1: Compare documents via embeddings (BERT)
#     Step 2: If below threshold, call watsonx.ai for detailed mismatch detection
#     """
#     # --- Result container ---
#     results = []

#     # --- Clean up input documents, turned into pandas lists ---
#     cdoc1,cdoc2 = process_parallel_jsons(doc1,doc2)

#     for para1,para2 in zip(cdoc1,cdoc2):
#         # --- Step 1: Compute embeddings ---
#         emb1 = bert_model.encode(para1, convert_to_tensor=True)
#         emb2 = bert_model.encode(para2, convert_to_tensor=True)

#         similarity = util.cos_sim(emb1, emb2).item()

#         # --- Step 2: If similarity high enough, skip detailed check ---
#         if similarity < SIMILARITY_THRESHOLD:
#             # --- Step 3: If not similar enough, call Watson for detailed comparison ---
#             structured = await watsonx_request(para1, para2)
#             print(structured)
#             results.append({ #TODO
#                 "para1": para1,
#                 "para2": para2,
#                 "similarity": similarity,
#                 "detailed_differences": structured
#             })
#         else : 
#             results.append({
#                 "para1": para1,
#                 "para2": para2,
#                 "similarity": similarity,
#                 "detailed_differences": None
#             })
#     #return results #TODO


async def analyze_docs(doc1:str,doc2:str,
                          model_name: str = "intfloat/multilingual-e5-large",
                          batch_size: int = 16):
    """
    Generates embeddings for English and target-language paragraphs,
    computes cosine similarity for each pair, and filters out pairs
    with similarity >= similarity_threshold.

    Returns filtered proc_en and proc_de DataFrames in place.
    """
    # --- STEP 0 : Setup and Clean data -----
    print("Cleaning and processing input documents...")
    proc_en,proc_de = process_parallel_jsons(doc1,doc2)

    # ---- STEP 1 : Generate embeddings ----

    # Load the multilingual embedding model
    print("Loading embedding model...")
    model = SentenceTransformer(model_name)

    # Create embeddings for language 1
    print
    texts_en = [f"passage: {p}" for p in proc_en["para"]]
    embeddings_en = model.encode(
        texts_en,
        batch_size=batch_size,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True
    )
    proc_en["embedding"] = embeddings_en.tolist()

    # Create embeddings for language 2
    print("Creating embeddings for language 2...")
    texts_de = [f"passage: {p}" for p in proc_de["para"]]
    embeddings_de = model.encode(
        texts_de,
        batch_size=batch_size,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True
    )
    proc_de["embedding"] = embeddings_de.tolist()

    # --- STEP 3: Compute cosine similarities and filter ---
    results = []
    for i in range(len(proc_en)): # para1,para2 in zip(proc_en["embedding"],proc_de["embedding"]):
        print("Paragraphs ",i,": ")
        similarity = cosine_similarity(
            [proc_en["embedding"][i]],
            [proc_de["embedding"][i]])[0][0]

        if similarity < SIMILARITY_THRESHOLD:
            # If not similar enough, call Watson for detailed comparison
            structured = await model2(proc_en["para"][i], proc_de["para"][i])
            results.append({ #TODO
                "para1": proc_en["para"][i],
                "para2": proc_de["para"][i],
                "similarity": similarity,
                "detailed_differences": structured
            })
        else : 
            results.append({
                "para1": proc_en["para"][i],
                "para2": proc_de["para"][i],
                "similarity": similarity,
                "detailed_differences": None
            })

    return results

def func():
    print("Starting test run...")
    # loads doc 1 and doc 2 from data folder
    with open("../../data/doc1.json", "r") as f:
        doc1 = json.load(f)
    print("Loaded doc1")
    with open("../../data/doc2.json", "r") as f:
        doc2 = json.load(f)
    print("Loaded doc2")
    import asyncio
    result = asyncio.run(analyze_docs(doc1,doc2))
    print(result)
    return result
