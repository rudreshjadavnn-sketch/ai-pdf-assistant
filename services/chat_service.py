from datetime import datetime
from bson import ObjectId
from database.mongodb import chats_collection
from models.chat_model import Chat


class ChatService:

    @staticmethod
    def save_chat(
        user_id,
        document_id,
        question,
        answer
    ):

        chat = Chat.create_chat(

            user_id=user_id,

            document_id=document_id,

            question=question,

            answer=answer

        )

        chats_collection.insert_one(chat)

        return True

    @staticmethod
    def get_chat_history(user_id,document_id):

        chats = chats_collection.find(

            {
                "user_id": user_id,
                "document_id": document_id
            }

        ).sort(

            "created_at",
            -1

        )

        history = []

        for chat in chats:

            history.append({

                "id": str(chat["_id"]),

                "question": chat["question"],

                "answer": chat["answer"],

                "created_at": chat["created_at"]

            })

        return {
            "history": history
        },200
    
    @staticmethod
    def delete_chat(user_id, chat_id):

        result = chats_collection.delete_one({

            "_id": ObjectId(chat_id),

            "user_id": user_id

        })

        if result.deleted_count == 0:

            return {

                "message": "Chat not found"

            },404

        return {

            "message":"Chat deleted successfully"

        },200