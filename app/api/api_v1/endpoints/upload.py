from fastapi import APIRouter, Form, HTTPException, File, UploadFile, Depends
from db import controller
from db.session import SessionLocal
from sqlalchemy.orm import Session
from typing import List
from internal.auth import get_current_user
from internal.dewreader import *

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
def upload(user_id: int = Form(...), files: List[UploadFile] = File(...), db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    valid_variants = ['variant.zombiez', 'variant.ctf', 'variant.koth', 'variant.slayer', 'variant.assault', 'variant.vip', 'variant.jugg', 'variant.terries']

    if not user:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if len(files) < 2:
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

    variant_id = controller.create_user_variant(db, variant=variantData,  user_id=user_id)
    map_create = controller.create_user_map(db, map=mapData, user_id=user_id, variant_id=variant_id)

    return HTTPException(status_code=200, detail="Success!")
