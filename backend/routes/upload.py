from fastapi import APIRouter, UploadFile, Form
from services.preprocessing import preprocess_text
from utils.storage import store_doc
import tempfile

router = APIRouter()

@router.post("/doc/{doc_num}")
async def upload(doc_num: int, file: UploadFile = None, text: str = Form(None)):
    if doc_num not in [1,2]:
        return {"error": "doc_num must be 1 or 2"}

    if not file and not text:
        return {"error": "Provide either a file or text input"}

    content = ""
    if file:
        tmp = tempfile.NamedTemporaryFile(delete=False)
        tmp.write(await file.read())
        tmp.close()
        content = open(tmp.name, "r", errors="ignore").read()
    else:
        content = text

    processed = preprocess_text(content)
    store_doc(doc_num, processed) # todo use pandas instead ?
    return {"status": "ok", "doc_num": doc_num, "length": len(processed)}
