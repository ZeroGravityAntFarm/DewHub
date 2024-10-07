from fastapi import FastAPI, Request
from starlette.responses import Response
from starlette.types import Scope
from starlette.staticfiles import StaticFiles
from api.api_v1.api import api_router
from db.models import models
from db.session import engine
from fastapi.middleware.cors import CORSMiddleware
from internal.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from fastapi_pagination import add_pagination
from db.session import SessionLocal
from db.models import models
import tempfile
import hashlib

models.Base.metadata.create_all(bind=engine)

#Set tmp mount to location on a larger disk
tempfile.tempdir = "/tmp"

app = FastAPI()
app.include_router(api_router)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


async def verifyDownload(request: Request):
    m = hashlib.sha256()
    db = SessionLocal()

    split_path = request.url.path.split("/")

    if len(split_path) > 3:
        if split_path[2] == "pak":
            requestString = bytes(split_path[3] + request.client.host, 'utf-8')
            requestHash = hashlib.sha256(requestString).hexdigest()
            requestExists = db.query(models.Tracking).filter(models.Tracking.requestHash == requestHash).first() is not None

            if not requestExists:
                modId = split_path[3]
                mod = db.query(models.Mod).filter(models.Mod.id == modId).first()
                mod.mod_downloads += 1
                
                newRequest = models.Tracking(requestHash=requestHash)

                db.add(newRequest)
                db.commit()


############### Static Files Custom Response Hack ##################
class CustomStaticFiles(StaticFiles):
    def __init__(self, *args, **kwargs) -> None:

        super().__init__(*args, **kwargs)

    async def get_response(self, path: str, scope: Scope) -> Response:
        response = await super().get_response(path, scope)

        if path.endswith('.pak') or path.endswith('.map'):
            response.headers["Content-Type"] = "application/octet-stream"

        return response       

    async def __call__(self, scope, receive, send) -> None:

        assert scope["type"] == "http"

        request = Request(scope, receive)
        await verifyDownload(request)
        await super().__call__(scope, receive, send)


app.mount("/", CustomStaticFiles(directory="static", html = True), name="static")
add_pagination(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)