from fastapi import APIRouter, Form, HTTPException, File, UploadFile, Depends
from db import controller
from db.session import SessionLocal
from sqlalchemy.orm import Session
from typing import List
from internal.dewreader import *
import json 

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
def upload(user_id: int = Form(...), files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    valid_variants = ['variant.zombiez', 'variant.ctf', 'variant.koth', 'variant.slayer', 'variant.assault', 'variant.vip', 'variant.jugg', 'variant.terries']

    if files == None:
        raise HTTPException(status_code=400, detail="Missing files")

    if len(files) > 2:
        raise HTTPException(status_code=400, detail="Unexpected file in request")

    if user_id == None:
        raise HTTPException(status_code=400, detail="Invalid request")

    for file in files:
        if file.filename == "sandbox.map":
            mapFile = file
        
        elif file.filename in valid_variants:
            variantFile = file

        elif file.filename not in valid_variants or "sandbox.map":
            raise HTTPException(status_code=400, detail="Invalid file {}".format(file.filename))

    mapContents = mapFile.file.read()
    #variantContents = variantFile.file.read()

    mapData = mapReader(mapFile.filename, mapContents)
    #dewVariant = variantReader(variantFile, variantContents)

    #mapData = dewMap.read()
    if mapData == 1:
        raise HTTPException(status_code=400, detail="Unexpected map file size")
    
    if mapData == 2:
        raise HTTPException(status_code=400, detail="Map file empty")

    #variantData = dewVariant.read()
    file.file.close()

    map_create = controller.create_user_map(db, map=mapData, user_id=user_id)
    #variant_create = controller.create_user_variant(variantData,  user_id=user_id)

    if map_create is None:
        raise HTTPException(status_code=404, detail="User not found")