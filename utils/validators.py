import re

def valid_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,}$"
    return re.match(pattern, email) is not None

def valid_password(password):
    return len(password)>=8
