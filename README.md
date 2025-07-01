# 🌤️ Weather API

This project is a backend service built with **Node.js + TypeScript + Express**, using **Prisma ORM**, **PostgreSQL**, and **Redis**. It fetches weather data from the **OpenWeather API**, caches results, and provides **role-based access control** for users and admins.

## ✨ Features

* 🔐 JWT-based Authentication (Register/Login)
* 🧑‍⚖️ Role-based access: Admin & User
* 🌦️ Integration with OpenWeather API
* ⚡ Redis caching for faster weather lookups
* 🧠 PostgreSQL database managed via Prisma
* 🧪 Jest-based test structure
* 🐳 Docker & Docker Compose ready

---

## 📦 Tech Stack

* **Node.js + Express**
* **TypeScript**
* **Prisma + PostgreSQL**
* **Redis**
* **OpenWeather API**
* **Docker Compose**
* **Jest (Testing)**

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/weather-api.git
cd weather-api
```

### 2. Install dependencies

```bash
pnpm install
```

> If you don't have `pnpm`:

```bash
npm install -g pnpm
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5300/weather"
OPENWEATHER_API_KEY=your_openweather_api_key_here
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

---

## 🐳 Docker Setup (PostgreSQL + Redis)

### Start the containers:

```bash
pnpm db:up
```

> This uses `docker-compose.yml` to launch PostgreSQL (port 5300) and Redis.

To shut down:

```bash
pnpm db:down
```

---

## 🔄 Prisma Setup

After setting up your `.env`, run the following:

```bash
pnpm db:generate       # Generate Prisma Client
pnpm db:push           # Push schema to DB
pnpm db:studio         # Optional: open Prisma Studio
```

---

## ▶️ Development

Start development server with hot-reload:

```bash
pnpm dev
```

Build project:

```bash
pnpm build
```

Start production server:

```bash
pnpm start
```

---

## 🧪 Run Tests

```bash
pnpm test
```
with coverage
```bash
pnpm test:coverage
```
---

## 🔐 Auth Endpoints

### Register

`POST /api/auth/register`

```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Returns:

```json
{ "token": "..." }
```

---

## 🌦️ Weather Endpoints

> **Auth Required (Bearer token)**

### Get weather data:

`POST /api/weather`

```json
{
  "city": "Istanbul",
  "country": "TR"
}
```

### Get previous queries:

`GET /api/weather`

---

## 🧑‍⚖️ Admin Endpoints

> Only accessible by `role: ADMIN`

### List all users:

`GET /api/admin/users`

### Create new user:

`POST /api/admin/users`

```json
{
  "email": "newuser@example.com",
  "password": "123456",
  "role": "USER"
}
```

---

## 📌 Folder Structure

```
src/
├── config/        → Redis config
├── controllers/   → Route logic
├── middlewares/   → Auth & role check
├── routes/        → Express routes
├── services/      → Weather service (API + Cache)
├── types/         → Type declarations
├── prisma/        → Prisma schema
├── index.ts       → Entry point
```

---

## 🧠 Notes

* All weather data is cached in Redis for **1 hour**.
* Prisma manages the schema and DB migrations.
* OpenWeather API key is required for the app to work.
