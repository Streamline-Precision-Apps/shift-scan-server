
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="29d9de3c-538f-5d59-9958-080d49e42d09")}catch(e){}}();
import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const prismaClientSingleton = () => {
    const pool = new pg.Pool({
        connectionString: process.env.POSTGRES_PRISMA_URL,
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export default prisma;
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma;
//# sourceMappingURL=prisma.js.map
//# debugId=29d9de3c-538f-5d59-9958-080d49e42d09
