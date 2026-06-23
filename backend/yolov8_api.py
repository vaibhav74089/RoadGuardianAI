from ultralytics import YOLO

model = YOLO("models/best.pt")

CLASS_NAMES = {
    0: "Longitudinal Crack",
    1: "Transverse Crack",
    2: "Alligator Crack",
    3: "Pothole"
}

def detect_damage(image_path):

    results = model.predict(
        source=image_path,
        conf=0.25
    )

    detections = []

    for r in results:
        for box in r.boxes:

            cls = int(box.cls[0])

            detections.append({
                "damage_type": CLASS_NAMES[cls],
                "confidence": float(box.conf[0])
            })

    return detections