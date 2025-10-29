from fastapi import FastAPI
from routes import upload, compare

app = FastAPI(title="Document Comparison API")

app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(compare.router, prefix="/compare", tags=["Compare"])

@app.get("/")
def root():
    return {"status": "ok", "message": "API running"}
