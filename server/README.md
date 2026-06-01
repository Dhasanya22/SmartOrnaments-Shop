# SmartOrnaments Backend

Express + MongoDB Atlas + JWT backend for Step 2.

## Setup

1. Copy `server/.env.example` values into `server/.env`.
2. Replace `MONGO_URI` with your MongoDB Atlas connection string.
3. Install packages:

```bash
npm install
```

4. Run the API:

```bash
npm run dev
```

## Main Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/cart`
- `PUT /api/cart`
- `POST /api/orders`
- `GET /api/orders`

Send protected requests with:

```http
Authorization: Bearer <token>
```
