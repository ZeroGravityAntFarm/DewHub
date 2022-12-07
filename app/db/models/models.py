from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(128), unique=True, index=True)
    hashed_password = Column(String(128))
    is_active = Column(Boolean, default=True)

    items = relationship("Map", back_populates="owner")


class Map(Base):
    __tablename__ = "maps"

    id = Column(Integer, primary_key=True, index=True)
    mapName = Column(String(128), index=True)
    mapDescription = Column(String(1200), index=True)
    mapAuthor = Column(String(128), index=True)
    mapId = Column(Integer, index=True)
    mapScnrCount = Column(Integer, index=True)
    mapTotalObject = Column(Integer, index=True)
    mapBudgetCount = Column(Integer, index=True)
    variantName = Column(String(128), index=True)
    variantType = Column(String(64), index=True)
    variantAuthor = Column(String(128), index=True)
    variantDescription = Column(String(1200), index=True)

    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="maps")