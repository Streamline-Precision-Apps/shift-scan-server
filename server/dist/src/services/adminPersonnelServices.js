
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6288b172-a951-542a-b648-25b3a06cd2c1")}catch(e){}}();
import { hash } from "bcryptjs";
import prisma from "../lib/prisma.js";
export async function getCrewEmployees() {
    return await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            secondLastName: true,
            permission: true,
            truckView: true,
            mechanicView: true,
            laborView: true,
            tascoView: true,
            image: true,
            terminationDate: true,
        },
    });
}
export async function getAllCrews({ page = 1, pageSize = 25, status = "all", search = "", } = {}) {
    let crews, total, skip, totalPages;
    if (status === "inactive") {
        // No pagination for inactive crews
        skip = undefined;
        totalPages = 1;
        const whereCondition = {
        // Add your inactive condition here if you have one
        // For now, we'll just search all crews
        };
        if (search) {
            whereCondition.name = { contains: search, mode: "insensitive" };
        }
        crews = await prisma.crew.findMany({
            where: whereCondition,
            orderBy: {
                name: "asc",
            },
            include: {
                Users: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        secondLastName: true,
                        image: true,
                    },
                },
            },
        });
        total = crews.length;
    }
    else {
        // Standard pagination
        skip = (page - 1) * pageSize;
        const whereCondition = {};
        if (search) {
            whereCondition.name = { contains: search, mode: "insensitive" };
        }
        total = await prisma.crew.count({
            where: whereCondition,
        });
        totalPages = Math.ceil(total / pageSize);
        crews = await prisma.crew.findMany({
            where: whereCondition,
            skip,
            take: pageSize,
            orderBy: {
                name: "asc",
            },
            include: {
                Users: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        secondLastName: true,
                        image: true,
                    },
                },
            },
        });
    }
    return {
        crews,
        total,
        page,
        pageSize,
        totalPages,
    };
}
export async function getEmployeeInfo(id) {
    return await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            secondLastName: true,
            username: true,
            email: true,
            DOB: true,
            image: true,
            signature: true,
            truckView: true,
            tascoView: true,
            laborView: true,
            mechanicView: true,
            permission: true,
            startDate: true,
            terminationDate: true,
            Contact: {
                select: {
                    phoneNumber: true,
                    emergencyContact: true,
                    emergencyContactNumber: true,
                },
            },
            Crews: {
                select: {
                    id: true,
                    name: true,
                    leadId: true,
                },
            },
        },
    });
}
export async function getCrewByIdAdmin(id) {
    return await prisma.crew.findUnique({
        where: {
            id,
        },
        include: {
            Users: {
                select: {
                    id: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    secondLastName: true,
                },
            },
        },
    });
}
/**
 * Get paginated and filtered personnel summary for admin panel
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export async function getPersonnelManager({ page = 1, pageSize = 25, status = "all", search = "", accessLevel = "", roles = "", accountSetup = "", crews = "", } = {}) {
    // Parse filter parameters
    const permissions = roles ? roles.split(",") : [];
    const accessLevels = accessLevel ? accessLevel.split(",") : [];
    const accountSetupValues = accountSetup ? accountSetup.split(",") : [];
    const crewsValues = crews ? crews.split(",") : [];
    // Build filter conditions
    const buildFilterConditions = () => {
        const conditions = {};
        // Permission filter
        if (permissions.length > 0) {
            conditions.permission = { in: permissions };
        }
        // Access level filter
        if (accessLevels.length > 0) {
            const accessConditions = [];
            if (accessLevels.includes("truckView"))
                accessConditions.push({ truckView: true });
            if (accessLevels.includes("tascoView"))
                accessConditions.push({ tascoView: true });
            if (accessLevels.includes("mechanicView"))
                accessConditions.push({ mechanicView: true });
            if (accessLevels.includes("laborView"))
                accessConditions.push({ laborView: true });
            if (accessConditions.length > 0) {
                conditions.accessLevelConditions = accessConditions;
            }
        }
        // Account setup filter
        if (accountSetupValues.length > 0) {
            const booleanValues = [];
            for (const val of accountSetupValues) {
                if (val === "true")
                    booleanValues.push(true);
                else if (val === "false")
                    booleanValues.push(false);
            }
            if (booleanValues.length > 0) {
                if (booleanValues.length === 1)
                    conditions.accountSetup = booleanValues[0];
                else
                    conditions.accountSetup = { in: booleanValues };
            }
        }
        // Crews filter
        if (crewsValues.length > 0) {
            if (crewsValues.includes("hasCrews") &&
                !crewsValues.includes("noCrews")) {
                conditions.hasCrews = true;
            }
            else if (crewsValues.includes("noCrews") &&
                !crewsValues.includes("hasCrews")) {
                conditions.hasCrews = false;
            }
        }
        return conditions;
    };
    const filterConditions = buildFilterConditions();
    let users, total, skip, totalPages;
    if (status === "inactive") {
        skip = undefined;
        totalPages = 1;
        const whereCondition = {
            terminationDate: { not: null },
        };
        if (filterConditions.permission)
            whereCondition.permission = filterConditions.permission;
        if (filterConditions.accountSetup !== undefined)
            whereCondition.accountSetup = filterConditions.accountSetup;
        if (filterConditions.hasCrews !== undefined) {
            whereCondition.Crews = filterConditions.hasCrews
                ? { some: {} }
                : { none: {} };
        }
        // OR conditions for search and access levels
        if (search || filterConditions.accessLevelConditions) {
            const searchConditions = [];
            const accessConditions = filterConditions.accessLevelConditions || [];
            if (search) {
                searchConditions.push({ username: { contains: search, mode: "insensitive" } }, { firstName: { contains: search, mode: "insensitive" } }, { middleName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } }, { secondLastName: { contains: search, mode: "insensitive" } }, {
                    Contact: { phoneNumber: { contains: search, mode: "insensitive" } },
                });
            }
            if (search && accessConditions.length > 0) {
                whereCondition.AND = [
                    { OR: searchConditions },
                    { OR: accessConditions },
                ];
            }
            else if (searchConditions.length > 0) {
                whereCondition.OR = searchConditions;
            }
            else if (accessConditions.length > 0) {
                whereCondition.OR = accessConditions;
            }
        }
        users = await prisma.user.findMany({
            where: whereCondition,
            select: {
                id: true,
                username: true,
                firstName: true,
                middleName: true,
                lastName: true,
                secondLastName: true,
                image: true,
                email: true,
                DOB: true,
                terminationDate: true,
                accountSetup: true,
                permission: true,
                truckView: true,
                tascoView: true,
                laborView: true,
                mechanicView: true,
                Crews: { select: { id: true, name: true, leadId: true } },
                Contact: {
                    select: {
                        phoneNumber: true,
                        emergencyContact: true,
                        emergencyContactNumber: true,
                    },
                },
            },
            orderBy: { lastName: "asc" },
        });
        total = users.length;
        page = 1;
        pageSize = users.length;
    }
    else {
        // Ensure page and pageSize are strings before parsing
        const pageStr = typeof page === "number" ? String(page) : page;
        const pageSizeStr = typeof pageSize === "number" ? String(pageSize) : pageSize;
        page = parseInt(pageStr, 10) || 1;
        pageSize = parseInt(pageSizeStr, 10) || 25;
        skip = (page - 1) * pageSize;
        const whereCondition = {
            terminationDate: null,
        };
        if (filterConditions.permission)
            whereCondition.permission = filterConditions.permission;
        if (filterConditions.accountSetup !== undefined)
            whereCondition.accountSetup = filterConditions.accountSetup;
        if (filterConditions.hasCrews !== undefined) {
            whereCondition.Crews = filterConditions.hasCrews
                ? { some: {} }
                : { none: {} };
        }
        // OR conditions for search and access levels
        if (search || filterConditions.accessLevelConditions) {
            const searchConditions = [];
            const accessConditions = filterConditions.accessLevelConditions || [];
            if (search) {
                searchConditions.push({ username: { contains: search, mode: "insensitive" } }, { firstName: { contains: search, mode: "insensitive" } }, { middleName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } }, { secondLastName: { contains: search, mode: "insensitive" } }, {
                    Contact: { phoneNumber: { contains: search, mode: "insensitive" } },
                });
            }
            if (search && accessConditions.length > 0) {
                whereCondition.AND = [
                    { OR: searchConditions },
                    { OR: accessConditions },
                ];
            }
            else if (searchConditions.length > 0) {
                whereCondition.OR = searchConditions;
            }
            else if (accessConditions.length > 0) {
                whereCondition.OR = accessConditions;
            }
        }
        total = await prisma.user.count({ where: whereCondition });
        totalPages = Math.ceil(total / pageSize);
        users = await prisma.user.findMany({
            where: whereCondition,
            select: {
                id: true,
                username: true,
                firstName: true,
                middleName: true,
                lastName: true,
                secondLastName: true,
                image: true,
                email: true,
                DOB: true,
                terminationDate: true,
                accountSetup: true,
                permission: true,
                truckView: true,
                tascoView: true,
                laborView: true,
                mechanicView: true,
                Crews: { select: { id: true, name: true, leadId: true } },
                Contact: {
                    select: {
                        phoneNumber: true,
                        emergencyContact: true,
                        emergencyContactNumber: true,
                    },
                },
            },
            orderBy: { lastName: "asc" },
            skip,
            take: pageSize,
        });
    }
    // Post-process to add crew lead names
    const userIds = new Set();
    users.forEach((user) => {
        user.Crews?.forEach((crew) => {
            if (crew.leadId)
                userIds.add(crew.leadId);
        });
    });
    const crewLeads = await prisma.user.findMany({
        where: { id: { in: Array.from(userIds) } },
        select: { id: true, firstName: true, lastName: true },
    });
    const leadMap = new Map();
    crewLeads.forEach((lead) => {
        leadMap.set(lead.id, `${lead.firstName} ${lead.lastName}`);
    });
    const usersWithCrewLeads = users.map((user) => ({
        ...user,
        Crews: user.Crews?.map((crew) => ({
            ...crew,
            leadName: leadMap.get(crew.leadId) || "Unknown",
        })),
    }));
    return {
        users: usersWithCrewLeads,
        total,
        page,
        pageSize,
        totalPages,
    };
}
export async function createCrew(name, Users, leadId, crewType) {
    if (!name || !name.trim())
        throw new Error("Crew name is required.");
    if (!Users)
        throw new Error("Crew members data is missing.");
    if (!leadId)
        throw new Error("A team lead is required.");
    const newCrew = await prisma.crew.create({
        data: {
            name: name.trim(),
            leadId,
            crewType,
            Users: {
                connect: JSON.parse(Users),
            },
        },
    });
    return {
        success: true,
        crewId: newCrew.id,
        message: "Crew created successfully",
    };
}
export async function editCrew(id, name, Users, leadId, crewType) {
    if (!name || !name.trim())
        throw new Error("Crew name is required.");
    if (!Users)
        throw new Error("Crew members data is missing.");
    if (!leadId)
        throw new Error("A team lead is required.");
    const existingCrew = await prisma.crew.findUnique({
        where: { id },
        include: { Users: true },
    });
    if (!existingCrew)
        throw new Error("Crew not found.");
    const newUsers = JSON.parse(Users);
    const updatedCrew = await prisma.crew.update({
        where: { id },
        data: {
            name: name.trim(),
            leadId,
            crewType,
            Users: {
                disconnect: existingCrew.Users.map((user) => ({ id: user.id })),
                connect: newUsers.map((user) => ({ id: user.id })),
            },
        },
    });
    return {
        success: true,
        crewId: updatedCrew.id,
        message: "Crew updated successfully",
    };
}
export async function deleteCrew(id) {
    await prisma.crew.delete({ where: { id } });
    return { success: true };
}
export async function createUserAdmin(payload) {
    try {
        const hashedPassword = await hash(payload.password, 10);
        const result = await prisma.$transaction(async (prisma) => {
            // Create the user
            const user = await prisma.user.create({
                data: {
                    username: payload.username,
                    password: hashedPassword,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    permission: payload.permission,
                    truckView: payload.truckView,
                    tascoView: payload.tascoView,
                    mechanicView: payload.mechanicView,
                    laborView: payload.laborView,
                    clockedIn: false,
                    accountSetup: false,
                    startDate: new Date(),
                    Crews: {
                        connect: payload.crews.map((crew) => ({ id: crew.id })),
                    },
                    Contact: {
                        create: {
                        // phoneNumber,
                        // emergencyContact,
                        // emergencyContactNumber,
                        },
                    },
                    Company: { connect: { id: "1" } },
                },
            });
            // Create user settings
            await prisma.userSettings.create({
                data: {
                    userId: user.id,
                    language: "en",
                    generalReminders: false,
                    personalReminders: false,
                    cameraAccess: false,
                    locationAccess: false,
                },
            });
            return { success: true, userId: user.id };
        });
        return result;
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw new Error(`Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
export async function editUserAdmin(payload) {
    const result = await prisma.$transaction(async (prisma) => {
        // Disconnect all crews, then connect only the selected ones
        const user = await prisma.user.update({
            where: { id: payload.id },
            data: {
                username: payload.username,
                firstName: payload.firstName,
                middleName: payload.middleName,
                lastName: payload.lastName,
                secondLastName: payload.secondLastName,
                permission: payload.permission,
                truckView: payload.truckView,
                tascoView: payload.tascoView,
                mechanicView: payload.mechanicView,
                laborView: payload.laborView,
                Crews: {
                    set: [], // disconnect all crews first
                    connect: payload.crews.map((crew) => ({ id: crew.id })),
                },
                Company: { connect: { id: "1" } },
            },
        });
        return { success: true, userId: user.id };
    });
    return result;
}
export async function deleteUser(id) {
    await prisma.user.delete({ where: { id } });
    return { success: true };
}
export async function getAllActiveEmployees() {
    return await prisma.user.findMany({
        where: {
            OR: [{ terminationDate: null }, { terminationDate: { gt: new Date() } }],
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
        },
    });
}
//# sourceMappingURL=adminPersonnelServices.js.map
//# debugId=6288b172-a951-542a-b648-25b3a06cd2c1
