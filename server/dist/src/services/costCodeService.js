// server/src/services/initService.ts

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="89885af1-8dce-55c4-bf4a-92fefaf3a33c")}catch(e){}}();
import prisma from "../lib/prisma.js";
export async function getCostCodes() {
    return await prisma.costCode.findMany({
        select: {
            id: true,
            name: true,
            isActive: true,
            code: true,
            CCTags: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    Jobsites: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
}
//# sourceMappingURL=costCodeService.js.map
//# debugId=89885af1-8dce-55c4-bf4a-92fefaf3a33c
