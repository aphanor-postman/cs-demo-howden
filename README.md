# Howden API - Products API

TypeScript Express server implementing the **Products & Orders API** (`products-api.yaml`).

## Overview

In-memory CRUD API for products and orders, matching the OpenAPI 3.0 specification. Data resets on server restart.

## Endpoints

### Products

| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/api/products` | List all products |
| `POST` | `/api/products` | Create a product |
| `GET` | `/api/products/{productId}` | Get a product |
| `PUT` | `/api/products/{productId}` | Update a product |
| `DELETE` | `/api/products/{productId}` | Delete a product |

### Orders

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/orders` | List all orders |
| `POST` | `/api/orders` | Create an order |
| `GET` | `/api/orders/{orderId}` | Get an order |
| `PUT` | `/api/orders/{orderId}` | Update an order |
| `DELETE` | `/api/orders/{orderId}` | Delete an order |

## Authentication

All requests require an API key in the `apikey` header:

```
apikey: dev-key-123
```

## Schemas

### Product

| Field | Type | Required |
|-------|------|----------|
| `id` | string (guid) | response only |
| `name` | string | yes |
| `description` | string | yes |
| `model` | string | yes |
| `sku` | string | yes |
| `cost` | number | yes |
| `imageUrl` | string | yes |

### Order

| Field | Type | Required |
|-------|------|----------|
| `id` | string (guid) | response only |
| `status` | `OPEN` \| `PAID` \| `SHIPPED` \| `RECEIVED` | yes |
| `date` | string (date-time) | yes |
| `productIds` | string[] | yes |
| `cost` | number | yes |
| `tax` | number | yes |
| `taxRate` | number | yes |
| `total` | number | yes |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run (development)

```bash
npm run dev
```

### Build & run (production)

```bash
npm run build
npm start
```

Runs on port `3000` by default.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `API_KEYS` | `dev-key-123` | Comma-separated list of valid API keys |

## Project Structure

```
src/
├── server.ts              # Express app entry point
├── data/
│   └── store.ts           # In-memory Maps for products and orders
├── middleware/
│   └── auth.ts            # apikey header validation
├── routes/
│   ├── products.ts        # /api/products handlers
│   └── orders.ts          # /api/orders handlers
└── types/
    └── index.ts           # TypeScript interfaces
```

## Example Requests

**Create a product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "apikey: dev-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bose Headphones 700",
    "description": "Noise cancelling headphones",
    "model": "794297-0100",
    "sku": "394807",
    "cost": 445,
    "imageUrl": "https://example.com/image.jpg"
  }'
```

**Create an order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "apikey: dev-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "OPEN",
    "date": "2022-03-12T23:20:50.52Z",
    "productIds": ["<productId>"],
    "cost": 445,
    "tax": 44.5,
    "taxRate": 10,
    "total": 489.5
  }'
```

## API Specification

See [`products-api.yaml`](./products-api.yaml) for the full OpenAPI 3.0 definition.
