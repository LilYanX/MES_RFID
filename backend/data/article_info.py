# seed_info.py
from pymongo import MongoClient

client = MongoClient("mongodb+srv://...")
db = client["mes_rfid"]

articles = [
    {
        "uuid": "78CBBC9E",
        "type": "Chemise",
        "color": "Blanc",
        "material": "Coton",
        "size": "M",
        "wash_time": "12 min",
        "dry_time": "20 min",
        "nomenclature": "Program standard A"
    },
    {
        "uuid": "8DA8DDBD",
        "type": "Pantalon",
        "color": "Bleu marine",
        "material": "Polyester",
        "size": "L",
        "wash_time": "15 min",
        "dry_time": "25 min",
        "nomenclature": "Program renforcé B"
    },
    {
        "uuid": "56A99065",
        "type": "Blouse médicale",
        "color": "Vert",
        "material": "Mélange coton-polyester",
        "size": "S",
        "wash_time": "18 min",
        "dry_time": "30 min",
        "nomenclature": "Program hygiène C"
    }
]

db["article_info"].insert_many(articles)
print("Infos articles insérées.")
