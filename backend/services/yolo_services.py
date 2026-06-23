from ultralytics import YOLO

model = None

def load_model(model_path):
    global model

    model = YOLO(model_path)

    return model