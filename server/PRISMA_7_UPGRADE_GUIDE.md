# Prisma 7 Upgrade Guide for ShiftScan Server

## Prerequisites

-   Complete current Forms.prisma changes and merge
-   Create a new branch: `git checkout -b upgrade/prisma-7`
-   Backup your database
-   Test on development environment first

## Step 1: Update Dependencies

```bash
cd server
npm install prisma@latest @prisma/client@latest
npm install @prisma/adapter-pg  # PostgreSQL adapter required
```

## Step 2: Create Prisma Config File

Create `server/prisma.config.ts`:

```typescript
import "dotenv/config";
import { defineConfig } from "@prisma/client";

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: process.env.POSTGRES_PRISMA_URL!,
        shadowDatabaseUrl: process.env.POSTGRES_URL_NON_POOLING,
    },
    migrations: {
        // If you have a seed script, add:
        // seed: "tsx prisma/seed.ts"
    },
});
```

## Step 3: Update schema.prisma

**File:** `server/prisma/schema.prisma`

Change:

```prisma
generator client {
- provider      = "prisma-client-js"
+ provider      = "prisma-client"
  output        = "../src/generated/prisma"  // Move to src/
  binaryTargets = ["native", "windows", "darwin-arm64"]
}

datasource db {
  provider  = "postgresql"
- url       = env("POSTGRES_PRISMA_URL")
- directUrl = env("POSTGRES_URL_NON_POOLING")
+ // URLs now configured in prisma.config.ts
}
```

## Step 4: Update PrismaClient Instantiation

**File:** `server/src/lib/prisma.ts`

```typescript
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
    const adapter = new PrismaPg({
        connectionString: process.env.POSTGRES_PRISMA_URL!,
    });

    return new PrismaClient({ adapter });
};

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
```

## Step 5: Update All Imports

Update all files that import from Prisma:

**Before:**

```typescript
import { PrismaClient } from "../../generated/prisma/client.js";
import type { User } from "../../generated/prisma/index.js";
```

**After:**

```typescript
import { PrismaClient } from "../generated/prisma/client.js";
import type { User } from "../generated/prisma/index.js";
```

Use find & replace:

-   Find: `"../../generated/prisma/`
-   Replace: `"../generated/prisma/`

And:

-   Find: `"../generated/prisma/` (in files one level deeper)
-   Replace: `"./generated/prisma/`

## Step 6: Update package.json Scripts

Remove `dotenv-cli` wrapping (Prisma 7 doesn't auto-load env):

```json
{
    "scripts": {
        "prisma:generate": "npx prisma generate",
        "prisma:push": "npx prisma db push",
        "prisma:migrate": "npx prisma migrate dev",
        "prisma:migrate:deploy": "npx prisma migrate deploy",
        "prisma:studio": "npx prisma studio"
    }
}
```

## Step 7: Regenerate Prisma Client

```bash
# Delete old generated client
rm -rf generated/prisma
rm -rf src/generated/prisma

# Generate new client
npx prisma generate

# Apply migrations to ensure sync
npx prisma migrate deploy
```

## Step 8: Test Everything

```bash
# Run dev server
npm run dev

# Test all endpoints
# Test database reads/writes
# Test migrations
```

## Step 9: Update TypeScript Paths (if needed)

If you have path aliases in `tsconfig.json`, update them:

```json
{
    "compilerOptions": {
        "paths": {
            "@prisma/*": ["./src/generated/prisma/*"]
        }
    }
}
```

## Common Issues & Solutions

### Issue 1: "Cannot find module '@prisma/client'"

**Solution:** Run `npx prisma generate`

### Issue 2: Import path errors

**Solution:** Update all imports from `generated/prisma` to `src/generated/prisma`

### Issue 3: Connection errors

**Solution:** Verify environment variables are loaded before PrismaClient creation

### Issue 4: TypeScript errors

**Solution:** Delete `node_modules`, run `npm install`, then `npx prisma generate`

## Rollback Plan

If upgrade fails:

```bash
# Revert to Prisma 6
npm install prisma@6.19.0 @prisma/client@6.19.0
npm uninstall @prisma/adapter-pg

# Restore old files
git checkout HEAD -- prisma/schema.prisma
git checkout HEAD -- src/lib/prisma.ts

# Regenerate
npx prisma generate
```

## Migration Checklist

-   [ ] Create backup branch
-   [ ] Update dependencies
-   [ ] Create `prisma.config.ts`
-   [ ] Update `schema.prisma`
-   [ ] Update `src/lib/prisma.ts`
-   [ ] Update all import paths
-   [ ] Update package.json scripts
-   [ ] Delete old generated folder
-   [ ] Run `npx prisma generate`
-   [ ] Test locally
-   [ ] Test all API endpoints
-   [ ] Test migrations
-   [ ] Update documentation
-   [ ] Create PR for team review
-   [ ] Deploy to staging
-   [ ] Deploy to production

## Team Communication

After upgrade, inform team:

```
⚠️ PRISMA 7 UPGRADE ⚠️

After pulling latest changes:

1. cd server
2. npm install
3. npx prisma generate
4. npm run dev

If you encounter errors, delete node_modules and reinstall.

Breaking changes:
- Prisma client now uses adapter pattern
- Generated files moved to src/generated/prisma
- Import paths changed
- Requires Node.js 18.x or higher
```

## Resources

-   [Prisma 7 Release Notes](https://github.com/prisma/prisma/releases/tag/7.0.0)
-   [Prisma 7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-to-prisma-7)
-   [PostgreSQL Adapter Docs](https://www.prisma.io/docs/orm/overview/databases/postgresql#adapter)
