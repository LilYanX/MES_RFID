from pymongo import MongoClient

# Connexion au cluster MongoDB
MONGO_URI="mongodb+srv://admin:G0%40tDesEchecs@dbrfid.ojrspq8.mongodb.net/?retryWrites=true&w=majority&appName=DBRFID"
client = MongoClient(MONGO_URI)

# === BASE DE DONNÉES OAuth ===
db_oauth = client["OAuth"]
roles_collection = db_oauth["roles"]
users_collection = db_oauth["users"]

# Données de base pour les rôles
roles_data = [
    {
        "name": "admin",
        "description": "Full system access",
        "permissions": {
            "manage_users": True,
            "view_stats": True,
            "configure_system": True
        }
    },
    {
        "name": "operator",
        "description": "Access to tracking and execution functions",
        "permissions": {
            "manage_users": False,
            "view_stats": True,
            "configure_system": False
        }
    },
    {
        "name": "user",
        "description": "Restricted access, read-only",
        "permissions": {
            "manage_users": False,
            "view_stats": False,
            "configure_system": False
        }
    }
]

# Insertion avec vérification si existant
for role in roles_data:
    roles_collection.update_one({"name": role["name"]}, {"$set": role}, upsert=True)

# === BASE DE DONNÉES MES_RFID ===
db_mes = client["mes_rfid"]
alerts_collection = db_mes["alerts"]

# Exemple d’alerte
alert_example = {
    "name": "Portail 3 Offline",
    "trigger": {
        "type": "portal_status",
        "condition": "offline",
        "portal_id": "PORTAL_3"
    },
    "actions": {
        "send_email": True,
        "popup_dashboard": True,
        "log": True
    },
    "recipients": [
        {"type": "role", "target": "admin"},
        {"type": "role", "target": "operator"}
    ],
    "enabled": True,
    "created_at": "2025-07-25T10:00:00Z"
}

# Insertion d’une alerte d’exemple
alerts_collection.insert_one(alert_example)

print("✅ Rôles et alerte insérés avec succès.")
