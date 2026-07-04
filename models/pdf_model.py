from datetime import datetime


class Pdf:

    @staticmethod
    def create_pdf(
        user_id,
        filename,
        original_filename,
        file_path,
        file_size
    ):

        return {

            "user_id": user_id,

            "filename": filename,

            "original_filename": original_filename,

            "file_path": file_path,

            "file_size": file_size,

            "status": "processing",

            "pages": 0,

            "chunks": 0,

            "created_at": datetime.utcnow(),

            "updated_at": datetime.utcnow()

        }