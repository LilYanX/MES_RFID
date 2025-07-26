from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Récupérer les identifiants depuis les variables d'environnement
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("La variable d'environnement MONGO_URI n'est pas définie")

# Créer le client MongoDB
client = MongoClient(MONGO_URI, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Connected to MongoDB Atlas successfully!")
except Exception as e:
    print("Connection failed:", e)
    raise
