# MERN Expense Tracker (Backend + Frontend + Admin Panel)

This project contains three separate applications:

- `backend`: Node.js + Express + MongoDB API with JWT auth and expense management.
- `frontend`: React app for end users to manage personal expenses.
- `admin-panel`: React app for admin users to view platform-level data.

## Folder Structure

```
expense-tracker/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
  frontend/
    src/
      api/
      components/
      context/
      pages/
      styles/
  admin-panel/
    src/
      api/
      components/
      context/
      pages/
      styles/
```

## 1) Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Important environment variables (`backend/.env`):

- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker`
- `JWT_SECRET=replace_with_a_strong_secret`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=http://localhost:5173`
- `ADMIN_URL=http://localhost:5174`
- `CORS_ORIGINS=http://localhost:5173,http://localhost:5174`
- `ADMIN_EMAIL=admin@example.com`
- `ADMIN_PASSWORD=Admin@123`

Create/update admin account:

```bash
npm run seed:admin
```

## 2) Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

`frontend/.env`:

- `VITE_API_BASE_URL=http://localhost:5000/api`

## 3) Admin Panel Setup

```bash
cd admin-panel
cp .env.example .env
npm install
npm run dev
```

`admin-panel/.env`:

- `VITE_API_BASE_URL=http://localhost:5000/api`

## API Summary

### Auth Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### User Expense Routes (protected)

- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `GET /api/expenses/summary`

### Admin Routes (protected + admin)

- `GET /api/admin/users`
- `GET /api/admin/expenses`
- `GET /api/admin/summary`

## Features Implemented

- JWT authentication and protected routes
- Password hashing with bcrypt (`bcryptjs`)
- Expense CRUD with title, amount, category, date
- Dashboard with:
  - total expenses
  - category-wise summaries
  - monthly expense chart
- Separate admin panel with user and expense oversight
- Error-handling middleware and input validation
- MongoDB + Mongoose models and RESTful routes
- Axios-based API communication and responsive UI

## Vercel Deployment (3 Separate Projects)

Deploy each folder as a separate Vercel project:

1. Backend project root: `backend`
2. Frontend project root: `frontend`
3. Admin project root: `admin-panel`

### Backend (Vercel)

Backend is configured as a serverless function:

- [vercel.json](/home/max-cleetus/Videos/expense tracker/backend/vercel.json)
- [api/index.js](/home/max-cleetus/Videos/expense tracker/backend/api/index.js)

Set these environment variables in Vercel (Backend project):

- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL` (your frontend Vercel URL)
- `ADMIN_URL` (your admin-panel Vercel URL)
- `CORS_ORIGINS` (comma-separated, e.g. `https://frontend.vercel.app,https://admin.vercel.app`)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

After deploy, backend base URL is:

- `https://<your-backend-project>.vercel.app`

API URL used by frontends:

- `https://<your-backend-project>.vercel.app/api`

### Frontend (Vercel)

Frontend SPA rewrite config:

- [vercel.json](/home/max-cleetus/Videos/expense tracker/frontend/vercel.json)

Set environment variable in Vercel (Frontend project):

- `VITE_API_BASE_URL=https://<your-backend-project>.vercel.app/api`

### Admin Panel (Vercel)

Admin SPA rewrite config:

- [vercel.json](/home/max-cleetus/Videos/expense tracker/admin-panel/vercel.json)

Set environment variable in Vercel (Admin project):

- `VITE_API_BASE_URL=https://<your-backend-project>.vercel.app/api`
