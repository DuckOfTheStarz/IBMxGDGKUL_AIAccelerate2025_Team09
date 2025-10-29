import pandas as pd
import re
from typing import Any, Tuple

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