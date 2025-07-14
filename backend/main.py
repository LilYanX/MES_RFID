from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import article, article_info, dashboard

app = FastAPI(
    title="MES RFID API",
    description="Track & manage textile articles via RFID process",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(article.router, prefix="/api")
app.include_router(article_info.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "MES API is running"}
