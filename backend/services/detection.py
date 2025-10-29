import re

def parse_inconsistencies(output: str):
    """Basic parser converting model output into structured JSON."""
    segments = []
    for match in re.finditer(r"Segment:(.*)\nField:(.*)\nMismatch:(.*)\nConfidence:(.*)", output):
        segments.append({
            "segment": match.group(1).strip(),
            "field": match.group(2).strip(),
            "mismatch_type": match.group(3).strip(),
            "confidence": float(match.group(4).strip() or 0)
        })
    return segments
