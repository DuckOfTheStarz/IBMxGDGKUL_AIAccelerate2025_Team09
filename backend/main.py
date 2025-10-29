from fastapi import FastAPI
from routes import upload, analyze, results

app = FastAPI(title="Watsonx Inconsistency Detector", version="0.1")

# Routers
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(analyze.router, prefix="/analyze", tags=["Analyze"])
app.include_router(results.router, prefix="/results", tags=["Results"])

@app.get("/")
def root():
    return {"status": "ok", "message": "Watsonx Inconsistency API running"}
