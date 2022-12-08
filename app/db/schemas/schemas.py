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
    variantName: str | None = None
    variantType: str | None = None
    variantAuthor: str | None = None

#Inherits from MapBase
class MapCreate(MapBase):
    pass

#Inherits from MapBase
class Map(MapBase):
    mapId: int
    owner_id: int

    class Config:
        orm_mode = True

class MapQuery(BaseModel):
    mapName: str
    mapDescription: str | None = None
    mapAuthor: str
    mapScnrObjectCount: int
    mapTotalObject: int
    mapBudgetCount:int | None = None
    variantName: str | None = None
    variantType: str | None = None
    variantAuthor: str | None = None

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