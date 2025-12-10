// prisma.config.ts
import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma",
  datasource: {
    url: process.env.POSTGRES_PRISMA_URL!,
    ...(process.env.POSTGRES_URL_NON_POOLING && {
      shadowDatabaseUrl: process.env.POSTGRES_URL_NON_POOLING,
    }),
  },
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: 'ts-node -r tsconfig-paths/register --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
});
