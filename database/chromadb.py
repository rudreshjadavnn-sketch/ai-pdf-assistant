import chromadb
from chromadb.config import Settings

class ChromaDB:
    def __init__(self):
        self.client = chromadb.PersistentClient(path="vector_store")
    
    def get_collection(self, user_id):
        collection_name = f"user_{user_id}"
        return self.client.get_or_create_collection(
            name=collection_name
        )
    
    def add_documents(self,user_id,ids,documents,embeddings,metadatas):
        collection = self.get_collection(user_id)
        collection.add(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas
        )
    def similarity_search(
            self,
            user_id,
            document_id,
            query_embedding,
            top_k=5
    ):
        collection = self.get_collection(user_id)
        return collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where={
                "document_id": document_id
            }
        )
    def delete_document(self,user_id,document_id):
        collection = self.get_collection(user_id)
        collection.delete(
            where={
                "document_id": document_id
            }
        )
chroma_db = ChromaDB()