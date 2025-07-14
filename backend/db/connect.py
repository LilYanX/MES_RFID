from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus

username = quote_plus("admin")
password = quote_plus("G0@tDesEchecs")

uri = f"mongodb+srv://{username}:{password}@dbrfid.ojrspq8.mongodb.net/?retryWrites=true&w=majority&appName=DBRFID"

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Connected to MongoDB Atlas successfully!")
except Exception as e:
    print("Connection failed:", e)
