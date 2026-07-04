from datetime import datetime


class Chat:

    @staticmethod
    def create_chat(
        user_id,
        document_id,    
        question,
        answer
    ):

        return {
            "user_id": user_id,
            "document_id": document_id,
            "question": question,
            "answer": answer,
            "created_at": datetime.utcnow()
        }