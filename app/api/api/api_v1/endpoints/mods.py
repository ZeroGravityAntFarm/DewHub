from fastapi import APIRouter, Depends, HTTPException, Response, Request
from fastapi_pagination import paginate, Params
from db.schemas import schemas
from db import controller
from db.session import SessionLocal
from internal.auth import get_current_user
from sqlalchemy.orm import Session
from internal.limiter import limiter 
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db

    finally:
        db.close()

#Set our Jinja template dir
templates = Jinja2Templates(directory="templates")

#Returns dynamically built view for mods. Only way to get meta tags working (that I know of).
@router.get("/modview", response_class=HTMLResponse)
async def return_modview(request: Request, modId: int, db: Session = Depends(get_db)):
    mod = controller.get_mods(db, mod_id=modId)

    return templates.TemplateResponse("mod/index.html", {"request": request, "modName": mod.modName, "id": mod.id, "modDescription": mod.modDescription})


#Get all Mods
@router.get("/mods")
@limiter.limit("60/minute")
def read_mods(request: Request,  params: Params = Depends(), db: Session = Depends(get_db)):
    mods = controller.get_mods(db)

    if mods:
        return paginate(mods, params)

    else:
        raise HTTPException(status_code=400, detail="Mods not found")


#Get mod by id
@router.get("/mods/{mod_id}")
def read_mod(mod_id: int, db: Session = Depends(get_db)):
    mod = controller.get_mod(db, mod_id=mod_id)

    if mod:
        return mod

    else:
        raise HTTPException(status_code=400, detail="mod not found")


#Delete mod entry 
@router.delete("/mods/{mod_id}")
def delete_mod(mod_id: int = 0, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    status, msg = controller.delete_mod(db, mod_id=mod_id, user=user)

    if status:
        return HTTPException(status_code=200, detail="Mod deleted successfully")

    else:
        raise HTTPException(status_code=400, detail=msg)


#Get single mod file
@router.get("/mods/{mod_id}/file")
@limiter.limit("60/minute")
def mod_file(request: Request, mod_id: int, db: Session = Depends(get_db)):
    mod_file = controller.get_mod_file(db, mod_id=mod_id)

    if mod_file:
        headers = {'Content-Disposition': 'attachment; filename="{}"'.format(mod_file.modFileName)}
        return Response(mod_file.modFile, headers=headers, media_type='application/octet-stream')

    else:
        raise HTTPException(status_code=400, detail="Mod file not found")