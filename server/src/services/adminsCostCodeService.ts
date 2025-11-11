import type { Prisma } from "../../generated/prisma/index.js";
import prisma from "../lib/prisma.js";

export async function getCostCodes({
  search,
  page,
  pageSize,
  skip,
}: {
  search: string;
  page: number | undefined;
  pageSize: number | undefined;
  skip: number | undefined;
}) {
  if (search !== "") {
    page = undefined;
    pageSize = undefined;
    skip = undefined;
    const totalPages = 1;
    const costCodeSummary = await prisma.costCode.findMany({
      include: {
        CCTags: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            Timesheets: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    const total = costCodeSummary.length;
    return {
      costCodes: costCodeSummary,
      total,
      page,
      pageSize,
      totalPages,
    };
  } else {
    page = page || 1;
    pageSize = pageSize || 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    // Fetch total count for pagination
    const total = await prisma.costCode.count();
    const totalPages = Math.ceil(total / pageSize);
    // Fetch only essential fields from cost codes
    const costCodeSummary = await prisma.costCode.findMany({
      skip,
      take,
      include: {
        CCTags: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            Timesheets: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return {
      costCodes: costCodeSummary,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}

export async function getCostCodesById(id: string) {
  return await prisma.costCode.findUnique({
    where: { id },
    include: {
      CCTags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getCostCodeSummary() {
  return await prisma.costCode.findMany({
    select: {
      id: true,
      code: true,
      name: true,
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function createCostCodes(payload: {
  code: string;
  name: string;
  isActive: boolean;
  CCTags: {
    id: string;
    name: string;
  }[];
}) {
  // Validate required fields
  if (!payload.name?.trim()) {
    throw new Error("Cost code name is required");
  }

  // Check if cost code with the same name already exists
  const existingCostCode = await prisma.costCode.findFirst({
    where: {
      OR: [{ code: payload.code.trim() }, { name: payload.name.trim() }],
    },
  });

  if (existingCostCode) {
    throw new Error("A cost code with this name already exists");
  }

  // Create the new cost code
  return await prisma.costCode.create({
    data: {
      code: payload.code.trim(), // Use the code as-is (without #)
      name: payload.name.trim(), // Use the name as-is (already formatted as "#code name")
      isActive: payload.isActive,
      CCTags: {
        connect: payload.CCTags?.map((tag) => ({ id: tag.id })) || [],
      },
    },
  });
}

export type UpdateCostCodePayload = {
  code?: string;
  name?: string;
  isActive?: boolean;
  CCTags?: { id: string; name?: string }[];
};

export async function updateCostCodes(
  id: string,
  payload: UpdateCostCodePayload
) {
  const existingCostCode = await prisma.costCode.findUnique({
    where: { id },
    include: {
      CCTags: {
        select: { id: true, name: true },
      },
    },
  });

  if (!existingCostCode) {
    throw new Error("Cost code not found");
  }

  const updateData: Prisma.CostCodeUpdateInput = {};
  if (payload.code !== undefined) {
    updateData.code = payload.code.trim();
  }
  if (payload.name !== undefined) {
    updateData.name = payload.name.trim();
  }
  if (payload.isActive !== undefined) {
    updateData.isActive = payload.isActive;
  }

  if (payload.CCTags) {
    let cCTagsArray = payload.CCTags;
    // If no tags provided, add the 'All' tag automatically
    if (!Array.isArray(cCTagsArray) || cCTagsArray.length === 0) {
      // Find the 'All' tag in the database
      const allTag = await prisma.cCTag.findFirst({
        where: { name: { equals: "All", mode: "insensitive" } },
        select: { id: true },
      });
      if (allTag) {
        cCTagsArray = [{ id: allTag.id }];
      }
    }
    updateData.CCTags = {
      set: cCTagsArray.map((tag: { id: string }) => ({ id: tag.id })),
    };
  }

  return await prisma.costCode.update({
    where: { id },
    data: updateData,
    include: { CCTags: true },
  });
}

export async function deleteCostCodes(id: string) {
  const costCodeWithRelations = await prisma.costCode.findUnique({
    where: { id },
    include: {
      Timesheets: true,
      CCTags: true,
    },
  });

  if (!costCodeWithRelations) {
    throw new Error("Cost code not found");
  }

  // Check if cost code is in use
  if (costCodeWithRelations.Timesheets.length > 0) {
    throw new Error("Cannot delete cost code that is used in timesheets");
  }

  // Disconnect any related CCTags before deletion
  if (costCodeWithRelations.CCTags.length > 0) {
    await prisma.costCode.update({
      where: { id },
      data: {
        CCTags: {
          disconnect: costCodeWithRelations.CCTags.map((tag) => ({
            id: tag.id,
          })),
        },
      },
    });
  }

  // Delete the cost code
  await prisma.costCode.delete({
    where: { id },
  });
}

export async function restoreCostCodes(id: string) {
  return await prisma.costCode.update({
    where: { id },
    data: {
      isActive: true,
    },
  });
}

export async function archiveCostCodes(id: string) {
  return await prisma.costCode.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
}
