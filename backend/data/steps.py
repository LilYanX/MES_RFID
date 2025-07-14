from pymongo import MongoClient
from datetime import datetime

# Connexion MongoDB Atlas
uri = "mongodb+srv://admin:G0%40tDesEchecs@dbrfid.ojrspq8.mongodb.net/?retryWrites=true&w=majority&appName=DBRFID"
client = MongoClient(uri)

# Sélection de la base et de la collection
db = client["mes_rfid"]
collection = db["process_steps"]

# Liste des étapes à insérer
steps = [
    {"step_id": 1, "step_name": "Collection & Intake", "reader_type": "Portal Reader"},
    {"step_id": 2, "step_name": "Automated Sorting", "reader_type": "Overhead Array"},
    {"step_id": 3, "step_name": "Pre-treatment", "reader_type": "Handheld Scanner"},
    {"step_id": 4, "step_name": "Wash Processing", "reader_type": "Tunnel Reader"},
    {"step_id": 5, "step_name": "Thermal Drying", "reader_type": "Exit Scanner"},
    {"step_id": 6, "step_name": "Quality Assurance", "reader_type": "Mobile Reader"},
    {"step_id": 7, "step_name": "Packaging & Dispatch", "reader_type": "Portal Reader"},
    {"step_id": 8, "step_name": "Delivery & Confirmation", "reader_type": "Mobile Scanner"},
]

# Ajout de la date d'insertion (optionnel)
for step in steps:
    step["created_at"] = datetime.utcnow()

# Insertion dans la collection
collection.delete_many({})  # Optionnel : nettoie la collection avant insertion
result = collection.insert_many(steps)

print(f"{len(result.inserted_ids)} étapes insérées dans la collection 'process_steps'")
