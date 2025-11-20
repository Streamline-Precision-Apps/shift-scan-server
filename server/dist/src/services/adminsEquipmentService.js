
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ee216b4d-9e00-570a-a171-a7aa4492f2ae")}catch(e){}}();
import prisma from "../lib/prisma.js";
export async function createEquipmentService(equipmentData, createdById, qrId) {
    return await prisma.equipment.create({
        data: {
            qrId,
            code: equipmentData.code || "",
            name: equipmentData.name,
            description: equipmentData.description || "",
            memo: equipmentData.memo || "",
            ownershipType: equipmentData.ownershipType || null,
            acquiredDate: equipmentData.acquiredDate ?? null,
            acquiredCondition: equipmentData.acquiredCondition || null,
            equipmentTag: equipmentData.equipmentTag,
            state: equipmentData.state || "AVAILABLE",
            approvalStatus: equipmentData.approvalStatus || "APPROVED",
            status: equipmentData.status || "ACTIVE",
            overWeight: equipmentData.overWeight || false,
            currentWeight: equipmentData.currentWeight || 0,
            createdById,
            // Add vehicle-specific fields directly to the equipment
            make: equipmentData.make ?? null,
            model: equipmentData.model ?? null,
            year: equipmentData.year ?? null,
            color: equipmentData.color ?? null,
            serialNumber: equipmentData.serialNumber ?? null,
            licensePlate: equipmentData.licensePlate ?? null,
            licenseState: equipmentData.licenseState ?? null,
        },
    });
}
export async function editEquipmentService(id, body, userId) {
    const updateData = {};
    // Process all possible equipment fields from body
    if (body.name !== undefined)
        updateData.name = body.name;
    if (body.code !== undefined)
        updateData.code = body.code;
    if (body.description !== undefined)
        updateData.description = body.description || "";
    if (body.memo !== undefined)
        updateData.memo = body.memo;
    if (body.equipmentTag !== undefined)
        updateData.equipmentTag = body.equipmentTag;
    if (body.state !== undefined)
        updateData.state = body.state;
    if (body.status !== undefined)
        updateData.status = body.status;
    if (body.ownershipType !== undefined)
        updateData.ownershipType = body.ownershipType || null;
    if (body.acquiredCondition !== undefined)
        updateData.acquiredCondition =
            body.acquiredCondition || null;
    if (body.serialNumber !== undefined)
        updateData.serialNumber = body.serialNumber;
    if (body.color !== undefined)
        updateData.color = body.color;
    // Vehicle/equipment specific fields
    if (body.make !== undefined)
        updateData.make = body.make;
    if (body.model !== undefined)
        updateData.model = body.model;
    if (body.year !== undefined)
        updateData.year = body.year;
    if (body.licensePlate !== undefined)
        updateData.licensePlate = body.licensePlate;
    if (body.licenseState !== undefined)
        updateData.licenseState = body.licenseState;
    // Handle date fields
    if (body.acquiredDate !== undefined) {
        if (typeof body.acquiredDate === "string" ||
            typeof body.acquiredDate === "number" ||
            body.acquiredDate instanceof Date) {
            updateData.acquiredDate = body.acquiredDate
                ? new Date(body.acquiredDate)
                : null;
        }
        else {
            updateData.acquiredDate = null;
        }
    }
    if (body.registrationExpiration !== undefined) {
        const regExpValue = body.registrationExpiration;
        if (regExpValue &&
            regExpValue !== "null" &&
            regExpValue !== "undefined" &&
            (typeof regExpValue === "string" ||
                typeof regExpValue === "number" ||
                regExpValue instanceof Date)) {
            updateData.registrationExpiration = new Date(regExpValue);
        }
        else {
            updateData.registrationExpiration = null;
        }
    }
    // Handle numeric fields
    if (body.currentWeight !== undefined) {
        const weightValue = body.currentWeight;
        if (typeof weightValue === "string") {
            updateData.currentWeight = weightValue ? parseFloat(weightValue) || 0 : 0;
        }
        else if (typeof weightValue === "number") {
            updateData.currentWeight = weightValue;
        }
        else {
            // If it's an object (e.g., NullableFloatFieldUpdateOperationsInput), assign as is
            updateData.currentWeight = weightValue;
        }
    }
    // Handle boolean fields
    if (body.overWeight !== undefined) {
        if (typeof body.overWeight === "boolean") {
            updateData.overWeight = body.overWeight;
        }
        else if (typeof body.overWeight === "string") {
            updateData.overWeight = body.overWeight === "true";
        }
        else {
            updateData.overWeight = null;
        }
    }
    // Handle status fields
    if (body.approvalStatus !== undefined)
        updateData.approvalStatus = body.approvalStatus;
    if (body.creationReason !== undefined)
        updateData.creationReason = body.creationReason;
    // Always update the timestamp
    updateData.updatedAt = new Date();
    const updatedEquipment = await prisma.equipment.update({
        where: { id },
        data: updateData,
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
        // Wrap notificationRead and notificationResponse createMany in a transaction
        await prisma.$transaction([
            prisma.notificationRead.createMany({
                data: notification.map((n) => ({
                    notificationId: n.id,
                    userId,
                    readAt: new Date(),
                })),
            }),
            prisma.notificationResponse.createMany({
                data: notification.map((n) => ({
                    notificationId: n.id,
                    userId,
                    response: "Approved",
                    respondedAt: new Date(),
                })),
            }),
        ]);
    }
    return updatedEquipment;
}
export async function archiveEquipmentService(id) {
    return await prisma.equipment.update({
        where: { id },
        data: {
            status: "ARCHIVED",
        },
    });
}
export async function restoreEquipmentService(id) {
    return await prisma.equipment.update({
        where: { id },
        data: {
            status: "ACTIVE",
        },
    });
}
export async function deleteEquipmentService(id) {
    return await prisma.equipment.delete({
        where: { id },
    });
}
// Common select fields for equipment queries
const equipmentSelectFields = {
    id: true,
    qrId: true,
    code: true,
    name: true,
    description: true,
    memo: true,
    ownershipType: true,
    equipmentTag: true,
    status: true,
    approvalStatus: true,
    state: true,
    createdAt: true,
    updatedAt: true,
    make: true,
    model: true,
    year: true,
    color: true,
    serialNumber: true,
    acquiredDate: true,
    acquiredCondition: true,
    licensePlate: true,
    licenseState: true,
    _count: {
        select: {
            EmployeeEquipmentLogs: true,
            TascoLogs: true,
            HauledInLogs: true,
            UsedAsTrailer: true,
            UsedAsTruck: true,
            Maintenance: true,
        },
    },
};
export async function getAllEquipmentService({ status, filtersParam, searchTerm, requestedPage, requestedPageSize, }) {
    // Base search condition that will be applied to all queries
    const searchCondition = searchTerm
        ? {
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { code: { contains: searchTerm, mode: "insensitive" } },
            ],
        }
        : {};
    // Parse filters if provided
    const whereClause = { ...searchCondition };
    // Add status filter if specified
    if (status === "pending") {
        whereClause.approvalStatus = "PENDING";
    }
    // Add custom filters if provided
    if (filtersParam) {
        try {
            const filters = JSON.parse(filtersParam);
            // Add filter for equipment tags if provided
            if (filters.equipmentTags && filters.equipmentTags.length > 0) {
                whereClause.equipmentTag = {
                    in: filters.equipmentTags,
                };
            }
            // Add filter for ownership types if provided
            if (filters.ownershipTypes && filters.ownershipTypes.length > 0) {
                whereClause.ownershipType = {
                    in: filters.ownershipTypes,
                };
            }
            // Add filter for conditions if provided
            if (filters.conditions && filters.conditions.length > 0) {
                whereClause.acquiredCondition = {
                    in: filters.conditions,
                };
            }
            // Add filter for statuses if provided
            if (filters.statuses && filters.statuses.length > 0) {
                whereClause.approvalStatus = {
                    in: filters.statuses,
                };
            }
            // Add filter for activity status if provided
            if (filters.activityStatuses && filters.activityStatuses.length > 0) {
                whereClause.status = {
                    in: filters.activityStatuses,
                };
            }
        }
        catch (error) {
            console.error("Error parsing filters:", error);
            throw new Error("Invalid filters");
        }
    }
    // Count total matching records (for pagination)
    const total = await prisma.equipment.count({ where: whereClause });
    // Calculate pagination values
    const isPaginationDisabled = status === "pending" ||
        searchTerm.trim() !== "" ||
        (filtersParam && filtersParam !== "{}");
    // Either use pagination or get all results
    const skip = isPaginationDisabled
        ? 0
        : (requestedPage - 1) * requestedPageSize;
    const take = isPaginationDisabled ? undefined : requestedPageSize;
    const effectivePage = isPaginationDisabled ? 1 : requestedPage;
    const effectivePageSize = isPaginationDisabled ? total : requestedPageSize;
    const totalPages = Math.ceil(total / (effectivePageSize || 1)) || 1;
    // Fetch equipment data
    const equipment = await prisma.equipment.findMany({
        where: whereClause,
        skip,
        ...(take !== undefined && { take }),
        select: equipmentSelectFields,
        orderBy: {
            code: "asc",
        },
    });
    // Count pending equipment for badge count
    const pendingEquipment = await prisma.equipment.count({
        where: {
            approvalStatus: "PENDING",
        },
    });
    return {
        equipment,
        total,
        pendingEquipment,
        page: effectivePage,
        pageSize: effectivePageSize,
        totalPages,
    };
}
export async function getEquipmentByIdService(id) {
    return await prisma.equipment.findUnique({
        where: { id },
        include: {
            DocumentTags: true,
            createdBy: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });
}
export async function getEquipmentSummaryService() {
    return await prisma.equipment.findMany({
        select: {
            id: true,
            name: true,
            approvalStatus: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}
//# sourceMappingURL=adminsEquipmentService.js.map
//# debugId=ee216b4d-9e00-570a-a171-a7aa4492f2ae
