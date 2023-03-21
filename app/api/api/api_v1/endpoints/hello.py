from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from typing import List
from internal.dewreader import *

router = APIRouter()

@router.get("/")
def upload():

    return "DewShare v0.2"