
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f46cf41a-a6d9-5deb-a0aa-dab3a8e91416")}catch(e){}}();
import prisma from "../lib/prisma.js";
export async function getAllJobsites(status, page, pageSize, skip, totalPages, total) {
    try {
        if (status === "pending") {
            page = undefined;
            pageSize = undefined;
            skip = undefined;
            totalPages = 1;
            const jobsiteSummary = await prisma.jobsite.findMany({
                where: {
                    approvalStatus: "PENDING",
                },
                select: {
                    id: true,
                    code: true,
                    name: true,
                    qrId: true,
                    description: true,
                    status: true,
                    approvalStatus: true,
                    createdAt: true,
                    updatedAt: true,
                    Address: {
                        select: {
                            id: true,
                            street: true,
                            city: true,
                            state: true,
                            zipCode: true,
                        },
                    },
                    _count: {
                        select: {
                            TimeSheets: true,
                        },
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });
            total = jobsiteSummary.length;
            return {
                jobsiteSummary,
                total,
                page,
                pageSize,
                skip,
                totalPages,
            };
        }
        else {
            page = page || 1;
            pageSize = pageSize || 10;
            skip = (page - 1) * pageSize;
            total = await prisma.jobsite.count();
            totalPages = Math.ceil(total / pageSize);
            // Fetch only essential fields from jobsites, paginated
            const jobsiteSummary = await prisma.jobsite.findMany({
                skip,
                take: pageSize,
                select: {
                    id: true,
                    code: true,
                    name: true,
                    qrId: true,
                    description: true,
                    status: true,
                    approvalStatus: true,
                    createdAt: true,
                    updatedAt: true,
                    Address: {
                        select: {
                            id: true,
                            street: true,
                            city: true,
                            state: true,
                            zipCode: true,
                        },
                    },
                    _count: {
                        select: {
                            TimeSheets: true,
                        },
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });
            return {
                jobsiteSummary,
                total,
                page,
                pageSize,
                skip,
                totalPages,
            };
        }
    }
    catch (error) {
        console.error("Error fetching jobsites:", error);
        throw error;
    }
}
export async function getJobsiteById(id) {
    return await prisma.jobsite.findUnique({
        where: { id },
        include: {
            Address: {
                select: {
                    id: true,
                    street: true,
                    city: true,
                    state: true,
                    zipCode: true,
                    country: true,
                },
            },
            CCTags: {
                select: {
                    id: true,
                    name: true,
                },
            },
            createdBy: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
}
export async function createJobsite(payload) {
    return await prisma.$transaction(async (prisma) => {
        const existingAddress = await prisma.address.findFirst({
            where: {
                street: payload.Address.street.trim(),
                city: payload.Address.city.trim(),
                state: payload.Address.state.trim(),
                zipCode: payload.Address.zipCode.trim(),
                country: "US",
            },
        });
        if (existingAddress) {
            await prisma.jobsite.create({
                data: {
                    code: payload.code.trim(),
                    name: `${payload.code.trim()} - ${payload.name.trim()}`,
                    description: payload.description.trim(),
                    approvalStatus: payload.ApprovalStatus,
                    status: payload.status,
                    createdVia: payload.CreatedVia,
                    Address: {
                        connect: { id: existingAddress.id },
                    },
                    ...(payload.Client?.id && {
                        Client: {
                            connect: { id: payload.Client.id },
                        },
                    }),
                    ...(payload.CCTags &&
                        payload.CCTags.length > 0 && {
                        CCTags: {
                            connect: payload.CCTags.map((tag) => ({ id: tag.id })),
                        },
                    }),
                    createdBy: {
                        connect: { id: payload.createdById.trim() },
                    },
                },
            });
        }
        else {
            await prisma.jobsite.create({
                data: {
                    code: payload.code.trim(),
                    name: `${payload.code.trim()} - ${payload.name.trim()}`,
                    description: payload.description.trim(),
                    approvalStatus: payload.ApprovalStatus,
                    status: payload.status,
                    createdVia: payload.CreatedVia,
                    Address: {
                        create: {
                            street: payload.Address.street.trim(),
                            city: payload.Address.city.trim(),
                            state: payload.Address.state.trim(),
                            zipCode: payload.Address.zipCode.trim(),
                            country: "US",
                        },
                    },
                    ...(payload.Client?.id && {
                        Client: {
                            connect: { id: payload.Client.id },
                        },
                    }),
                    ...(payload.CCTags &&
                        payload.CCTags.length > 0 && {
                        CCTags: {
                            connect: payload.CCTags.map((tag) => ({ id: tag.id })),
                        },
                    }),
                    createdBy: {
                        connect: { id: payload.createdById.trim() },
                    },
                },
            });
        }
    });
}
export async function updateJobsite(id, data) {
    const updateData = {};
    if (data.code) {
        updateData.code = data.code.trim();
    }
    if (data.name && data.code) {
        updateData.name = `${data.code.trim()} - ${data.name.trim()}`;
    }
    if (data.description !== undefined) {
        updateData.description = data.description?.trim() || "";
    }
    if (data.approvalStatus) {
        updateData.approvalStatus = data.approvalStatus;
    }
    if (data.status) {
        updateData.status = data.status;
    }
    if (data.creationReason) {
        updateData.creationReason = data.creationReason;
    }
    updateData.updatedAt = new Date();
    if (data.CCTags && Array.isArray(data.CCTags)) {
        updateData.CCTags = {
            set: data.CCTags.map((tag) => ({ id: tag.id })),
        };
    }
    // Handle address update
    if (data.Address) {
        const existingAddress = await prisma.address.findFirst({
            where: {
                street: data.Address.street.trim(),
                city: data.Address.city.trim(),
                state: data.Address.state.trim(),
                zipCode: data.Address.zipCode.trim(),
                country: "US",
            },
        });
        if (existingAddress) {
            // Connect to existing address
            updateData.Address = {
                connect: { id: existingAddress.id },
            };
        }
        else {
            // Create new address
            updateData.Address = {
                create: {
                    street: data.Address.street.trim(),
                    city: data.Address.city.trim(),
                    state: data.Address.state.trim(),
                    zipCode: data.Address.zipCode.trim(),
                    country: "US",
                },
            };
        }
    }
    const updatedJobsite = await prisma.jobsite.update({
        where: { id },
        data: updateData,
        include: { CCTags: true },
    });
    const notification = await prisma.notification.findMany({
        where: {
            topic: "items",
            referenceId: id.toString(),
            Response: {
                is: null,
            },
        },
    });
    if (notification.length > 0) {
        await prisma.$transaction([
            prisma.notificationRead.createMany({
                data: notification.map((n) => ({
                    notificationId: n.id,
                    userId: data.userId,
                    readAt: new Date(),
                })),
            }),
            prisma.notificationResponse.createMany({
                data: notification.map((n) => ({
                    notificationId: n.id,
                    userId: data.userId,
                    response: "Approved",
                    respondedAt: new Date(),
                })),
            }),
        ]);
    }
    return updatedJobsite;
}
export async function archiveJobsite(id) {
    return await prisma.jobsite.update({
        where: { id },
        data: {
            status: "ARCHIVED",
        },
    });
}
export async function restoreJobsite(id) {
    return await prisma.jobsite.update({
        where: { id },
        data: {
            status: "ACTIVE",
        },
    });
}
export async function deleteJobsite(id) {
    return await prisma.jobsite.delete({
        where: { id },
    });
}
//# sourceMappingURL=adminJobsiteService.js.map
//# debugId=f46cf41a-a6d9-5deb-a0aa-dab3a8e91416
