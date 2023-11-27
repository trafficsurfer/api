"""Database schema for suggestor app."""

from pydantic import BaseModel


class DetectionBox(BaseModel):
    """Detection box."""

    cls: str
    confidence: float
    coords: list[float]


class Frame(BaseModel):
    """Detected object in a frame."""

    objects: list[DetectionBox]
    num_frame: int


class VideoDetection(BaseModel):
    """Detected video."""

    frames: list[Frame] = []
    total_frames: int
