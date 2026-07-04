import jwt
from datetime import datetime,  timedelta
from config import config

def generate_token(user_id):
    payload = {
        "user_id": str(user_id),
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow()
    }

    token = jwt.encode(
        payload,
        config.SECRET_KEY,
        algorithm = "HS256"
    )

    return token

def decode_token(token):
    try:
        payload = jwt.decode(
            token,
            config.SECRET_KEY,
            algorithms = ["HS256"]
        )

        return payload
    
    except jwt.ExpiredSignatureError:
        return None
    
    except jwt.InvalidTokenError:
        return None