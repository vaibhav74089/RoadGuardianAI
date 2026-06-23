import os

class Config:

    MODEL_PATH = os.getenv(
        "MODEL_PATH",
        "../models/best.pt"
    )

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///../database/roadguardian.db"
    )

    UPLOAD_FOLDER = os.getenv(
        "UPLOAD_FOLDER",
        "uploads"
    )

    RESULT_FOLDER = os.getenv(
        "RESULT_FOLDER",
        "results"
    )