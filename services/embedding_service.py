import fitz
from sentence_transformers import SentenceTransformer
from database.chromadb import chroma_db

class EmbeddingService:
    @staticmethod
    def extract_text(pdf_path):
        try:
            document = fitz.open(pdf_path)
            text = ""
            total_pages = document.page_count
            for page in document:
                text+=page.get_text()
            document.close()
            return{
                "success": True,
                "text": text,
                "pages": total_pages
            }
        except Exception as e:
            return{
                "success": False,
                "message": str(e)
            }
    model = SentenceTransformer("all-MiniLM-L6-v2")

    @staticmethod
    def generate_embeddings(chunks):
        embeddings = EmbeddingService.model.encode(
            chunks,
            convert_to_numpy = True
        )

        return embeddings.tolist()
    @staticmethod
    def store_embeddings(user_id,document_id,chunks):
        embeddings = EmbeddingService.generate_embeddings(
            chunks
        )
        ids=[]
        metadatas=[]

        for index, chunk in enumerate(chunks):
            ids.append(f"{document_id}_{index}")
            metadatas.append({
                "document_id": document_id,
                "chunk_index": index
            })
        chroma_db.add_documents(
            user_id=user_id,
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas
        )
        return True