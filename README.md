<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

---

# Salary Management System — Backend

The REST API backend for the Employee Salary Management System, enabling HR managers to manage compensation data for ~10,000 employees across multiple countries.

Built with **NestJS**, **TypeORM**, and **PostgreSQL**.

### 🌐 Live Demo

| | URL |
|--|-----|
| **Frontend** | https://salary-mgmt-fe.vercel.app/ |
| **Backend API** | https://salary-mgmt-be.onrender.com/api |
| **Swagger Docs** | https://salary-mgmt-be.onrender.com/api/docs |

---

## Table of Contents

- [Features](#features)
- [Features Beyond Requirements](#-features-beyond-requirements)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Scripts Reference](#scripts-reference)

---

## Features

### 1. Employee Management
- Paginated employee listing with configurable page size
- Full-text search across name, employee code, and email
- Filter by country and department
- Sort by any column (name, department, salary, etc.)
- Employee detail view with current salary

### 2. Salary Management
- Update employee base salary and bonus
- Record effective date for every salary change
- Automatic audit trail — every update creates a `SalaryHistory` record
- Full salary change history per employee

### 3. Compensation Analytics Dashboard
- Organisation-wide overview: total employees, average, median, highest, lowest salary
- Salary metrics grouped by country
- Salary metrics grouped by department
- Salary bracket distribution (USD-normalised)

### 4. Salary Insights / Query Interface
- Natural-language question interface mapped to predefined analytics queries
- Supported questions:
  - *"What is the average salary in {country}?"*
  - *"Which department has the highest average salary?"*
  - *"How many employees earn more than {threshold}?"*
  - *"Who are the top 10 highest-paid employees?"*
- Graceful fallback with menu suggestions for unsupported questions

---

## ⭐ Features Beyond Requirements

The following capabilities were **not part of the original requirements** but were added to improve production quality, developer experience, and maintainability:

| Feature | Description |
|---------|-------------|
| **Swagger / OpenAPI Documentation** | Full interactive API documentation at `/api/docs` with decorated controllers, DTOs, and response types |
| **Global Logging Interceptor** | Every HTTP request is logged with method, URL, status code, and response time in milliseconds |
| **Global HTTP Exception Filter** | All errors return a consistent JSON structure with `statusCode`, `message`, `timestamp`, and `path` |
| **Environment Validation** | Startup fails fast with clear errors if required env vars are missing (using `class-validator`) |
| **Salary Distribution Endpoint** | `GET /analytics/distribution` — bins employees into USD-normalised salary brackets with country-aware currency conversion |
| **Docker Compose (Dev & Test)** | Separate `docker-compose.yml` for development and `docker-compose.test.yml` for isolated E2E testing |
| **Database Seeder** | Generates 10,000 realistic employee records with salaries, history, departments, and multi-country distribution |
| **TypeORM Migrations** | Version-controlled schema via migration files rather than `synchronize: true` |
| **98%+ Coverage Threshold** | Enforced in `jest.config` — builds fail if coverage drops below 98% on branches, functions, lines, and statements |
| **E2E Test Suite** | Full end-to-end tests against a real PostgreSQL database using Docker |
| **Configurable CORS** | Production mode restricts CORS to the configured frontend URL; development allows all origins |
| **GitHub Actions CI/CD** | Automated pipeline with 5 jobs: install → build → lint + unit tests + E2E tests (with PostgreSQL service container), plus auto-deploy to Render on merge to `main` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 11 |
| Language | TypeScript 5 |
| ORM | TypeORM 1.x |
| Database | PostgreSQL 16 |
| Validation | class-validator + class-transformer |
| API Docs | @nestjs/swagger + swagger-ui-express |
| Testing | Jest 30 + Supertest |
| CI/CD | GitHub Actions |
| Deployment | Render (auto-deploy on merge) |
| Containerisation | Docker Compose |

---

## Architecture

```
Client (React Frontend)
        │
        │  REST API (JSON over HTTP)
        │
┌───────▼──────────────────────────────┐
│           NestJS Application         │
│                                      │
│  ┌────────────┐  ┌───────────────┐   │
│  │ Controllers │──│   Services    │   │
│  └────────────┘  └───────┬───────┘   │
│                          │           │
│               ┌──────────▼────────┐  │
│               │  TypeORM Repos    │  │
│               └──────────┬────────┘  │
└──────────────────────────┼───────────┘
                           │
                  ┌────────▼────────┐
                  │   PostgreSQL    │
                  └─────────────────┘
```

**Modules:**
- `EmployeesModule` — Employee CRUD and listing
- `SalariesModule` — Salary updates and history
- `AnalyticsModule` — Compensation metrics and distribution
- `InsightsModule` — Question-based query engine
- `DatabaseModule` — TypeORM configuration and connection
- `CommonModule` — Shared DTOs, filters, and interceptors

---

## API Endpoints

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees` | Paginated list with search, filter, and sort |
| `GET` | `/api/employees/:id` | Employee details with current salary |

**Query Parameters for `GET /api/employees`:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `pageSize` | number | Items per page (default: 10) |
| `search` | string | Search by name, code, or email |
| `department` | string | Filter by department |
| `country` | string | Filter by country |
| `sortBy` | string | Sort column |
| `sortOrder` | `ASC` / `DESC` | Sort direction |

### Salaries

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/api/employees/:id/salary` | Update salary (creates audit record) |
| `GET` | `/api/employees/:id/salary-history` | Salary change history |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/overview` | Org-wide salary statistics |
| `GET` | `/api/analytics/country` | Salary metrics by country |
| `GET` | `/api/analytics/department` | Salary metrics by department |
| `GET` | `/api/analytics/distribution` | Salary bracket distribution |

### Insights

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/insights/query` | Submit a compensation question |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 22.0.0
- **Docker** and **Docker Compose** (for PostgreSQL)
- **npm**

### 1. Clone and Install

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work with Docker Compose).

### 4. Run Migrations

```bash
npm run migration:run
```

### 5. Seed the Database

```bash
npm run db:seed
```

This generates ~10,000 employees with realistic salary data across 5 countries and 8 departments.

### 6. Start the Server

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_HOST` | ✅ | — | PostgreSQL host |
| `DATABASE_PORT` | ❌ | `5432` | PostgreSQL port |
| `DATABASE_USERNAME` | ✅ | — | Database user |
| `DATABASE_PASSWORD` | ✅ | — | Database password |
| `DATABASE_NAME` | ✅ | — | Database name |
| `PORT` | ❌ | `3000` | Application port |
| `NODE_ENV` | ❌ | `development` | `development`, `production`, or `test` |
| `FRONTEND_URL` | ❌ | — | Frontend origin for production CORS |

See `.env.example` for a working template.

---

## Database

### Entities

| Entity | Purpose |
|--------|---------|
| `Employee` | Employee master data (code, name, email, department, designation, country, currency) |
| `Salary` | Current and historical salary records (base salary, bonus, effective date, `isCurrent` flag) |
| `SalaryHistory` | Audit trail for every salary change (old → new salary, reason, timestamp) |

### Relationships

```
Employee (1) ──── (N) Salary
Employee (1) ──── (N) SalaryHistory
```

### Indexes

- `employee.employeeCode` (unique)
- `employee.email` (unique)
- `employee.department`
- `employee.country`
- `salary.isCurrent`

### Migrations

```bash
# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate a new migration from entity changes
npm run migration:generate -- src/database/migrations/MigrationName
```

---

## Testing

### Unit Tests

14 test suites covering controllers, services, DTOs, interceptors, filters, and validators.

```bash
npm run test          # Run all unit tests
npm run test:cov      # Run with coverage report
npm run test:watch    # Watch mode
```

**Coverage thresholds (enforced in CI):**
- Statements: 98%
- Branches: 98%
- Functions: 98%
- Lines: 98%

### E2E Tests

3 end-to-end test suites testing full API flows against a real PostgreSQL database.

```bash
# One-command E2E (spins up Docker, runs migrations, seeds, tests, tears down)
npm run test:e2e:docker
```

Or manually:

```bash
docker compose -f docker-compose.test.yml up -d --wait
NODE_ENV=test npm run migration:run
NODE_ENV=test npm run db:seed
npm run test:e2e
docker compose -f docker-compose.test.yml down
```

---

## CI/CD Pipeline

GitHub Actions automates quality checks on every push and pull request to `main`.

**Workflow:** `.github/workflows/ci.yml`

```
install ──► build ──┬──► lint
                    ├──► test (unit + coverage)
                    └──► test-e2e (PostgreSQL service container)
                              │
                    ┌─────────┘
                    ▼
                  deploy (Render — main branch only)
```

| Job | What it does |
|-----|-------------|
| **install** | `npm ci` with node_modules caching |
| **build** | Verifies `npm run build` compiles successfully |
| **lint** | Runs ESLint on all source and test files |
| **test** | Runs unit tests with coverage enforcement (98%+ threshold) |
| **test-e2e** | Spins up a PostgreSQL service container, runs migrations, seeds data, and executes E2E tests |
| **deploy** | Triggers Render deploy hook (only on push to `main` after all checks pass) |

---

## API Documentation

Interactive Swagger UI is available at:

```
http://localhost:3000/api/docs
```

All controllers and DTOs are decorated with `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiProperty` for complete auto-generated documentation.

---

## Project Structure

```
be/
├── src/
│   ├── analytics/              # Compensation analytics module
│   │   ├── analytics.controller.ts
│   │   ├── analytics.service.ts
│   │   └── dto/
│   ├── common/                 # Shared utilities
│   │   ├── dto/                # Pagination DTOs
│   │   ├── filters/            # HttpExceptionFilter
│   │   ├── interceptors/       # LoggingInterceptor
│   │   └── interfaces/
│   ├── config/                 # App & DB configuration
│   │   └── env.validation.ts   # Startup env validation
│   ├── database/               # TypeORM setup
│   │   ├── data-source.ts      # CLI data source
│   │   ├── migrations/         # Version-controlled schema
│   │   └── seeds/              # 10K employee seeder
│   ├── employees/              # Employee management module
│   │   ├── employees.controller.ts
│   │   ├── employees.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── insights/               # Question-based insights module
│   │   ├── insights.controller.ts
│   │   ├── insights.service.ts
│   │   └── dto/
│   ├── salaries/               # Salary management module
│   │   ├── salaries.controller.ts
│   │   ├── salaries.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── app.module.ts           # Root module
│   └── main.ts                 # Bootstrap, Swagger, global pipes
├── test/                       # E2E test suites
├── docker-compose.yml          # Development PostgreSQL
├── docker-compose.test.yml     # Isolated test PostgreSQL
├── .env.example                # Environment template
└── package.json
```

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start in watch mode |
| `npm run start:prod` | Start production build |
| `npm run build` | Compile TypeScript |
| `npm run lint` | Lint and auto-fix |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run unit tests with coverage |
| `npm run test:e2e` | Run E2E tests (requires DB) |
| `npm run test:e2e:docker` | Run E2E with Docker lifecycle |
| `npm run migration:run` | Apply pending migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run db:seed` | Seed 10K employees |

---

## Requirements Checklist

Cross-reference with the [requirement document](../docs/requirement-document.md):

| Requirement | Status |
|-------------|--------|
| Centralise employee salary information | ✅ |
| Paginated employee listing | ✅ |
| Search by name, employee code, email | ✅ |
| Filter by country and department | ✅ |
| View employee profiles | ✅ |
| View current salary | ✅ |
| Update salary with effective date | ✅ |
| Automatic salary change audit trail | ✅ |
| Total employee count | ✅ |
| Average, median, highest, lowest salary | ✅ |
| Salary distribution by country | ✅ |
| Salary distribution by department | ✅ |
| Overall salary range distribution | ✅ |
| Question-based insights interface | ✅ |
| Support 10,000 employee records | ✅ |
| Server-side pagination | ✅ |
| Auditability of salary changes | ✅ |
| Fast search and analytics queries | ✅ |
| Clean, maintainable, testable codebase | ✅ |

---

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
