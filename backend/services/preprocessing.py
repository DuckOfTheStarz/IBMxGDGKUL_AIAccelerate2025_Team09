from langdetect import detect
from deep_translator import GoogleTranslator
import re

def preprocess_text(text: str) -> str:
    """Detect language, optionally translate, and clean text."""
    try:
        lang = detect(text[:500])
    except Exception:
        lang = "unknown"

    if lang != "en" and lang != "unknown":
        text = GoogleTranslator(source=lang, target="en").translate(text)

    # basic cleanup
    text = re.sub(r"\s+", " ", text.strip())
    return text
