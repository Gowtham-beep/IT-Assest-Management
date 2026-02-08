# Deployment Notes

## Local Development
- `cp .env.example .env`
- `docker compose up --build`

## CI/CD Baseline
- Lint and test on pull request
- Build backend/frontend container images
- Deploy to staging on merge to `main`
- Manual gate for production deployment

## Production Checklist
- TLS + HTTPS only
- Daily DB backups retained for 30 days
- Rate limiting and CORS restrictions
- Centralized logs + error tracking
- Secret management through environment variables
