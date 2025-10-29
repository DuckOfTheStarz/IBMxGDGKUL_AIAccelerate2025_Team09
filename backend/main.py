from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, compare

app = FastAPI(title="Document Comparison API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(compare.router, prefix="/compare", tags=["Compare"])

@app.get("/")
def root():
    return {"status": "ok", "message": "API running"}
