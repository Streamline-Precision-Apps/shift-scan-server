import type { Prisma } from "../../generated/prisma/index.js";
import prisma from "../lib/prisma.js";

export async function getAllTags(
  search: string,
  page: number | undefined,
  pageSize: number | undefined,
  skip: number | undefined
) {
  try {
    if (search !== "") {
      page = 1;
      pageSize = undefined;
      skip = undefined;
      const totalPages = 1;
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
      const total = tagSummary.length;
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
      const total = await prisma.cCTag.count();
      const totalPages = Math.ceil(total / pageSize);
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

export async function getTagById(id: string) {
  return await prisma.cCTag.findUnique({
    where: {
      id,
    },
    include: {
      Jobsites: {
        select: {
          id: true,
          name: true,
        },
      },
      CostCodes: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function createTag(payload: {
  name: string;
  description: string;
  CostCodes: {
    id: string;
    name: string;
  }[];
  Jobsites: {
    id: string;
    name: string;
  }[];
}) {
  const existingTag = await prisma.cCTag.findUnique({
    where: {
      name: payload.name.trim(),
    },
  });
  if (existingTag) {
    throw new Error("Tag with this name already exists");
  }

  const data: any = {
    name: payload.name.trim(),
    description: payload.description.trim(),
  };
  if (payload.CostCodes && payload.CostCodes.length > 0) {
    data.CostCodes = {
      connect: payload.CostCodes.map((cc) => ({ id: cc.id })),
    };
  }
  if (payload.Jobsites && payload.Jobsites.length > 0) {
    data.Jobsites = { connect: payload.Jobsites.map((js) => ({ id: js.id })) };
  }
  return await prisma.cCTag.create({
    data,
    include: {
      CostCodes: {
        select: {
          id: true,
          name: true,
        },
      },
      Jobsites: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export type UpdateTagPayload = {
  name?: string;
  description?: string;
  Jobsites?: { id: string; name?: string }[];
  CostCodes?: { id: string; name?: string }[];
};

export async function updateTag(id: string, payload: UpdateTagPayload) {
  const existingTag = await prisma.cCTag.findUnique({
    where: { id },
    include: {
      Jobsites: { select: { id: true, name: true } },
      CostCodes: { select: { id: true, name: true } },
    },
  });
  if (!existingTag) {
    throw new Error("Tag not found");
  }

  const updateData: Prisma.CCTagUpdateInput = {};
  if (payload.name !== undefined) {
    updateData.name = payload.name.trim();
  }
  if (payload.description !== undefined) {
    updateData.description = payload.description.trim();
  }
  if (payload.Jobsites) {
    // Normalize: convert string[] to {id: string}[] if needed
    const jobsitesArray = payload.Jobsites.map((js) =>
      typeof js === "string" ? { id: js } : js
    );
    const filteredJobsites = jobsitesArray.filter((js) => js && js.id);
    if (filteredJobsites.length > 0) {
      updateData.Jobsites = {
        set: filteredJobsites.map((js) => ({ id: js.id })),
      };
    }
  }
  if (payload.CostCodes) {
    const filteredCostCodes = payload.CostCodes.filter((cc) => cc && cc.id);
    if (filteredCostCodes.length > 0) {
      updateData.CostCodes = {
        set: filteredCostCodes.map((cc) => ({ id: cc.id })),
      };
    }
  }

  return await prisma.cCTag.update({
    where: { id },
    data: updateData,
    include: {
      Jobsites: { select: { id: true, name: true } },
      CostCodes: { select: { id: true, name: true } },
    },
  });
}

export async function deleteTag(id: string) {
  return await prisma.cCTag.delete({
    where: { id },
  });
}
