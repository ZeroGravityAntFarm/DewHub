from sqlalchemy import Boolean, Column, ForeignKey, Integer, BigInteger, String, LargeBinary, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.session import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), unique=True, index=True)
    email = Column(String(128), unique=True, index=True)
    role = Column(String(64), unique=False, index=True)
    hashed_password = Column(String(128))
    is_active = Column(Boolean, default=True)
    last_login_ip = Column(String(64))
    last_login_time = Column(DateTime(timezone=True))
    prof_views = Column(Integer, index=True)
    rank = Column(String(64))
    about = Column(String(1200))
    time_created = Column(DateTime(timezone=True), default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    #Relationships
    maps = relationship("Map", back_populates="owner")
    mods = relationship("Mod", back_populates="owner")
    variants = relationship("Variant", back_populates="owner")
    prefabs = relationship("PreFab", back_populates="owner")
    webhooks = relationship("WebHook", back_populates="owner")

class Map(Base):
    __tablename__ = "maps"

    id = Column(Integer, primary_key=True, index=True)
    mapName = Column(String(128), index=True)
    mapDescription = Column(String(1200))
    mapAuthor = Column(String(128), index=True)
    mapId = Column(Integer, index=True)
    mapScnrObjectCount = Column(Integer, index=True)
    mapTotalObject = Column(Integer, index=True)
    mapBudgetCount = Column(Integer, index=True)
    mapBaseMap = Column(String(128), index=True)
    mapFile = Column(LargeBinary)
    notVisible = Column(Boolean)
    mapUserDesc = Column(String(1200)) 
    map_downloads = Column(Integer, index=True)
    map_rating = Column(Integer, index=True)
    mapTags = Column(String(64))
    gameVersion = Column(String(64))
    time_created = Column(DateTime(timezone=True), default=func.now())
    time_updated = Column(DateTime(timezone=True))

    #Relationships
    owner_id = Column(Integer, ForeignKey("users.id"))
    variant_id = Column(Integer, ForeignKey("variants.id"))
    owner = relationship("User", back_populates="maps")
    variant = relationship("Variant", back_populates="maps", cascade="all, delete")

class Mod(Base):
    __tablename__ = "mods"

    id = Column(Integer, primary_key=True, index=True)
    modName = Column(String(128), index=True)
    modDescription = Column(String(1200))
    modUserDescription = Column(String(1200))
    modAuthor = Column(String(128), index=True)
    modFileName = Column(String(128), index=True)
    modFileSize = Column(BigInteger, index=True)
    modVersion = Column(Integer, index=True)
    notVisible = Column(Boolean)
    mod_downloads = Column(Integer, index=True)
    modTags = Column(String(64))
    gameVersion = Column(String(64))
    time_created = Column(DateTime(timezone=True), default=func.now())
    time_updated = Column(DateTime(timezone=True))

    #Relationships
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="mods")

class Variant(Base):
    __tablename__ = "variants"

    id = Column(Integer, primary_key=True, index=True)
    variantName = Column(String(128), index=True)
    variantType = Column(String(64), index=True)
    variantAuthor = Column(String(128), index=True)
    variantDescription = Column(String(1200))
    variantFile = Column(LargeBinary)
    variantFileName = Column(String(32), index=True)
    time_created = Column(DateTime(timezone=True), default=func.now())
    time_updated = Column(DateTime(timezone=True))
    downloads = Column(Integer)
    gameVersion = Column(String(64))

    #Relationships
    owner_id = Column(Integer, ForeignKey("users.id"))
    maps = relationship("Map", back_populates="variant")
    owner = relationship("User", back_populates="variants")

class PreFab(Base):
    __tablename__ = "prefabs"
    
    id = Column(Integer, primary_key=True, index=True)
    prefabName = Column(String(128), index=True)
    prefabAuthor = Column(String(64), index=True)
    prefabDescription = Column(String(128), index=True)
    prefabFile = Column(LargeBinary)
    prefabFileName = Column(String(128))
    prefabTags = Column(String(128), index=True)
    downloads = Column(Integer)
    gameVersion = Column(String(64))
    time_created = Column(DateTime(timezone=True), default=func.now())
    time_updated = Column(DateTime(timezone=True))

    #Relationships
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="prefabs")


class WebHook(Base):
    __tablename__ = "webhooks"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, index=True)
    webhookname = Column(String(128), index=True)
    webhooktype = Column(String(128), index=True)
    webhookurl = Column(String(128), index=True)
    webhookenabled = Column(Boolean)


    #Relationships
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="webhooks")


class Vote(Base):
    __tablename__  = "voting"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"))
    mapId = Column(Integer, ForeignKey("maps.id"))
    vote = Column(Boolean)


class Tracking(Base):
    __tablename__  = "tracking"

    id = Column(Integer, primary_key=True, index=True)
    requestHash = Column(String(64))
