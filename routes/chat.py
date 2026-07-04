from flask import Blueprint
from flask import request
from flask import jsonify

from services.ai_service import AIService
from services.chat_service import ChatService
from utils.jwt_utils import decode_token


chat_bp = Blueprint(
    "chat",
    __name__
)


@chat_bp.route(
    "/ask",
    methods=["POST"]
)
def ask_question():

    auth_header = request.headers.get(
        "Authorization"
    )

    if not auth_header:

        return jsonify({
            "message": "Token is missing"
        }), 401

    try:

        token = auth_header.split(" ")[1]

    except IndexError:

        return jsonify({
            "message": "Invalid token"
        }), 401

    payload = decode_token(token)

    if not payload:

        return jsonify({
            "message": "Invalid or expired token"
        }), 401

    user_id = payload["user_id"]

    data = request.get_json()

    question = data.get("question")
    document_id = data.get("document_id")

    if not question:

        return jsonify({
            "message": "Question is required"
        }), 400
    
    answer = AIService.ask_question(
        user_id,
        document_id,
        question
    )

    ChatService.save_chat(
        user_id=user_id,
        document_id=document_id,
        question=question,
        answer=answer
    )

    return jsonify({

        "question": question,

        "answer": answer

    }), 200
@chat_bp.route(
    "/history",
    methods=["GET"]
)
def get_history():

    auth_header = request.headers.get(
        "Authorization"
    )

    if not auth_header:

        return jsonify({
            "message": "Token missing"
        }), 401

    token = auth_header.split(" ")[1]

    payload = decode_token(token)

    if not payload:

        return jsonify({
            "message": "Invalid token"
        }), 401
    document_id = request.args.get("document_id")
    response, status = ChatService.get_chat_history(
        payload["user_id"],
        document_id
    )

    return jsonify(response), status

@chat_bp.route("/delete/<chat_id>",methods=["DELETE"])
def delete_chat(chat_id):

    auth_header = request.headers.get("Authorization")

    if not auth_header:

        return jsonify({
            "message":"Token missing"
        }),401

    token = auth_header.split(" ")[1]

    payload = decode_token(token)

    if not payload:

        return jsonify({
            "message":"Invalid token"
        }),401

    response,status = ChatService.delete_chat(

        payload["user_id"],

        chat_id

    )

    return jsonify(response),status