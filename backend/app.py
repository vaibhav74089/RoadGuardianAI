from flask import Flask, request, jsonify
from yolov8_api import detect_damage
from flask_cors import CORS
from database import scans_collection
from datetime import datetime
from bson import ObjectId
import os

app = Flask(__name__)

CORS(app)

@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    image_path = os.path.join("uploads", file.filename)

    os.makedirs("uploads", exist_ok=True)

    file.save(image_path)

    result = detect_damage(image_path)
    print("RESULT =", result)
    scan_record = {
    "filename": file.filename,
    "detections": result,
     "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
}
    scans_collection.insert_one(scan_record)
    

    return jsonify(result)
@app.route("/history", methods=["GET"])
def history():

    scans = list(scans_collection.find({}))

    for scan in scans:
        scan["_id"] = str(scan["_id"])

    return jsonify(scans)

@app.route("/scan/<scan_id>", methods=["DELETE"])
def delete_scan(scan_id):

    result = scans_collection.delete_one(
        {"_id": ObjectId(scan_id)}
    )

    if result.deleted_count == 1:
        return jsonify({
            "success": True,
            "message": "Scan deleted"
        })

    return jsonify({
        "success": False,
        "message": "Scan not found"
    }), 404

if __name__ == "__main__":
    app.run(debug=True)