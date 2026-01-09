# Template Server

Separate microservice for managing petition templates.

## Setup

```bash
npm install
```

## Start Server

```bash
npm start
```

Or with auto-reload:
```bash
npm run dev
```

## API Endpoints

### GET /api/templates
Get all active templates

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 2
}
```

### GET /api/templates/:id
Get template by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "PetTemMasId": 1,
    "PetitionName": "...",
    "TemplateContent": "..."
  }
}
```

### GET /health
Health check endpoint

## Default Port

6000 (configurable via PORT environment variable)

## Deployment

Deploy this server separately. The main backend will fetch templates from this server.

