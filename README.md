# TaskFlow Pro

A complete full-stack task management application built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB and JWT authentication.

## Features
- Register / Login / Logout
- JWT protected authentication
- Forgot/reset password flow
- Profile update and password change
- Create, read, update, delete tasks
- Task categories, priorities and statuses
- Search and filtering
- Dashboard statistics
- Charts with Recharts
- Upcoming and overdue tasks
- Dark mode
- Toast notifications
- Loading states
- Responsive desktop/tablet/mobile layout
- MongoDB with Mongoose
- Password hashing with bcryptjs
- Helmet, CORS and Express Validator
- Vercel/Render deployment-ready structure

## Requirements
- Node.js 18+
- MongoDB local installation or MongoDB Atlas

## Run backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

## Run frontend
Open another terminal:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Environment variables

Backend:
- PORT=5000
- MONGO_URI=mongodb://127.0.0.1:27017/taskflow
- JWT_SECRET=change_this_to_a_long_random_secret
- CLIENT_URL=http://localhost:5173
- EMAIL_USER=
- EMAIL_PASS=

Frontend:
- VITE_API_URL=http://localhost:5000/api

If EMAIL_USER/EMAIL_PASS are empty, password reset still works in development by returning the reset link in the API response. For production, configure a real SMTP account and do not expose reset links in responses.

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

See `backend/.env.example` and `frontend/.env.example`.
