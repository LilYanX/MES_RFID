from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os

# 🔧 Paramètres de connexion MongoDB
MONGO_URI="mongodb+srv://admin:G0%40tDesEchecs@dbrfid.ojrspq8.mongodb.net/?retryWrites=true&w=majority&appName=DBRFID"
DB_NAME = "mes_rfid"
COLLECTION_NAME = "portals"

# 🔁 Liste des 8 portails RFID correspondant aux étapes
portals_data = [
    {
        "_id": "RFID_001",
        "name": "Portail Entrée",
        "etape": "1 - Collection & Intake",
        "ip": "192.168.0.11",
        "etat": "offline",
        "last_activity": None,
        "type": "Lecteur UHF fixe",
        "firmware": "v1.0.0",
        "temperature": None,
        "commentaire": "Entrée du linge à l'arrivée"
    },
    {
        "_id": "RFID_002",
        "name": "Portail Tri",
        "etape": "2 - Automated Sorting",
        "ip": "192.168.0.12",
        "etat": "offline",
        "last_activity": None,
        "type": "Lecteur UHF",
        "firmware": "v1.0.0",
        "temperature": None,
        "commentaire": "Tri automatisé"
    },
    {
        "_id": "RFID_003",
        "name": "Portail Lavage",
        "etape": "3 - Washing",
        "ip": "192.168.0.13",
        "etat": "offline",
        "last_activity": None,
        "type": "Lecteur machine",
        "firmware": "v1.0.0",
        "temperature": None,
        "commentaire": "Détection en machine de lavage"
    },
    {
        "_id": "RFID_004",
        "name": "Portail Séchage",
        "etape": "4 - Drying",
        "ip": "192.168.0.14",
        "etat": "offline",
        "last_activity": None,
        "type": "Portail fixe",
        "firmware": "v1.0.0",
        "temperature": None,
        "commentaire": "Passage au séchage"
    },
    {
        "_id": "RFID_005",
        "name": "Portail Repassage",
        "etape": "5 - Ironing",
        "ip": "192.168.0.15",
        "etat": "offline",
        "last_activity": None,
        "type": "Station fixe",
        "firmware": "v1.0.0",
        "temperature": None,
        "commentaire": "État du linge après repassage"
    },
    {
        "_id": "RFID_006",
        "name": "Portail Contrôle",
        "etape": "6 - Quality Control",
        "ip": "192.168.0.16",
        "etat": "offline",
        "last_activity": None,
        "type": "Lecteur manuel",
        "firmware": "v1.0.0",
        "temperature": None,
        "commentaire": "Contrôle qualité"
    },
    {
        "_id": "RFID_007",
        "name": "Portail Stockage",
        "etape": "7 - Packaging & Storage",
        "ip": "192.168.0.17",
        "etat": "offline",
        "last_activity": None,
        "type": "Lecteur UHF",
        "firmware": "v1.0.0",
        "temperature": None,
        "commentaire": "Mise en stock automatisée"
    },
    {
        "_id": "RFID_008",
        "name": "Portail Expédition",
        "etape": "8 - Delivery",
        "ip": "192.168.0.18",
        "etat": "offline",
        "last_activity": None,
        "type": "Lecteur mobile",
        "firmware": "v1.0.0",
        "temperature": None,
        "commentaire": "Sortie des colis en livraison"
    }
]

def init_portals():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]

    # Supprimer la collection si elle existe (optionnel)
    if COLLECTION_NAME in db.list_collection_names():
        collection.drop()
        print("Collection existante supprimée.")

    # Insertion des portails
    result = collection.insert_many(portals_data)
    print(f"{len(result.inserted_ids)} portails insérés dans la collection '{COLLECTION_NAME}'.")

if __name__ == "__main__":
    init_portals()