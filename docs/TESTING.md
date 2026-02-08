# Testing Strategy

## Backend
- Unit tests: controller/services validation and transition rules
- Integration tests: auth, assets CRUD, assignment workflow, request workflow
- Isolation tests: cross-tenant access prevention on all endpoints

## Frontend
- Component tests for key widgets
- Integration tests for login, search, assign flow
- E2E tests for MVP paths using Playwright

## Coverage Targets
- Backend >80%
- Frontend >70%
- Multi-tenant enforcement: 100% of guarded endpoints
