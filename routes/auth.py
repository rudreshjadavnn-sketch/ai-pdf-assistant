from flask import Blueprint, request, jsonify, render_template
from services.auth_service import AuthService

auth_bp = Blueprint("auth",__name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    response, status = AuthService.register(
        name,
        email,
        password
    )

    return jsonify(response), status

@auth_bp.route("/register")
def register_page():
    return render_template("register.html")

@auth_bp.route("/login", methods=["GET"])
def login_page():
    return render_template("login.html")

@auth_bp.route("/login",methods=["POST"])
def login():
    data = request.get_json()
    response, status = AuthService.login(
        data.get("email"),
        data.get("password")
    )
    return jsonify(response), status

@auth_bp.route("/dashboard", methods=["GET"])
def dashboard():
    return render_template("dashboard.html")

