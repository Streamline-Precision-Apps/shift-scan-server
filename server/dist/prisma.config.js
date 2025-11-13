// prisma.config.ts

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a31e8f2c-8f62-5cad-8c90-d7bdad75fabc")}catch(e){}}();
import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";
export default defineConfig({
    schema: "prisma",
    migrations: {
        path: path.join("prisma", "migrations"),
        seed: 'ts-node -r tsconfig-paths/register --compiler-options {"module":"CommonJS"} prisma/seed.ts',
    },
});
//# sourceMappingURL=prisma.config.js.map
//# debugId=a31e8f2c-8f62-5cad-8c90-d7bdad75fabc
