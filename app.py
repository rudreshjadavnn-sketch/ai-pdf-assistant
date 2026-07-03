from flask import Flask
from config import config
from database.mongodb import client
from routes.auth import auth_bp

app = Flask(__name__)
app.config["SECRET_KEY"] = config.SECRET_KEY
app.register_blueprint(auth_bp)

@app.route("/")
def home():
    return "AI PDF Assistant Backend Running"

if __name__ == "__main__":
    try:
        client.admin.command("ping")
        print("Mongodb created successfully")
    except Exception as e:
        print("Mongodb connection failed")
        print(e)

    app.run(debug=True)
