// server/src/services/initService.ts
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
