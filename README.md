# Trafficsurfer app

Веб-приложение для распознования дорожных знаков на видео.

Быстрый запуск предсобранного докера:

1. Устанавливаем [докер](https://docs.docker.com/engine/install/)
2. `docker run --pull always -p 8001:80 ghcr.io/trafficsurfer/api:latest`

Приложение запущено:
- [http://localhost:8001/app](http://localhost:8001/app) (фронт),
- [http://localhost:8001/docs](http://localhost:8001/docs) (Swagger UI).

Технологии:

- CV-модель: Ultralytics YOLOv8
- Бекенд: FastAPI
- Фронтенд: astro + solidjs
- Линтеры: black + ruff + pre-commit

На проекте настрен CI/CD (GitHub Actions) для сборки и публикации сервиса в GitHub container registry.

## Локальный запуск

Клонируем репозиторий:

```sh
git clone https://github.com/trafficsurfer/api.git trafficsurfer
cd trafficsurfer
```

Устанавливаем зависимости:

```sh
poetry install
# Или без poetry:
# pip install --no-cache-dir --upgrade -r /app/requirements.txt
```

Собираем фронт:

```sh
cd front
npm ci
npm run build
```

Запускаем приложение:

```sh
docker-compose up --build
```

## Разработка

Запускаем бек:

```sh
poetry run uvicorn src.trafficsurfer_api.main:app --reload
```

Запускаем фронт с HMR:

```sh
cd front
npm run dev
```
