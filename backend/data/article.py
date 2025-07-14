from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://admin:G0%40tDesEchecs@dbrfid.ojrspq8.mongodb.net/?retryWrites=true&w=majority&appName=DBRFID"
client = MongoClient(uri, server_api=ServerApi('1'))

db = client["mes_rfid"]
articles_col = db["articles"]

data = [
    {
        "uuid": "78CBBC9E",
        "type": "Pantalon",
        "color": "Bleu marine",
        "size": "L",
        "material": "Coton",
        "washing_time_min": 35,
        "drying_time_min": 25,
        "pre_treatment": "Anti-tâches",
        "care_label": "Lavage à 40°C, ne pas blanchir",
        "dispatch_zone": "Nord",
        "quality_requirements": "Inspection visuelle, vérification couture",
        "notes": "Article fragile, éviter surcharges"
    },
    {
        "uuid": "8DA8DDBD",
        "type": "Blouse",
        "color": "Blanc",
        "size": "M",
        "material": "Polyester",
        "washing_time_min": 30,
        "drying_time_min": 20,
        "pre_treatment": "Désinfection",
        "care_label": "Lavage à 60°C, séchage modéré",
        "dispatch_zone": "Centre",
        "quality_requirements": "Contrôle bactérien",
        "notes": "Utilisé en milieu hospitalier"
    },
    {
        "uuid": "56A99065",
        "type": "Drap",
        "color": "Gris clair",
        "size": "XL",
        "material": "Coton/Polyester",
        "washing_time_min": 40,
        "drying_time_min": 35,
        "pre_treatment": "Adoucissant",
        "care_label": "Lavage à 90°C, séchage complet",
        "dispatch_zone": "Sud",
        "quality_requirements": "Pas de tâches, pliage parfait",
        "notes": "Haute rotation"
    }
]

# Insertion dans la collection
articles_col.insert_many(data)
print("✅ Articles inserted.")
