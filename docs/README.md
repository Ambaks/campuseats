# CampusEats Documentation

Welcome to the CampusEats documentation! This directory contains comprehensive guides and references for the CampusEats platform.

## Documentation Files

- **[API.md](API.md)** - Complete API reference with all endpoints, request/response formats, and examples
- **[SETUP.md](SETUP.md)** - Detailed setup instructions for local development
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide (coming soon)
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guidelines for contributing to the project (coming soon)

## Quick Links

### For Developers
- [API Documentation](API.md) - REST API reference
- [Database Schema](../backend/app/models.py) - SQLAlchemy models
- [Frontend Components](../frontend/src/app/components/) - React components

### For DevOps
- [Docker Setup](../docker-compose.yml) - Container orchestration
- [Environment Configuration](../.env.example) - Required environment variables
- [Database Migrations](../backend/alembic/) - Alembic migration files

### Interactive API Docs
When running the backend server locally, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Architecture Overview

CampusEats is built with:
- **Frontend**: Next.js 15 + React 19 + Material-UI
- **Backend**: FastAPI (Python) + PostgreSQL
- **Auth**: Firebase Authentication
- **Payments**: Stripe
- **Maps**: Mapbox GL
- **Storage**: Firebase Storage

## Getting Help

- Check the [main README](../README.md) for project overview
- Review the [API documentation](API.md) for endpoint details
- Check [GitHub Issues](https://github.com/yourusername/campuseats/issues) for known issues
- Contact the development team

## Contributing

We welcome contributions! Please see CONTRIBUTING.md (coming soon) for guidelines.

## License

See the main [LICENSE](../LICENSE) file for details.
