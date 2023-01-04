from pydantic import BaseModel
from datetime import datetime


#Map models
class MapBase(BaseModel):
    mapName: str
    mapDescription: str | None = None
    mapAuthor: str
    mapFile: bytes
    mapScnrObjectCount: int
    mapTotalObject: int
    mapBudgetCount:int | None = None

#Inherits from MapBase
class MapCreate(MapBase):
    variantId: int | None = None
    mapTags: str  | None = None
    mapUserDesc: str | None = None
    pass

#Inherits from MapBase
class Map(MapBase):
    mapId: int
    owner_id: int

    class Config:
        orm_mode = True

#Map query without file
class MapQuery(BaseModel):
    id: int
    mapName: str
    mapDescription: str | None = None
    mapAuthor: str
    mapScnrObjectCount: int
    mapTotalObject: int
    map_downloads: int | None = None
    mapBudgetCount:int | None = None
    variant_id:int | None = None
    mapTags: str
    time_created: datetime = None

    class Config:
        orm_mode = True

class VariantQuery(BaseModel):
    id: int
    variantName: str
    variantDescription: str | None = None
    variantAuthor: str
    time_created: str | None = None
    time_updated: str | None = None
    owner_id: int
    downloads: int
    variantFileName: str


#Variant models
class VariantBase(BaseModel):
    variantName: str
    variantDescription: str | None = None
    variantAuthor: str
    variantFile: bytes
    variantFile: str

#Inherits from VariantBase
class VariantCreate(VariantBase):
    pass

#Inherits from VariantBase
class Variant(VariantBase):
    variantId: int
    owner_id: int

    class Config:
        orm_mode = True

#User models
class UserBase(BaseModel):
    email: str
    name: str

#Inherits from UserBase
class UserCreate(UserBase):
    password: str

#Inherits from UserBase
class User(UserBase):
    id: int
    is_active: bool
    maps: list[Map] = []

    class Config:
        orm_mode = True

class PrefBase(BaseModel):
    prefabName: str
    prefabDescription: str
    prefabAuthor: str
    prefabFile: bytes

class PreFabCreate(PrefBase):
    pass

#Auth token
class Token(BaseModel):
    access_token: str
    token_type: str = None

#Token data
class TokenData(BaseModel):
    sub: str = None
    exp: int = None
