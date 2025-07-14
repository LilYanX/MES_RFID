from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import article_info, dashboard, historic, inventory, steps, statistics, articles

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

app.include_router(article_info.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(historic.router, prefix="/api")
app.include_router(inventory.router, prefix="/api")
app.include_router(steps.router, prefix="/api")
app.include_router(statistics.router, prefix="/api")
app.include_router(articles.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "MES API is running"}
