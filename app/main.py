from fastapi import FastAPI
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
import tempfile

models.Base.metadata.create_all(bind=engine)

#Set tmp mount to location on a larger disk
tempfile.tempdir = "/tmp"

app = FastAPI()
app.include_router(api_router)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


############### Static Files Custom Response Hack ##################

class CustomStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope: Scope) -> Response:
        response = await super().get_response(path, scope)

        if path.endswith('.pak') or path.endswith('.map'):
            response.headers["Content-Type"] = "application/octet-stream"

        return response

app.mount("/", CustomStaticFiles(directory="static", html = True), name="static")
add_pagination(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

'''
if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001, proxy_headers=True, forwarded_allow_ips='*', log_level="debug")
'''
