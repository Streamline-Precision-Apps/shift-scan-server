// prisma.config.ts

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2d2e97c5-9fe6-5d7d-ae64-1d1508117057")}catch(e){}}();
import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";
export default defineConfig({
    schema: "prisma",
    datasource: {
        url: process.env.POSTGRES_PRISMA_URL,
        ...(process.env.POSTGRES_URL_NON_POOLING && {
            shadowDatabaseUrl: process.env.POSTGRES_URL_NON_POOLING,
        }),
    },
    migrations: {
        path: path.join("prisma", "migrations"),
        seed: 'ts-node -r tsconfig-paths/register --compiler-options {"module":"CommonJS"} prisma/seed.ts',
    },
});
//# sourceMappingURL=prisma.config.js.map
//# debugId=2d2e97c5-9fe6-5d7d-ae64-1d1508117057
