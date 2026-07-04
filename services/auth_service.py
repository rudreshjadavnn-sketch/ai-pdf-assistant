import bcrypt
from database.mongodb import users_collection
from models.user_model import User
from utils.validators import valid_email, valid_password
from utils.jwt_utils import generate_token
from bson import ObjectId

class AuthService:
    @staticmethod
    def register(name, email, password):
        existing_user = users_collection.find_one({"email":email})

        if existing_user:
            return {
                "message": "Email already exists"
            },409
        
        if not valid_email(email):
            return {
                "message": "Not valid email"
            },400
        if not valid_password(password):
            return {
                "message": "password must be at least 8 charcter"
            },400
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
            )
        user = User.create_user(
            name,
            email,
            hashed_password
        )

        users_collection.insert_one(user)
        return {
            "message":"Register successful"
        },201
    
    @staticmethod
    def login(email, password):

        user = users_collection.find_one({"email":email})
        if not user:
            return {
                "message": "Invalid email or password"
            },401
        
        if not bcrypt.checkpw(
            password.encode("utf-8"),
            user["password"]
        ):
            return {
                "message": "Invalid email or passeord"
            },401
        token = generate_token(user["_id"])

        return {
            "message": "Login sucsessful",
            "token": token,
            "user":{
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"]
            }
        },200
    @staticmethod
    def get_profile(user_id):

        user = users_collection.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        if not user:

            return {
                "message": "User not found"
            }, 404

        return {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }, 200

    @staticmethod
    def update_name(
        user_id,
        name
    ):

        if not name:

            return {
                "message": "Name is required"
            }, 400

        users_collection.update_one(
            {
                "_id": ObjectId(user_id)
            },

            {
                "$set": {
                    "name": name
                }
            }

        )

        return {
            "message": "Name updated successfully"
        }, 200

    @staticmethod
    def change_password(user_id,current_password,new_password):

        user = users_collection.find_one(
            {
                "_id": ObjectId(user_id)
            }

        )

        if not user:
            return {
                "message": "User not found"
            }, 404

        if not bcrypt.checkpw(
            current_password.encode("utf-8"),
            user["password"]
        ):
            return {
                "message": "Current password is incorrect"
            }, 400

        if not valid_password(new_password):
            return {
                "message": "Password must be at least 8 characters"
            }, 400
    
        hashed_password = bcrypt.hashpw(

            new_password.encode("utf-8"),

            bcrypt.gensalt()

        )

        users_collection.update_one(

            {
                "_id": ObjectId(user_id)
            },

            {
                "$set": {
                    "password": hashed_password
                }
            }

        )

        return {

            "message": "Password changed successfully"

        }, 200