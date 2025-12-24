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
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
