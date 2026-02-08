# IT-Assest-Management

Multi-tenant IT Asset Management SaaS scaffold for SMB teams (50-500 employees), focused on fast "who has what" lookup, lifecycle workflows, and auditability.

## Tech Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Zustand
- Backend: Node.js, Express, TypeScript, Zod, JWT auth
- Database: PostgreSQL (shared database + `tenant_id` isolation)
- Cache/Queue: Redis
- Infra: Docker Compose local environment

## Project Structure
```
SmartInventoryManagement/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── types/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   ├── migrations/
│   └── package.json
├── shared/
├── docs/
├── docker-compose.yml
└── README.md
```

## Local Development
1. Copy environment file:
```bash
cp .env.example .env
```
2. Run all services:
```bash
docker compose up --build
```
3. Frontend: `http://localhost:3000`
4. Backend: `http://localhost:4000`

## Demo Credentials
- Email: `admin@demo.com`
- Password: `password123`

## Implemented API Endpoints
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`
- Assets: `/api/assets`, `/api/assets/:id`, `/api/assets/search`, `/api/assets/:id/assign`, `/api/assets/:id/return`
- Assignments: `/api/assignments`
- Requests: `/api/requests`, `/api/requests/:id/approve`, `/api/requests/:id/reject`, `/api/requests/:id/fulfill`
- Users: `/api/users`, `/api/users/:id`, `/api/users/:id/assets`
- Reports: `/api/reports/inventory`, `/api/reports/assignments`, `/api/reports/audit`
- Dashboard: `/api/dashboard/stats`

## Database Highlights
- Multi-tenant tables: `tenants`, `users`, `assets`, `asset_assignments`, `asset_requests`, `audit_logs`
- `tenant_id` indexed across business tables
- Composite index on `assets(tenant_id, status)`
- Full-text GIN index via `assets.search_vector`

## Lifecycle and Workflow
- Asset states: `available`, `assigned`, `in_repair`, `retired`
- Request states: `pending`, `approved`, `rejected`, `fulfilled`
- Audit logging on asset, request, and user mutations

## Documentation
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/TESTING.md`
- `docs/DEPLOYMENT.md`
