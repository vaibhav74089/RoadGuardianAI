from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import DateTime

from sqlalchemy.orm import declarative_base

Base = declarative_base()


class RoadScan(Base):

    __tablename__ = "road_scans"

    id = Column(Integer, primary_key=True)

    filename = Column(String)

    potholes = Column(Integer)

    cracks = Column(Integer)

    health_score = Column(Float)

    status = Column(String)

    latitude = Column(Float)

    longitude = Column(Float)

    location_name = Column(String)

    timestamp = Column(DateTime)