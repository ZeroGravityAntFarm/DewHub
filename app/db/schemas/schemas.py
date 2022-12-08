from pydantic import BaseModel


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
    pass

#Inherits from MapBase
class Map(MapBase):
    mapId: int
    owner_id: int

    class Config:
        orm_mode = True

#Map query without file
class MapQuery(BaseModel):
    mapName: str
    mapDescription: str | None = None
    mapAuthor: str
    mapScnrObjectCount: int
    mapTotalObject: int
    mapBudgetCount:int | None = None
    variant_id:int | None = None


    class Config:
        orm_mode = True


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