import jwt
from datetime import datetime,  timedelta
from config import config

def generate_token(user_id):
    payload = {
        "user_id": str(user_id),
        "exp": datetime.utcnow() + timedelta(days=7)
    }

    token = jwt.encode(
        payload,
        config.SECRET_KEY,
        algorithm = "HS256"
    )

    return token

def verify_token(token):
    try:
        payload = jwt.decode(
            token,
            config.SECRET_KEY,
            algorithm = ["HS256"]
        )

        return payload
    
    except jwt.ExpiredSignatureError:
        return None
    
    except jwt.InvalidTokenError:
        return None