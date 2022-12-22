from fastapi import APIRouter, Form, HTTPException, File, UploadFile, Depends
from db import controller
from db.session import SessionLocal
from sqlalchemy.orm import Session
from typing import List
from internal.auth import get_current_user
from internal.dewreader import *
import os
from pathlib import Path 
import shutil

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
def upload(mapUserDesc: str = Form(...), mapTags: str = Form(...), files: List[UploadFile] = File(...), db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    valid_variants = ['variant.zombiez', 'variant.ctf', 'variant.koth', 'variant.slayer', 'variant.assault', 'variant.vip', 'variant.jugg', 'variant.terries']
    map_images = []

    if not user:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if len(files) > 7:
        raise HTTPException(status_code=400, detail="Too many files! Expected map, variant, and 5 Images.")

    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Missing files.")

    for file in files:
        if file.filename == "sandbox.map":
            mapFile = file
        
        elif file.filename in valid_variants:
            variantFile = file

        elif file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')):
            map_images.append(file)

        elif file.filename not in valid_variants or "sandbox.map":
            raise HTTPException(status_code=400, detail="Invalid file {}".format(file.filename))
    
    if mapUserDesc is None:
        mapUserDesc = " "

    mapContents = mapFile.file.read()
    variantContents = variantFile.file.read()

    #Cleanup
    mapFile.file.close()
    variantFile.file.close()

    #Extract map and variant file meta data
    mapData = mapReader(mapFile.filename, mapContents)
    variantData = variantReader(variantFile.filename, variantContents)

    if mapData == 1:
        raise HTTPException(status_code=400, detail="Unexpected map file size")
    
    if mapData == 2:
        raise HTTPException(status_code=400, detail="Map file empty")

    if variantData == 1:
        raise HTTPException(status_code=400, detail="Unexpected variant file size")

    if variantData == 2:
        raise HTTPException(status_code=400, detail="Variant file empty")

    variant_id = controller.create_user_variant(db, variant=variantData,  user_id=user.id)
    map_create = controller.create_user_map(db, map=mapData, mapTags=mapTags, user_id=user.id, variant_id=variant_id, mapUserDesc=mapUserDesc)

    if len(map_images) > 0:
        for idx, image in enumerate(map_images):
            Path("/app/static/maps/" + str(map_create.id) + "/").mkdir(parents=True, exist_ok=True)
            with open("/app/static/maps/" + str(map_create.id) + "/" + str(idx), "wb") as f:
                f.write(image.file.read())
                f.close()
                image.file.close()    

    return HTTPException(status_code=200, detail="Success!")
