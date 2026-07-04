from flask import Blueprint, jsonify, request
from services.pdf_service import PdfService
from utils.jwt_utils import decode_token

pdf_bp = Blueprint("pdf",__name__)

@pdf_bp.route("/upload",methods=["POST"])
def upload_pdf():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({
            "message": "Token is missing"
        }),401
    try:
        token = auth_header.split(" ")[1]
    except IndexError:
        return jsonify({
            "message": "Invalid token format"
        }),401
    payload = decode_token(token)
    if not payload:
        return jsonify({
            "message": "Invalid or expired token"
        }),401
    user_id = payload["user_id"]
    file = request.files.get("file")

    response, status = PdfService.upload_pdf(file, user_id)
    return jsonify(response), status

@pdf_bp.route("/list",methods=["GET"])
def list_pdfs():

    auth_header = request.headers.get(
        "Authorization"
    )

    if not auth_header:

        return jsonify({
            "message": "Token missing"
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
            "message": "Invalid token"
        }), 401

    response, status = PdfService.get_pdfs(
        payload["user_id"]
    )

    return jsonify(response), status

@pdf_bp.route("/delete/<document_id>",methods=["DELETE"])
def delete_pdf(document_id):
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

    response,status=PdfService.delete_pdf(

        payload["user_id"],

        document_id

    )

    return jsonify(response),status