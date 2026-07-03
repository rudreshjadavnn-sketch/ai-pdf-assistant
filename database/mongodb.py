from pymongo import MongoClient
from config import config

client = MongoClient(config.MONGO_URI)
db = client["ai_pdf_assitant"]
users_collection = db["users"]
documents_collection = db["documents"]
chats_collection = db['chats']
