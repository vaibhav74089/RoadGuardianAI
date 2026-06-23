from models.road_scan import Base
from services.db_service import engine

Base.metadata.create_all(bind=engine)

print("Database Created Successfully")