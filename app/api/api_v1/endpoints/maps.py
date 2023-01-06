from fastapi import APIRouter, Depends, HTTPException, Response, Request
from db.schemas import schemas
from db import controller
from db.session import SessionLocal
from internal.auth import get_current_user
from sqlalchemy.orm import Session
from os import listdir
from internal.limiter import limiter 
import json

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
@limiter.limit("60/minute")
def read_maps(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    maps = controller.get_maps(db, skip=skip, limit=limit)

    if maps:
        return maps

    else:
        raise HTTPException(status_code=400, detail="Maps not found")

#Get all variants
@router.get("/variants/")
@limiter.limit("60/minute")
def read_variants(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    variants = controller.get_variants(db, skip=skip, limit=limit)

    if variants:
        return variants

    else:
        raise HTTPException(status_code=400, detail="Variants not found")

#Get variant by id
@router.get("/variants/{variant_id}")
def read_variant(variant_id: int, db: Session = Depends(get_db)):
    variants = controller.get_variant_id(db, variant_id=variant_id)

    if variants:
        return variants

    else:
        raise HTTPException(status_code=400, detail="Variants not found")


#Get all Maps Newest first
@router.get("/maps/newest", response_model=list[schemas.MapQuery])
@limiter.limit("60/minute")
def read_maps_new(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    maps = controller.get_newest(db, skip=skip, limit=limit)

    if maps:
        return maps

    else:
        raise HTTPException(status_code=400, detail="Maps not found")

#Get all Maps Newest first
@router.get("/maps/downloaded", response_model=list[schemas.MapQuery])
@limiter.limit("60/minute")
def read_maps_downloaded(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    maps = controller.get_most_downloaded(db, skip=skip, limit=limit)

    if maps:
        return maps

    else:
        raise HTTPException(status_code=400, detail="Maps not found")

#Get all Maps Newest first
@router.get("/maps/oldest", response_model=list[schemas.MapQuery])
@limiter.limit("60/minute")
def read_maps_oldest(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    maps = controller.get_oldest(db, skip=skip, limit=limit)

    if maps:
        return maps

    else:
        raise HTTPException(status_code=400, detail="Maps not found")

#Get single map
@router.get("/maps/{map_id}")
def read_map(map_id: int, db: Session = Depends(get_db)):
    map = controller.get_map(db, map_id=map_id)

    if map:
        return map

    else:
        raise HTTPException(status_code=400, detail="Map not found")

#Delete Map entry 
@router.delete("/maps/{map_id}")
def read_map(map_id: int = 0, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    status, msg = controller.delete_map(db, map_id=map_id, user=user)

    if status:
        return HTTPException(status_code=200, detail="Map and variant deleted successfully")

    else:
        raise HTTPException(status_code=400, detail=msg)

#Get single map file
@router.get("/maps/{map_id}/file")
@limiter.limit("60/minute")
def read_map(request: Request, map_id: int, db: Session = Depends(get_db)):
    map_file = controller.get_map_file(db, map_id=map_id)

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
@router.get("/maps/{map_id}/variant/file")
@limiter.limit("60/minute")
def read_map(request: Request, map_id: int, db: Session = Depends(get_db)):
    variant = controller.get_variant_file(db, map_id=map_id)

    if variant:
        headers = {'Content-Disposition': 'attachment; filename=' + variant.variantFileName}
        return Response(variant.variantFile, headers=headers, media_type='application/octet-stream')

    else:
        raise HTTPException(status_code=400, detail="Variant file not found")


#Get single variant file
@router.get("/variants/{var_id}/file")
@limiter.limit("60/minute")
def read_map(request: Request, var_id: int, db: Session = Depends(get_db)):
    variant = controller.get_variant_id_file(db, var_id=var_id)

    if variant:
        headers = {'Content-Disposition': 'attachment; filename=' + variant.variantFileName}
        return Response(variant.variantFile, headers=headers, media_type='application/octet-stream')

    else:
        raise HTTPException(status_code=400, detail="Variant file not found")


#Get single variant file
@router.get("/maps/search/{search_text}")
def search_maps(search_text: str = 0, db: Session = Depends(get_db)):
    maps = controller.search_maps(db, search_text=search_text)

    return maps

