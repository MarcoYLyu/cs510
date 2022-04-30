from flask import Blueprint, request, session, jsonify

main = Blueprint("main", __name__)

@main.route("/", methods=["GET", "POST"])
def home():
    if (request.method == "GET"):
        response = "Hello World"
        return jsonify({"data": response})