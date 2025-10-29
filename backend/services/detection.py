import re

def parse_inconsistencies(output: str):
    """
    Convert AI or regex output into structured JSON with doc1/doc2 values.
    """
    segments = []
    for match in re.finditer(
        r"Segment:(.*)\nField:(.*)\nDoc1:(.*)\nDoc2:(.*)\nMismatch:(.*)\nConfidence:(.*)", 
        output
    ):
        segments.append({
            "segment": match.group(1).strip(),
            "field": match.group(2).strip(),
            "doc1_value": match.group(3).strip(),
            "doc2_value": match.group(4).strip(),
            "mismatch_type": match.group(5).strip(),
            "confidence": float(match.group(6).strip() or 0)
        })

    summary = {
        "total_segments": len(segments),
        "total_mismatches": sum(1 for s in segments if s["mismatch_type"] != "match"),
        "average_confidence": sum(s["confidence"] for s in segments)/max(len(segments),1)
    }

    return {"differences": segments, "summary": summary}
