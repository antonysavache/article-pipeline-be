# Article Pipeline Backend API

Backend для автоматизированной генерации статей с использованием AI.

## Основной workflow

1. **Установить гео** → `GET /country/:countryKey`
2. **Выбрать скелетон** → `POST /skeleton/:key/set`  
3. **Обогатить скелетон** → `POST /pipeline/enrich`
4. **Сгенерировать статью** → `POST /pipeline/generate`
5. **Внести правки** → `POST /pipeline/revise`

## API Endpoints

### 1. Country Management

#### GET /country/:countryKey
Устанавливает информацию о стране для pipeline.

**Parameters:**
- `countryKey` (path) - код страны (например: "uk", "us")

**Response:**
```json
{
  "success": true,
  "message": "Country info for \"uk\" has been set successfully"
}
```

### 2. Skeleton Management

#### GET /skeleton/available
Получает список доступных скелетонов для выбора.

**Response:**
```json
[
  {
    "key": "blog",
    "title": "Blog Article", 
    "description": "Standard blog post structure"
  },
  {
    "key": "news",
    "title": "News Article",
    "description": "News article format"
  }
]
```

#### POST /skeleton/:key/set
Устанавливает скелетон для pipeline.

**Parameters:**
- `key` (path) - ключ скелетона

**Response:**
```json
{
  "message": "Skeleton \"blog\" set successfully"
}
```

### 3. Pipeline Management

#### GET /pipeline/status
Получает текущий статус pipeline.

**Response:**
```json
{
  "country": "uk",
  "skeletonKey": "blog",
  "hasEnrichedSkeleton": true,
  "hasOriginalArticle": false,
  "hasTranslatedArticle": false
}
```

#### POST /pipeline/enrich
Обогащает скелетон ключевыми словами.

**Body:**
```json
{
  "topic": "best banks in UK",
  "language": "en",
  "geo": "uk"
}
```

**Response:**
```json
{
  "enrichedSkeleton": "{ enriched structure with keywords... }",
  "success": true
}
```

#### POST /pipeline/generate
Генерирует статью на основе обогащенного скелетона.

**Body:**
```json
{
  "topic": "best banks in UK",
  "originalLanguage": "en",
  "needTranslation": true,
  "translationLanguage": "ru"
}
```

**Response:**
```json
{
  "originalArticle": "Article content in English...",
  "translatedArticle": "Статья на русском...",
  "success": true
}
```

#### POST /pipeline/revise
Вносит правки в сгенерированную статью.

**Body:**
```json
{
  "revisionsRequest": "Make the introduction shorter and add more details about fees",
  "targetLanguage": "original"
}
```

**Response:**
```json
{
  "revisedArticle": "Revised article content...",
  "success": true
}
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=article_pipeline

# AI Services
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Server
PORT=4000
```

## Error Handling

Все endpoints возвращают стандартные HTTP статус коды:

- **200** - Успешный запрос
- **400** - Некорректные данные запроса
- **404** - Ресурс не найден  
- **500** - Внутренняя ошибка сервера

**Пример ошибки:**
```json
{
  "statusCode": 400,
  "message": "Country and skeleton must be set before enriching",
  "error": "Bad Request"
}
```

## Quick Start

1. **Установить зависимости:**
```bash
npm install
```

2. **Настроить environment variables**

3. **Запустить базу данных и создать таблицы**

4. **Запустить сервер:**
```bash
npm run start:dev
```

5. **API будет доступно на:** `http://localhost:4000`

## Frontend Integration Example

```javascript
// Пример использования API на фронтенде

// 1. Установить гео
await fetch('/country/uk');

// 2. Получить доступные скелетоны
const skeletons = await fetch('/skeleton/available').then(r => r.json());

// 3. Установить скелетон
await fetch('/skeleton/blog/set', { method: 'POST' });

// 4. Обогатить скелетон
const enrichResult = await fetch('/pipeline/enrich', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'best banks in UK',
    language: 'en'
  })
}).then(r => r.json());

// 5. Сгенерировать статью
const article = await fetch('/pipeline/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'best banks in UK',
    originalLanguage: 'en',
    needTranslation: true,
    translationLanguage: 'ru'
  })
}).then(r => r.json());

// 6. Внести правки
const revised = await fetch('/pipeline/revise', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    revisionsRequest: 'Make it shorter',
    targetLanguage: 'original'
  })
}).then(r => r.json());
```
