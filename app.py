from flask import Flask, redirect, url_for
from config import config
from database.mongodb import client
from routes.auth import auth_bp
from routes.pdf import pdf_bp
from routes.chat import chat_bp
from routes.profile import profile_bp

app = Flask(__name__)
app.config["SECRET_KEY"] = config.SECRET_KEY
app.register_blueprint(auth_bp)
app.register_blueprint(pdf_bp, url_prefix="/pdf")
app.register_blueprint(chat_bp, url_prefix="/chat")
app.register_blueprint(profile_bp, url_prefix="/profile")

@app.route("/")
def home():
    return redirect(url_for("auth.register"))


if __name__ == "__main__":
    try:
        client.admin.command("ping")
        print("Mongodb created successfully")
    except Exception as e:
        print("Mongodb connection failed")
        print(e)

    app.run(debug=True)
