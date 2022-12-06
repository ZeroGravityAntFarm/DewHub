from pydantic import BaseModel


class MapBase(BaseModel):
    mapName: str
    mapDescription: str | None = None


class MapCreate(MapBase):
    pass


class Map(MapBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool
    items: list[Item] = []

    class Config:
        orm_mode = True