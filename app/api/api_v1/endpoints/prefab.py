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

#Returns dynamically built view for prefabs. Only way to get meta tags working (that I know of).
@router.get("/prefabview", response_class=HTMLResponse)
async def return_prefabview(request: Request, prefabId: int, db: Session = Depends(get_db)):
    prefab = controller.get_prefab(db, prefab_id=prefabId)

    return templates.TemplateResponse("prefab/index.html", {"request": request, "prefabName": prefab.prefabName, "id": prefab.id, "prefabDescription": prefab.prefabDescription})


#Get all Prefabs
@router.get("/prefabs")
@limiter.limit("60/minute")
def read_prefabs(request: Request,  params: Params = Depends(), db: Session = Depends(get_db)):
    prefabs = controller.get_prefabs(db)

    if prefabs:
        return paginate(prefabs, params)

    else:
        raise HTTPException(status_code=400, detail="Prefabs not found")


#Get prefab by id
@router.get("/prefabs/{prefab_id}")
def read_prefab(prefab_id: int, db: Session = Depends(get_db)):
    prefab = controller.get_prefab(db, prefab_id=prefab_id)

    if prefab:
        return prefab

    else:
        raise HTTPException(status_code=400, detail="Prefab not found")


#Delete prefab entry 
@router.delete("/prefabs/{prefab_id}")
def delete_prefab(prefab_id: int = 0, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    status, msg = controller.delete_prefab(db, prefab_id=prefab_id, user=user)

    if status:
        return HTTPException(status_code=200, detail="Prefab deleted successfully")

    else:
        raise HTTPException(status_code=400, detail=msg)


#Get single prefab file
@router.get("/prefabs/{prefab_id}/file")
@limiter.limit("60/minute")
def prefab_file(request: Request, prefab_id: int, db: Session = Depends(get_db)):
    prefab_file = controller.get_prefab_file(db, prefab_id=prefab_id)

    if prefab_file:
        headers = {'Content-Disposition': 'attachment; filename="{}"'.format(prefab_file.prefabFileName)}
        return Response(prefab_file.prefabFile, headers=headers, media_type='application/octet-stream')

    else:
        raise HTTPException(status_code=400, detail="Prefab file not found")