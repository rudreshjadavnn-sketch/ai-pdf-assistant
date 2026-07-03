from datetime import datetime   

class User:
    @staticmethod
    def create_user(name,email,password):
        return{
            "name": name,
            "email": email,
            "password": password,
            "createdAt": datetime.utcnow()
        }