
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ad0ae31c-6019-521a-a206-b97d1ca91e5d")}catch(e){}}();
import prisma from "../lib/prisma.js";
export async function getAllTags(search, page, pageSize, skip) {
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
        }
        else {
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
    }
    catch (error) {
        console.error("Error in getAllTags service:", error);
        throw error;
    }
}
export async function getTagById(id) {
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
export async function createTag(payload) {
    const existingTag = await prisma.cCTag.findUnique({
        where: {
            name: payload.name.trim(),
        },
    });
    if (existingTag) {
        throw new Error("Tag with this name already exists");
    }
    const data = {
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
export async function updateTag(id, payload) {
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
    const updateData = {};
    if (payload.name !== undefined) {
        updateData.name = payload.name.trim();
    }
    if (payload.description !== undefined) {
        updateData.description = payload.description.trim();
    }
    if (payload.Jobsites) {
        // Normalize: convert string[] to {id: string}[] if needed
        const jobsitesArray = payload.Jobsites.map((js) => typeof js === "string" ? { id: js } : js);
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
export async function deleteTag(id) {
    return await prisma.cCTag.delete({
        where: { id },
    });
}
//# sourceMappingURL=adminTagService.js.map
//# debugId=ad0ae31c-6019-521a-a206-b97d1ca91e5d
