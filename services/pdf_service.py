import os
import time
from bson import ObjectId
from werkzeug.utils import secure_filename
from database.mongodb import documents_collection
from models.pdf_model import Pdf
from services.embedding_service import EmbeddingService
from services.vector_service import VectorService

class PdfService:
    ALLOWED_EXTENSIONS = {"pdf"}
    @staticmethod
    def allowed_file(filename):
        return(
            "." in filename
            and filename.rsplit(".",1)[1].lower()
            in PdfService.ALLOWED_EXTENSIONS
        )
    
    @staticmethod
    def upload_pdf(file, user_id):
        if file is None:
            return {
                "message": "No file selected"
            },400
        
        if file.filename == "":
            return {
                "message": "No file selected"
            },400
        if not PdfService.allowed_file(file.filename):
            return {
                "message": "Only PDF files are allowed"
            },400
        filename = secure_filename(file.filename)

        unique_filename = (
            f"{int(time.time())}_{filename}"
        )

        upload_folder = os.path.join(
            "uploads",
            "pdf",
            str(user_id)
        )
        os.makedirs(
            upload_folder,
            exist_ok=True
        )

        file_path = os.path.join(
            upload_folder,
            unique_filename
        )

        file.save(file_path)

        document = Pdf.create_pdf(
            user_id=user_id,
            filename=unique_filename,
            original_filename=filename,
            file_path=file_path,
            file_size=os.path.getsize(file_path)
        )
        result=documents_collection.insert_one(document)
        document_id = str(result.inserted_id)

        extract_result = EmbeddingService.extract_text(
            file_path
        )

        if not extract_result["success"]:

            return {
                "message": extract_result["message"]
            }, 500

        text = extract_result["text"]

        pages = extract_result["pages"]

        chunks = VectorService.create_chunks(text)

        EmbeddingService.store_embeddings(

            user_id=user_id,

            document_id=document_id,

            chunks=chunks

        )

        documents_collection.update_one(

        {
            "_id": result.inserted_id
        },

        {
            "$set": {
 
                "pages": pages,

                "chunks": len(chunks),

                "status": "completed",

                "vector_db": True

            }

        }

        )
        return {

            "message": "PDF uploaded successfully",
            "document_id": document_id,
            "pages": pages,
            "chunks": len(chunks)
        }, 201
    
    @staticmethod
    def get_pdfs(user_id):

        documents = documents_collection.find(

            {
                "user_id": user_id
            }

        ).sort(

            "created_at",
            -1

        )

        pdfs = []

        for document in documents:

            pdfs.append({

                "id": str(document["_id"]),

                "name": document["original_filename"],

                "pages": document["pages"]

            })

        return {

            "documents": pdfs

        }, 200
    
    @staticmethod
    def delete_pdf(user_id, document_id):

        document = documents_collection.find_one({

            "_id": ObjectId(document_id),

            "user_id": user_id

        })

        if not document:

            return {

                "message": "Document not found"

            },404

        if os.path.exists(document["file_path"]):

            os.remove(document["file_path"])

        from database.chromadb import chroma_db

        chroma_db.delete_document(

            user_id,

            document_id

        )

        documents_collection.delete_one({

            "_id": ObjectId(document_id)

        })

        return {

            "message":"Document deleted successfully"

        },200