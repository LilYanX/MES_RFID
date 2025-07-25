from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import article_info, dashboard, historic, inventory, steps, statistics, articles, portals
from OAuth_service.routes.OAuthRoutes import router as OAuthRoutes
from Inventory_service.routes.InventoryRoutes import router as InventoryRoutes

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
app.include_router(portals.router, prefix="/api")

#OAuth-service
app.include_router(OAuthRoutes, prefix="/api/auth", tags=["Users"])

#Inventory-service
app.include_router(InventoryRoutes, prefix="/api/inventory", tags=["Inventory"])


@app.get("/", tags=["Home"])
def read_root():
    return {"message": "MES API is running"}
