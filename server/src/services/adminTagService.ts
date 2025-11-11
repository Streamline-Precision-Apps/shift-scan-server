import prisma from "../lib/prisma.js";

export async function getAllTags(
  total: number,
  page: number | undefined,
  pageSize: number | undefined,
  skip: number | undefined,
  totalPages: number | undefined,
  search: string
) {
  try {
    if (search !== "") {
      page = 1;
      pageSize = undefined;
      skip = undefined;
      totalPages = 1;
      const tagSummary = await prisma.cCTag.findMany({
        include: {
          CostCodes: {
            select: {
              id: true,
              name: true,
              isActive: true,
            },
          },
          Jobsites: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
      total = tagSummary.length;
      return {
        tagSummary,
        total,
        page,
        pageSize,
        totalPages,
      };
    } else {
      // Use the provided page and pageSize directly
      page = page || 1;
      pageSize = pageSize || 10;
      skip = (page - 1) * pageSize;
      const take = pageSize;
      // Fetch total count for pagination
      total = await prisma.cCTag.count();
      totalPages = Math.ceil(total / pageSize);
      // Fetch only essential fields from tags
      const tagSummary = await prisma.cCTag.findMany({
        skip,
        take,
        include: {
          CostCodes: {
            select: {
              id: true,
              name: true,
              isActive: true,
            },
          },
          Jobsites: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
      return {
        tagSummary,
        total,
        page,
        pageSize,
        totalPages,
      };
    }
  } catch (error) {
    console.error("Error in getAllTags service:", error);
    throw error;
  }
}
