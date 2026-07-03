import bcrypt
from database.mongodb import users_collection
from models.user_model import User
from utils.validators import valid_email, valid_password
from utils.jwt_utils import generate_token

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
    