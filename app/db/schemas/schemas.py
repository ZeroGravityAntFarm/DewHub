from pydantic import BaseModel


#Map models
class MapBase(BaseModel):
    mapName: str
    mapDescription: str | None = None
    mapAuthor: str
    mapFile: bytes
    mapScnrObjectCount: int
    mapTotalObject: int
    mapBudgetCount:int
    variantName: str
    variantType: str
    variantAuthor: str

#Inherits from MapBase
class MapCreate(MapBase):
    pass

#Inherits from MapBase
class Map(MapBase):
    mapId: int
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