# Installation Guide

This guide provides step-by-step instructions for setting up the Ticket Management System on your local development environment.

## 📋 Prerequisites

### System Requirements

- **Operating System**: macOS, Linux, or Windows (WSL2 recommended for Windows)
- **Go Version**: 1.21 or higher
- **Docker**: 20.10 or higher
- **Docker Compose**: 2.0 or higher
- **Git**: Latest version
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: At least 2GB free disk space

### Required Software

```bash
# Check Go version
go version

# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Check Git version
git --version
```

## 🚀 Quick Start (Docker)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ticket-management/api_simple
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ticket_management

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRY=24h

# Server Configuration
SERVER_PORT=8080
GIN_MODE=debug
```

### 3. Start Services with Docker

```bash
# Start all services (PostgreSQL, Redis, API)
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f api
```

### 4. Verify Installation

```bash
# Check API health
curl http://localhost:8080/health

# Check database connection
docker-compose exec api go run main.go --check-db
```

## 🔧 Manual Installation

### 1. Database Setup (PostgreSQL)

#### Option A: Local PostgreSQL Installation

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### Option B: Docker PostgreSQL

```bash
docker run --name postgres-ticket \
  -e POSTGRES_DB=ticket_management \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:13
```

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres -h localhost

# Create database
CREATE DATABASE ticket_management;
CREATE DATABASE ticket_management_test;

# Exit
\q
```

### 2. Redis Setup

#### Option A: Local Redis Installation

```bash
# Ubuntu/Debian
sudo apt install redis-server

# macOS
brew install redis
brew services start redis

# Windows
# Download from https://redis.io/download
```

#### Option B: Docker Redis

```bash
docker run --name redis-ticket \
  -p 6379:6379 \
  -d redis:6-alpine
```

### 3. Go Application Setup

#### Install Dependencies

```bash
# Navigate to project directory
cd ticket-management/api_simple

# Download dependencies
go mod download

# Verify dependencies
go mod verify
```

#### Database Migration

```bash
# Run migrations
go run main.go --migrate

# Seed initial data
go run seeders/main.go
```

#### Start Application

```bash
# Development mode
go run main.go

# Production mode
go build -o ticket-api
./ticket-api
```

## 🧪 Testing Environment

### 1. Test Database Setup

```bash
# Create test database
createdb ticket_management_test

# Set test environment
export DB_NAME=ticket_management_test
export GIN_MODE=test
```

### 2. Run Tests

```bash
# Run all tests
go test ./...

# Run specific test suite
go test ./tests -v

# Run with coverage
go test ./... -cover

# Run tests with race detection
go test ./... -race
```

### 3. Test Data Seeding

```bash
# Seed test data
go run seeders/test_seeders.go

# Verify test data
psql -U postgres -d ticket_management_test -c "SELECT COUNT(*) FROM users;"
```

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Errors

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U postgres -h localhost -d ticket_management

# Verify environment variables
echo $DB_HOST $DB_PORT $DB_USER $DB_NAME
```

#### Redis Connection Issues

```bash
# Check Redis status
redis-cli ping

# Test connection
redis-cli -h localhost -p 6379 ping
```

#### Port Conflicts

```bash
# Check port usage
lsof -i :8080
lsof -i :5432
lsof -i :6379

# Kill process using port
kill -9 <PID>
```

#### Permission Issues

```bash
# Fix PostgreSQL permissions
sudo -u postgres psql
ALTER USER postgres PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE ticket_management TO postgres;
\q
```

### Performance Issues

#### Database Performance

```bash
# Check database connections
psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Check slow queries
psql -U postgres -c "SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

#### Memory Usage

```bash
# Check Go application memory
ps aux | grep ticket-api

# Check Docker resource usage
docker stats
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints

```bash
# Application health
curl http://localhost:8080/health

# Database health
curl http://localhost:8080/health/db

# Redis health
curl http://localhost:8080/health/redis
```

### Log Monitoring

```bash
# View application logs
docker-compose logs -f api

# View database logs
docker-compose logs -f postgres

# View Redis logs
docker-compose logs -f redis
```

## 🚀 Production Deployment

### Environment Variables

```env
# Production settings
GIN_MODE=release
SERVER_PORT=8080
DB_HOST=production-db-host
DB_PASSWORD=strong-production-password
JWT_SECRET=very-long-random-production-secret
```

### Security Considerations

- Use strong, unique passwords
- Enable SSL/TLS for database connections
- Implement rate limiting
- Set up proper firewall rules
- Regular security updates

### Performance Optimization

- Enable database connection pooling
- Implement Redis caching strategies
- Use CDN for static assets
- Monitor and optimize database queries

## 📚 Next Steps

After successful installation:

1. **Read the [API Documentation](./api-reference.md)** to understand available endpoints
2. **Explore the [Testing Guide](./testing-guide.md)** for development workflow
3. **Check the [Development Guide](./development-guide.md)** for contribution guidelines
4. **Review the [Architecture Documentation](./architecture.md)** for system design

## 🆘 Getting Help

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting) above
2. Review the application logs for error messages
3. Verify all prerequisites are met
4. Check the [GitHub Issues](https://github.com/your-repo/issues) page
5. Create a new issue with detailed error information

---

_This installation guide covers the basic setup. For advanced configuration and production deployment, refer to the specific documentation sections._
