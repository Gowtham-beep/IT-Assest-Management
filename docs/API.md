# API Summary

Base path: `/api`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`

## Assets
- `GET /assets`
- `GET /assets/:id`
- `POST /assets`
- `PUT /assets/:id`
- `DELETE /assets/:id` (retire)
- `GET /assets/search?q=`
- `POST /assets/:id/assign`
- `POST /assets/:id/return`

## Assignments
- `GET /assignments`

## Requests
- `GET /requests`
- `POST /requests`
- `PUT /requests/:id/approve`
- `PUT /requests/:id/reject`
- `PUT /requests/:id/fulfill`

## Users
- `GET /users`
- `POST /users`
- `GET /users/:id`
- `PUT /users/:id`
- `GET /users/:id/assets`

## Reports
- `GET /reports/inventory`
- `GET /reports/assignments`
- `GET /reports/audit`

## Dashboard
- `GET /dashboard/stats`
