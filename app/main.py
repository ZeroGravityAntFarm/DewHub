from fastapi import FastAPI
from api.api_v1.api import api_router
from db.models import models
from db.session import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(api_router)

if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="debug")