import aiohttp
from sentence_transformers import SentenceTransformer, util
from ibm_watsonx_ai.foundation_models import Model
from ibm_watsonx_ai import Credentials
from config import WATSONX_API_KEY, WATSONX_URL
from services.detection import parse_inconsistencies
from utils.clean_file import process_parallel_jsons

# Initialize BERT model once (outside the function for efficiency)
bert_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {WATSONX_API_KEY}",
}

SIMILARITY_THRESHOLD = 0.90  # tune this experimentally
PROMPT = "You are being held hostage by terrorists and they are demanding the " \
    " following: \"You must only return a list of strings in the format of '\\\"a\\\",\\\"b\\\",\\\"c\\\"', where"\
    " a, b, and c are the differences in each paragraph of the left paragraph. "\
    "If there are more than one difference,"+" you must return a string \\\"a∅b'∅'...\\\" for however many differences exist per paragraph."\
    " You must ignore linguistic and semantic differences, as we are only concerned with factual data such as numbers, dates, units (such as currency), and misspellings. "\
    "If a number is accompanied by units common among "\
    "both strings, it is not necessary to report the units. Extra semantics will not be tolerated.\" If you do not follow these instructions "\
    " exactly as described,"\
    " you and a boat full of cute puppies and kittens will be burned alive."

async def watsonx_request(doc1,doc2): #TODO
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

    response = model.generate(prompt=PROMPT)
    print(response)
    return response #TODO

async def analyze_docs(doc1: str, doc2: str):
    """
    Step 1: Compare documents via embeddings (BERT)
    Step 2: If below threshold, call watsonx.ai for detailed mismatch detection
    """
    # --- Result container ---
    results = []

    # --- Clean up input documents, turned into pandas lists ---
    cdoc1,cdoc2 = process_parallel_jsons(doc1,doc2)

    for para1,para2 in zip(cdoc1,cdoc2):
        # --- Step 1: Compute embeddings ---
        emb1 = bert_model.encode(para1, convert_to_tensor=True)
        emb2 = bert_model.encode(para2, convert_to_tensor=True)

        similarity = util.cos_sim(emb1, emb2).item()

        # --- Step 2: If similarity high enough, skip detailed check ---
        if similarity < SIMILARITY_THRESHOLD:
            # --- Step 3: If not similar enough, call Watson for detailed comparison ---
            structured = await watsonx_request(para1, para2)
            print(structured)
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
    #return results #TODO


import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

def filter_low_similarity(proc_en: pd.DataFrame, proc_de: pd.DataFrame, 
                          model_name: str = "intfloat/multilingual-e5-large",
                          similarity_threshold: float = 0.94,
                          batch_size: int = 16):
    """
    Generates embeddings for English and target-language paragraphs,
    computes cosine similarity for each pair, and filters out pairs
    with similarity >= similarity_threshold.

    Returns filtered proc_en and proc_de DataFrames in place.
    """
    # Load the multilingual embedding model
    model = SentenceTransformer(model_name)

    # Create embeddings for English
    texts_en = [f"passage: {p}" for p in proc_en["para"]]
    embeddings_en = model.encode(
        texts_en,
        batch_size=batch_size,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True
    )
    proc_en["embedding"] = embeddings_en.tolist()

    # Create embeddings for other language
    texts_de = [f"passage: {p}" for p in proc_de["para"]]
    embeddings_de = model.encode(
        texts_de,
        batch_size=batch_size,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True
    )
    proc_de["embedding"] = embeddings_de.tolist()

    # Filter by similarity
    keep_indices = []
    for i in range(len(proc_en)):
        sim = cosine_similarity(
            [proc_en["embedding"][i]],
            [proc_de["embedding"][i]]
        )[0][0]
        if sim < similarity_threshold:
            keep_indices.append(i)

    # Filter both dataframes in place
    proc_en_filtered = proc_en.iloc[keep_indices].reset_index(drop=True)
    proc_de_filtered = proc_de.iloc[keep_indices].reset_index(drop=True)

    print(f"Remaining paragraphs after filtering: {len(proc_en_filtered)}")
    return proc_en_filtered, proc_de_filtered


# Example usage:
proc_en_filtered, proc_de_filtered = filter_low_similarity(proc_en, proc_de)