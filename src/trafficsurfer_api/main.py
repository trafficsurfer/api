"""FastAPI router module."""
from fastapi import FastAPI, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.gzip import GZipMiddleware
from pathlib import Path
from ultralytics import YOLO
from tempfile import NamedTemporaryFile
from . import schemas

app = FastAPI()
app.add_middleware(GZipMiddleware)

model = YOLO("yolov8n.pt")

storage: dict[schemas.VideoDetection] = {}


def process_video(filename: str, id: str):
    try:
        storage[id] = schemas.VideoDetection()
        results = model(filename, stream=True)

        for num_frame, result in enumerate(results):
            objects = []
            for i, cls in enumerate(result.boxes.cls.tolist()):
                objects.append(
                    schemas.DetectionBox(
                        cls=result.names[cls],
                        confidence=result.boxes.conf[i].item(),
                        coords=result.boxes.xyxy[i].tolist(),
                    )
                )
            if len(objects):
                storage[id].frames.append(
                    schemas.Frame(objects=objects, num_frame=num_frame)
                )
    finally:
        Path(filename).unlink()


@app.post("/detection/{id}")
async def upload_video(file: UploadFile, id: str, bg: BackgroundTasks):
    """Run CV on video."""
    try:
        suffix = Path(file.filename).suffix
        with NamedTemporaryFile("wb", delete=False, suffix=suffix) as temp:
            contents = await file.read()
            temp.write(contents)
            bg.add_task(process_video, temp.name, id)
    except Exception:
        raise HTTPException(500)
    finally:
        await file.close()

    return {}


@app.get("/detection/{id}")
async def get_video(id: str, skip: int = 0) -> schemas.VideoDetection:
    """Get video status by id."""
    if id not in storage:
        raise HTTPException(404)
    detection = storage.get(id)
    frames_page = [f for f in detection.frames if f.num_frame > skip]
    return schemas.VideoDetection(frames=frames_page)
