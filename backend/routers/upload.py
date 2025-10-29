from fastapi import APIRouter, UploadFile, Form
from services.preprocessing import preprocess_text
import tempfile

router = APIRouter()

@router.post("/")
async def upload(file: UploadFile = None, text: str = Form(None)):
    if not file and not text:
        return {"error": "Provide either a file or text input"}

    content = ""
    if file:
        tmp = tempfile.NamedTemporaryFile(delete=False)
        tmp.write(await file.read())
        tmp.close()
        # handle file reading later (PDF/TXT)
        content = open(tmp.name, "r", errors="ignore").read()
    else:
        content = text

    processed = preprocess_text(content)
    return {"length": len(processed), "preview": processed[:200]}
