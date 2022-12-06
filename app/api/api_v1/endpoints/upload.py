from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from typing import List
from internal.dewreader import *
import json 

router = APIRouter()

@router.post("/upload")
def upload(files: List[UploadFile] = File(...)):

    data = []

    for file in files:
        contents = file.file.read()
        dewmap = mapReader(file.filename, contents)
        mapData = dewmap.read()
        file.file.close()
        data.append(mapData)

    return json.dumps(data)