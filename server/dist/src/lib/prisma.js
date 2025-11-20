
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b186901d-8d75-5466-8c14-db707c44d9b2")}catch(e){}}();
import { PrismaClient } from "../../generated/prisma/client.js";
const prismaClientSingleton = () => {
    return new PrismaClient();
};
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export default prisma;
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma;
//# sourceMappingURL=prisma.js.map
//# debugId=b186901d-8d75-5466-8c14-db707c44d9b2
