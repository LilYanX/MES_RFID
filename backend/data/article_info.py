from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId

# Connexion MongoDB
uri = "mongodb+srv://admin:G0%40tDesEchecs@dbrfid.ojrspq8.mongodb.net/?retryWrites=true&w=majority&appName=DBRFID"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["mes_rfid"]
articles_collection = db["articles"]

# Données à mettre à jour
updates = [
    {
        "_id": ObjectId("68751be8ac60676fbcdadaba"),
        "name": "Work pants",
        "sales_price_ron": 89.99,
        "length_cm": 110,
        "hight_cm": 90,
        "quantity": 1
    },
    {
        "_id": ObjectId("68751be8ac60676fbcdadabb"),
        "name": "Medical gown",
        "sales_price_ron": 59.49,
        "length_cm": 95,
        "hight_cm": 85,
        "quantity": 1
    },
    {
        "_id": ObjectId("68751be8ac60676fbcdadabc"),
        "name": "Hospital sheet",
        "sales_price_ron": 129.00,
        "length_cm": 240,
        "hight_cm": 150,
        "quantity": 1
    }
]

# Mise à jour dans la base
for update in updates:
    article_id = update.pop("_id")
    articles_collection.update_one(
        {"_id": article_id},
        {"$set": update}
    )

print("✅ Mise à jour terminée.")