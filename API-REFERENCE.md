# TaskFlow Pro API Reference

Base URL: `http://localhost:5000/api`

## Authentication
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/forgot-password`
- PUT `/auth/reset-password/:token`
- GET `/auth/profile`
- PUT `/auth/profile`
- PUT `/auth/change-password`

## Tasks
- GET `/tasks`
- GET `/tasks/:id`
- POST `/tasks`
- PUT `/tasks/:id`
- DELETE `/tasks/:id`
- PUT `/tasks/:id/status`

## Categories
- GET `/categories`
- POST `/categories`
- PUT `/categories/:id`
- DELETE `/categories/:id`

## Dashboard
- GET `/dashboard/stats`
- GET `/dashboard/chart`
- GET `/dashboard/upcoming`

Protected endpoints require:
`Authorization: Bearer <JWT>`
