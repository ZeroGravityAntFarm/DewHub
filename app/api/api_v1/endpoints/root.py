from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi_pagination import paginate, Page, Params
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from db.session import SessionLocal
from db.schemas import schemas
from db import controller

router = APIRouter()

templates = Jinja2Templates(directory="static")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db

    finally:
        db.close()

@router.get("/", response_class=HTMLResponse)
def root(request: Request, db: Session = Depends(get_db)):

    return templates.TemplateResponse("index.html", {"request": request} )


@router.get("/maps/newest", response_class=HTMLResponse)
def root(request: Request, db: Session = Depends(get_db)):

    return templates.TemplateResponse("/maps/newest/index.html", {"request": request} ) 


@router.get("/maps/downloaded", response_class=HTMLResponse)
def root(request: Request, db: Session = Depends(get_db)):

    return templates.TemplateResponse("/maps/downloaded/index.html", {"request": request} )


@router.get("/maps/oldest", response_class=HTMLResponse)
def root(request: Request, db: Session = Depends(get_db)):

    return templates.TemplateResponse("/maps/oldest/index.html", {"request": request} )


@router.get("/login", response_class=HTMLResponse)
def root(request: Request, db: Session = Depends(get_db)):

    return templates.TemplateResponse("/login/index.html", {"request": request} )


@router.get("/register", response_class=HTMLResponse)
def root(request: Request, db: Session = Depends(get_db)):

    return templates.TemplateResponse("/register/index.html", {"request": request} )
