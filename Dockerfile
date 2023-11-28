FROM python:3.10

WORKDIR /app

# install dependencies
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

COPY ./yolov8s_traffic.pt /app
COPY ./src/trafficsurfer_api /app/app
COPY ./front/dist /app/front/dist

EXPOSE 80
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
