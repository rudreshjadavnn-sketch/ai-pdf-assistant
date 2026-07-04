from flask import Blueprint
from flask import jsonify
from flask import request

from services.auth_service import AuthService
from utils.jwt_utils import decode_token


profile_bp = Blueprint(
    "profile",
    __name__
)


def get_current_user():

    auth_header = request.headers.get(
        "Authorization"
    )

    if not auth_header:

        return None

    try:

        token = auth_header.split(" ")[1]

    except IndexError:

        return None

    payload = decode_token(token)

    if not payload:

        return None

    return payload["user_id"]


@profile_bp.route(
    "/me",
    methods=["GET"]
)
def profile():

    user_id = get_current_user()

    if not user_id:

        return jsonify({
            "message": "Unauthorized"
        }), 401

    response, status = AuthService.get_profile(
        user_id
    )

    return jsonify(response), status


@profile_bp.route(
    "/update-name",
    methods=["PUT"]
)
def update_name():

    user_id = get_current_user()

    if not user_id:

        return jsonify({
            "message": "Unauthorized"
        }), 401

    data = request.get_json()

    response, status = AuthService.update_name(

        user_id,

        data.get("name")

    )

    return jsonify(response), status


@profile_bp.route(
    "/change-password",
    methods=["PUT"]
)
def change_password():

    user_id = get_current_user()

    if not user_id:

        return jsonify({
            "message": "Unauthorized"
        }), 401

    data = request.get_json()

    response, status = AuthService.change_password(

        user_id,

        data.get("current_password"),

        data.get("new_password")

    )

    return jsonify(response), status