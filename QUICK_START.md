# Quick Start Guide

## 🚀 Запуск Article Pipeline Backend

### 1. Environment Setup

Создайте `.env` файл с настройками:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/article_pipeline
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=article_pipeline

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Server
PORT=4000
```

### 2. Database Setup

```bash
# 1. Создать базу данных PostgreSQL
createdb article_pipeline

# 2. Применить миграции
psql -d article_pipeline -f database/migrations/add_title_description_to_skeletons.sql

# 3. Загрузить тестовые данные
psql -d article_pipeline -f database/sample-data.sql
```

### 3. Install & Run

```bash
# Установить зависимости
npm install

# Запуск в development режиме
npm run start:dev

# Проверка работы
curl http://localhost:4000/skeleton/available
```

## 🧪 Testing API

Используйте файл `test-api.http` для тестирования endpoints.

### Базовый workflow:

1. **Установить гео:** `GET /country/uk`
2. **Выбрать скелетон:** `POST /skeleton/blog/set`
3. **Обогатить:** `POST /pipeline/enrich`
4. **Генерировать:** `POST /pipeline/generate`
5. **Править:** `POST /pipeline/revise`

### Быстрый тест через curl:

```bash
# 1. Установить UK
curl http://localhost:4000/country/uk

# 2. Установить blog скелетон
curl -X POST http://localhost:4000/skeleton/blog/set

# 3. Проверить статус
curl http://localhost:4000/pipeline/status

# 4. Обогатить скелетон
curl -X POST http://localhost:4000/pipeline/enrich \
  -H "Content-Type: application/json" \
  -d '{"topic": "best banks in UK", "language": "en"}'

# 5. Сгенерировать статью
curl -X POST http://localhost:4000/pipeline/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "best banks in UK", "originalLanguage": "en", "needTranslation": true, "translationLanguage": "ru"}'
```

## 📊 Мониторинг

- **Логи:** Смотрите в консоль - все операции логируются
- **Статус:** `GET /pipeline/status` показывает текущее состояние
- **Ошибки:** Все ошибки возвращают JSON с описанием

## 🎯 Готово!

Backend готов к работе с фронтендом. API доступно на `http://localhost:4000`
