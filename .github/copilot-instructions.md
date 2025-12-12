# Shift Scan Server - Backend API

## Project Overview

Express + Prisma REST API with MVC architecture. Provides backend services for shift-scan-dashboard (mobile/admin app).

## Architecture

**Tech Stack**: Node.js · Express 5 · Prisma 7 · PostgreSQL · TypeScript · Firebase Admin · Sentry

**MVC Pattern**:

```
Request → Route → Controller → Service → Prisma → Database
Response ← Controller ← Service ← Prisma ← Database
```

## Development Workflow

```bash
# Development
npm run dev                     # tsx watch with hot reload

# Database (Prisma)
npm run prisma:generate         # Generate Prisma Client
npm run prisma:push             # Push schema to dev DB
npm run prisma:migrate          # Create migration
npm run prisma:studio           # Open Prisma Studio GUI

# Production
npm run build                   # Compile TypeScript
npm start                       # Run compiled JS
npm run db:deploy               # Run migrations + generate client

# Docker
npm run docker:deploy           # Deploy to Google Cloud Run
```

## Project Structure

```
server/src/
  ├── index.ts               # Express server entry point
  ├── instrument.mjs         # Sentry instrumentation
  ├── routes/                # API route definitions
  │   └── index.ts           # Main router (aggregates all routes)
  ├── controllers/           # HTTP request/response handlers
  ├── services/              # Business logic + Prisma queries
  ├── models/                # Data models (if any)
  ├── middleware/            # Auth, error handling, validation
  │   └── errorMiddleware.ts # Global error handler
  ├── lib/
  │   ├── prisma.ts          # Prisma Client singleton
  │   ├── config.ts          # Environment config
  │   └── swagger.ts         # Swagger/OpenAPI spec
  └── types/                 # TypeScript types

prisma/
  ├── schema.prisma          # Database schema (source of truth)
  └── migrations/            # Migration history

generated/prisma/            # Generated Prisma Client (DO NOT EDIT)
```

## Code Standards

Follow patterns defined in `instructions/` folder (parent directory):

-   **Prisma**: See `best-prisma-practices.instructions.md` for ORM patterns
-   **TypeScript**: Strict mode, explicit types, async/await patterns
-   **MVC**: Controllers handle HTTP, services contain business logic
-   **Error handling**: Use `errorMiddleware.ts`, never expose raw errors to client

## Key Patterns

### 1. MVC Architecture

**Routes** (`routes/*.ts`):

```typescript
router.get("/endpoint", controllerFunction);
router.post("/endpoint", anotherController);
```

**Controllers** (`controllers/*.ts`):

```typescript
export const getResource = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await resourceService.findAll();
        res.json(data);
    } catch (error) {
        next(error); // Pass to error middleware
    }
};
```

**Services** (`services/*.ts`):

```typescript
export const resourceService = {
    async findAll() {
        return prisma.resource.findMany();
    },
    async create(data: CreateResourceDTO) {
        return prisma.resource.create({ data });
    },
};
```

### 2. Prisma Usage

**Client singleton** (`lib/prisma.ts`):

```typescript
import prisma from "./lib/prisma.js";

// In services:
const users = await prisma.user.findMany({
    select: { id: true, name: true }, // Only fetch needed fields
    where: { isActive: true },
});
```

**Key Prisma patterns**:

-   Use `select`/`include` to avoid overfetching
-   Use transactions for multi-step operations: `prisma.$transaction()`
-   Never trust user input - validate before Prisma queries
-   Use `prisma.$connect()` on startup (see `index.ts`)

### 3. Error Handling

**Global middleware** (`middleware/errorMiddleware.ts`):

```typescript
// Controllers should catch and pass to next()
try {
    // logic
} catch (error) {
    next(error);
}

// Middleware formats errors as JSON
// 404 handler for unknown routes
// Validation errors caught early
```

### 4. Authentication & Security

-   **Cookies**: `cookie-parser` middleware for httpOnly cookies
-   **CORS**: Configured for dashboard origin (localhost:3000 or production URL)
-   **Helmet**: Security headers
-   **Firebase Admin**: Token verification (if using Firebase auth)
-   **JWT**: `jsonwebtoken` for auth tokens

### 5. API Documentation

**Swagger/OpenAPI** at `/api-docs`:

```typescript
// Use JSDoc comments in routes/controllers
/**
 * @swagger
 * /api/resource:
 *   get:
 *     summary: Get all resources
 */
```

Access: `http://localhost:8080/api-docs`

### 6. Environment Configuration

**`.env` file** (never commit):

```
DATABASE_URL="postgresql://..."
CORS_ORIGIN="http://localhost:3000"
NODE_ENV="development"
```

**Access via** `lib/config.ts`:

```typescript
import config from "./lib/config.js";
const dbUrl = config.databaseUrl;
```

## Database Schema

**Source of truth**: `prisma/schema.prisma`

**Workflow**:

1. Edit `schema.prisma`
2. Run `npm run prisma:migrate` to create migration
3. Run `npm run prisma:generate` to update Prisma Client types

**Never**:

-   Edit database schema directly
-   Modify `generated/` folder
-   Skip migrations in production

## Deployment

**Docker + Google Cloud Run**:

```bash
npm run docker:deploy       # Builds image, pushes to GCR, deploys
```

See `GOOGLE_CLOUD_RUN.md` and `DOCKER_TROUBLESHOOTING.md` for details.

**Production checklist**:

-   Environment variables set (DATABASE_URL, etc.)
-   Run `npm run db:deploy` (migrations + generate)
-   Sentry configured for error tracking

## API Routes Structure

All routes under `/api/*`:

```
/api/users          # User management
/api/jobsites       # Jobsite CRUD
/api/equipment      # Equipment tracking
/api/forms          # Form submissions
/api/timesheets     # Time tracking
/auth/*             # Authentication endpoints
```

Prefix `/api` is convention for client `apiRequest()` calls.

## Critical Rules

1. **MVC separation** - Controllers handle HTTP, services contain logic
2. **Prisma is the ORM** - Never write raw SQL unless absolutely necessary
3. **Error handling** - Always use try/catch and pass errors to `next()`
4. **Validation** - Validate request data before passing to services
5. **Select fields** - Use `select`/`include` to avoid overfetching
6. **Migrations** - Always create migrations for schema changes
7. **TypeScript strict mode** - Enforce type safety
8. **No secrets in code** - Use environment variables
9. **CORS configured** - Only allow dashboard origin
10. **Sentry instrumentation** - Import `instrument.mjs` first in `index.ts`

## Important Files

-   `src/index.ts` - Server entry point, middleware setup
-   `src/lib/prisma.ts` - Prisma Client singleton
-   `src/middleware/errorMiddleware.ts` - Global error handler
-   `prisma/schema.prisma` - Database schema
-   `src/lib/swagger.ts` - API documentation config
-   `.env` - Environment variables (local only, gitignored)

## Sister Projects

-   `shift-scan-dashboard` - Mobile/admin client (Next.js + Capacitor)
-   `shift-scan` - Marketing site (Next.js static)

## Reference Docs

-   `MVC_ARCHITECTURE_EXPLAINED.md` - Detailed MVC guide
-   `PRISMA_7_UPGRADE_GUIDE.md` - Prisma 7 migration
-   `SWAGGER_GUIDE.md` - API documentation patterns
-   `TASCO_API_DOCUMENTATION.md` - API endpoint reference
