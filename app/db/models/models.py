from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, LargeBinary
from sqlalchemy.orm import relationship

from db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), unique=True, index=True)
    email = Column(String(128), unique=True, index=True)
    role = Column(String(64), unique=False, index=True)
    hashed_password = Column(String(128))
    is_active = Column(Boolean, default=True)

    #Relationships
    maps = relationship("Map", back_populates="owner")
    variants = relationship("Variant", back_populates="owner")


class Map(Base):
    __tablename__ = "maps"

    id = Column(Integer, primary_key=True, index=True)
    mapName = Column(String(128), index=True)
    mapDescription = Column(String(1200), index=True)
    mapAuthor = Column(String(128), index=True)
    mapId = Column(Integer, index=True)
    mapScnrObjectCount = Column(Integer, index=True)
    mapTotalObject = Column(Integer, index=True)
    mapBudgetCount = Column(Integer, index=True)
    mapFile = Column(LargeBinary)

    #Relationships
    owner_id = Column(Integer, ForeignKey("users.id"))
    variant_id = Column(Integer, ForeignKey("variants.id"))
    owner = relationship("User", back_populates="maps")
    variant = relationship("Variant", back_populates="maps")


class Variant(Base):
    __tablename__ = "variants"

    id = Column(Integer, primary_key=True, index=True)
    variantName = Column(String(128), index=True)
    variantType = Column(String(64), index=True)
    variantAuthor = Column(String(128), index=True)
    variantDescription = Column(String(1200), index=True)
    variantFile = Column(LargeBinary)
    variantFileName = Column(String(32), index=True)

    #Relationships
    owner_id = Column(Integer, ForeignKey("users.id"))
    maps = relationship("Map", back_populates="variant")
    owner = relationship("User", back_populates="variants")