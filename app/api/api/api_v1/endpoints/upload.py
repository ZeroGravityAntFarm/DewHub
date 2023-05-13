from fastapi import APIRouter, Form, HTTPException, File, UploadFile, Depends
from PIL import Image
import io
from db import controller
from db.session import SessionLocal
from sqlalchemy.orm import Session
from typing import List
from internal.auth import get_current_user
from internal.dewreader import *
import re
from pathlib import Path 

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def removeHtml(text):
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

@router.post("/upload/map")
def upload(mapUserDesc: str = Form(" "), mapTags: str = Form(...), files: List[UploadFile] = File(...), db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    valid_variants = ['variant.oddball', 'variant.zombiez', 'variant.ctf', 'variant.koth', 'variant.slayer', 'variant.assault', 'variant.vip', 'variant.jugg', 'variant.terries']
    map_images = []

    if len(mapUserDesc) > 1200:
        raise HTTPException(status_code=400, detail="Description too long.")

    if not user:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if len(files) > 7:
        raise HTTPException(status_code=400, detail="Too many files! Expected map, variant, and up to 5 Images.")

    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Missing files.")

    for file in files:
        if file.filename == "sandbox.map":
            mapFile = file
        
        elif file.filename in valid_variants:
            variantFile = file

        elif file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif', '.webp')):
            map_images.append(file)

        elif file.filename not in valid_variants or "sandbox.map":
            raise HTTPException(status_code=400, detail="Invalid file {}".format(file.filename))

    mapContents = mapFile.file.read()
    variantContents = variantFile.file.read()

    #Cleanup
    mapFile.file.close()
    variantFile.file.close()

    #Scrub user input of dirty strings
    mapUserDesc = removeHtml(mapUserDesc)

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

            #Create thumbnail for each image using PIL
            image = Image.open(image)
            image.thumbnail((450, 300))
            image.save("/app/static/maps/thumbnails/" + str(idx))
             

    return HTTPException(status_code=200, detail="Success!")


@router.post("/upload/prefab")
def upload(prefabDesc: str = Form(" "), prefabTags: str = Form(...), files: List[UploadFile] = File(...), db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    prefab_extension = ".prefab"
    zip_extension = ".zip"
    prefab_images = []
    prefabFile = None
    zipFile = None

    #Remove dirty strings from user input
    prefabDesc = removeHtml(prefabDesc)

    if not user:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if len(files) > 6:
        raise HTTPException(status_code=400, detail="Too many files! Expected prefab and up to 5 Images.")

    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Missing files.")

    for file in files:
        if file.filename.endswith(prefab_extension):
            prefabFile = file
        
        elif file.filename.endswith(zip_extension):
            zipFile = file

        elif file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')):
            prefab_images.append(file)

        else:
            raise HTTPException(status_code=400, detail="Invalid file {}".format(file.filename))

    #Do if prefab
    if prefabFile:
        prefabContents = prefabFile.file.read()

        #Cleanup
        prefabFile.file.close()

        #All your bytes are belong to me
        prefabData = prefabReader(prefabFile.filename, prefabContents)

        #Check for baddies
        if prefabData == 1:
            raise HTTPException(status_code=400, detail="Unexpected file size")

        #Yeet prefab to database
        prefab_create = controller.create_prefab(db, prefab=prefabData, prefabTags=prefabTags, user_id=user.id, prefabDesc=prefabDesc)

        #Yeet images to file system
        if len(prefab_images) > 0:
            for idx, image in enumerate(prefab_images):
                Path("/app/static/prefabs/" + str(prefab_create.id) + "/").mkdir(parents=True, exist_ok=True)
                with open("/app/static/prefabs/" + str(prefab_create.id) + "/" + str(idx), "wb") as f:
                    f.write(image.file.read())
                    f.close()
                    image.file.close()
                
                #Create thumbnail for each image using PIL
                image = Image.open(image)
                image.thumbnail((450, 300))
                image.save("/app/static/maps/thumbnails/" + str(idx))

        return HTTPException(status_code=200, detail="Success!")
    
    #Do if zip
    elif zipFile:

        #Lets us create an object like one we would have got from our dewrito file parser
        class prefabData:
            pass

        #Object instantiation
        prefabData = prefabData()

        #Build out our prefab object
        prefabData.prefabName = zipFile.filename.strip(".zip")
        prefabData.prefabDescription = ""
        prefabData.prefabAuthor = user.name
        prefabData.prefabFile = zipFile.filename
        prefabData.contents = zipFile.file.read()

        #Yeet prefab zip to database
        prefab_create = controller.create_prefab(db, prefab=prefabData, prefabTags=prefabTags, user_id=user.id, prefabDesc=prefabDesc)

        #Yeet images to file system
        if len(prefab_images) > 0:
            for idx, image in enumerate(prefab_images):
                Path("/app/static/prefabs/" + str(prefab_create.id) + "/").mkdir(parents=True, exist_ok=True)
                with open("/app/static/prefabs/" + str(prefab_create.id) + "/" + str(idx), "wb") as f:
                    f.write(image.file.read())
                    f.close()
                    image.file.close()
                
                #Create thumbnail for each image using PIL
                image = Image.open(image)
                image.thumbnail((450, 300))
                image.save("/app/static/maps/thumbnails/" + str(idx))

        return HTTPException(status_code=200, detail="Success!")


@router.post("/upload/mod")
def upload(modDescription: str = Form(" "), modTags: str = Form(...), files: List[UploadFile] = File(...), db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    mod_images = []
    valid_files = [".pak"]

    if len(modDescription) > 1200:
        raise HTTPException(status_code=400, detail="Description too long.")

    if not user:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if len(files) > 7:
        raise HTTPException(status_code=400, detail="Too many files! Expected mod, and up to 5 Images.")

    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Missing files.")

    for file in files:
        if file.filename.lower().endswith(('.pak')):
            modFile = file

        elif file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif', '.webp')):
            mod_images.append(file)

        elif file.filename not in valid_files:
            raise HTTPException(status_code=400, detail="Invalid file {}".format(file.filename))

    modContents = modFile.file.read()

    #Cleanup
    modFile.file.close()

    #Scrub user input of dirty strings
    modDescription = removeHtml(modDescription)

    #Extract mod file data
    modData = modReader(modFile.filename, modContents)

    if modData == 2:
        raise HTTPException(status_code=400, detail="Mod file too big.")
    
    if modData == 1:
        raise HTTPException(status_code=400, detail="Mod file empty")

    mod_create = controller.create_user_mod(db, mod=modData, modTags=modTags, user_id=user.id, modDescription=modDescription)

    if len(mod_images) > 0:
        for idx, image in enumerate(mod_images):
            Path("/app/static/mods/" + str(mod_create.id) + "/").mkdir(parents=True, exist_ok=True)
            with open("/app/static/mods/" + str(mod_create.id) + "/" + str(idx), "wb") as f:
                f.write(image.file.read())
                f.close()
                image.file.close()

            #Create thumbnail for each image using PIL
            image = Image.open(image)
            image.thumbnail((450, 300))
            image.save("/app/static/maps/thumbnails/" + str(idx))    

    return HTTPException(status_code=200, detail="Success!")