from fastapi import APIRouter, Depends, HTTPException, Response
from db.schemas import schemas
from db import controller
from db.session import SessionLocal
from internal.auth import get_current_user
from sqlalchemy.orm import Session

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db

    finally:
        db.close()

#Get all Maps
@router.get("/maps/", response_model=list[schemas.MapQuery])
def read_maps(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    maps = controller.get_maps(db, skip=skip, limit=limit)

    if maps:
        return maps

    else:
        raise HTTPException(status_code=400, detail="Maps not found")

#Get single map
@router.get("/maps/{map_name}")
def read_map(map_name: str = 0, db: Session = Depends(get_db)):
    map = controller.get_map(db, map_name=map_name)

    if map:
        return map

    else:
        raise HTTPException(status_code=400, detail="Map not found")

#Delete Map entry 
@router.delete("/maps/{map_name}", )
def read_map(map_name: str = 0, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    status, msg = controller.delete_map(db, map_name=map_name, user=user)

    if status:
        return HTTPException(status_code=200, detail="Map and variant deleted successfully")

    else:
        raise HTTPException(status_code=400, detail=msg)

#Get single map file
@router.get("/maps/{map_name}/file")
def read_map(map_name: str = 0, db: Session = Depends(get_db)):
    map_file = controller.get_map_file(db, map_name=map_name)

    if map_file:
        headers = {'Content-Disposition': 'attachment; filename="sandbox.map"'}
        return Response(map_file.mapFile, headers=headers, media_type='application/octet-stream')

    else:
        raise HTTPException(status_code=400, detail="Map file not found")

#Get single variant
@router.get("/maps/{map_name}/variant")
def read_map(map_name: str = 0, db: Session = Depends(get_db)):
    variant = controller.get_variant(db, map_name=map_name)

    if variant:
        return variant

    else:
        raise HTTPException(status_code=400, detail="Variant file not found")


#Get single variant file
@router.get("/maps/{map_name}/variant/file")
def read_map(map_name: str = 0, db: Session = Depends(get_db)):
    variant = controller.get_variant_file(db, map_name=map_name)

    if variant:
        headers = {'Content-Disposition': 'attachment; filename=' + variant.variantFileName}
        return Response(variant.variantFile, headers=headers, media_type='application/octet-stream')

    else:
        raise HTTPException(status_code=400, detail="Variant file not found")