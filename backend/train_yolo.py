from pathlib import Path
from ultralytics import YOLO

def main():
    model = YOLO("yolov8n.pt")

    yaml_path = Path(__file__).parent.parent / "datasets" / "RDD2022_YOLO" / "data.yaml"

    print("Dataset:", yaml_path)

    model.train(
        data=str(yaml_path),
        epochs=3,
        imgsz=640,
        batch=16,
        device=0,
        workers=0
    )

if __name__ == "__main__":
    main()