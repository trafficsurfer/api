"""FastAPI router module."""
from fastapi import FastAPI, UploadFile

app = FastAPI()


@app.post("/video/")
async def upload_video(file: UploadFile):
    """Run CV on video."""
    return {}


@app.get("/video/{id}")
async def get_video(id: int):
    """Get video status by id."""
    return {}
