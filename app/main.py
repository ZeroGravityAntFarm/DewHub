from fastapi import FastAPI
from api.api_v1.api import api_router
from fastapi.staticfiles import StaticFiles
from db.models import models
from db.session import engine
from fastapi.middleware.cors import CORSMiddleware
from internal.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from fastapi_pagination import add_pagination
import tempfile

models.Base.metadata.create_all(bind=engine)

#Set tmp mount to location on a larger disk
tempfile.tempdir = "/tmp"

app = FastAPI()
app.include_router(api_router)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.mount("/", StaticFiles(directory="static", html = True), name="static")
add_pagination(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)