from flask import Blueprint

detection_bp = Blueprint(
    "detection",
    __name__
)

@detection_bp.route("/detect")
def detect():
    return {
        "message": "Detection route working"
    }