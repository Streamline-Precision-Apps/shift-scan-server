
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8bfaf568-8d90-5138-b98d-9111dc7067ce")}catch(e){}}();
import * as UserService from "../services/UserService.js";
import prisma from "../lib/prisma.js";
// GET /api/v1/user/settings (GET, by query param or header)
export async function getUserSettingsByQuery(req, res) {
    try {
        // Accept userId from body (POST)
        const userId = req.body.userId;
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to retrieve user settings",
            });
        }
        // Only select the requested fields
        const data = await prisma.userSettings.findUnique({
            where: { userId },
            select: {
                userId: true,
                language: true,
                personalReminders: true,
                generalReminders: true,
                cameraAccess: true,
                locationAccess: true,
                cookiesAccess: true,
            },
        });
        if (!data) {
            return res.status(404).json({
                success: false,
                error: "User settings not found",
                message: "No settings for this user",
            });
        }
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.error("❌ Error in getUserSettingsByQuery:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve user settings",
        });
    }
}
// GET /api/v1/user/contact (GET, by query param or header)
export async function getUserContact(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to retrieve user contact info",
            });
        }
        // Fetch employee details as requested
        const employee = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                signature: true,
                Contact: {
                    select: {
                        phoneNumber: true,
                        emergencyContact: true,
                        emergencyContactNumber: true,
                    },
                },
            },
        });
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: "User not found",
                message: "No employee/contact info for this user",
            });
        }
        res.status(200).json({ success: true, data: employee });
    }
    catch (error) {
        console.error("❌ Error in getUserContact:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve user contact info",
        });
    }
}
// GET /api/users
export async function getUsers(req, res) {
    try {
        const users = await UserService.getAllUsers();
        // Remove password from each user object
        const safeUsers = users.map(({ password, ...rest }) => rest);
        res.status(200).json({
            success: true,
            data: safeUsers,
            message: "Users retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve users",
        });
    }
}
// GET /api/users
export async function getAllUsers(req, res) {
    try {
        const users = await UserService.getAllActiveEmployees();
        res.status(200).json({
            success: true,
            data: users,
            message: "Users retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve users",
        });
    }
}
export async function getAllTeams(req, res) {
    try {
        const users = await UserService.getAllTeamsService();
        res.status(200).json({
            success: true,
            data: users,
            message: "Users retrieved successfully",
        });
    }
    catch (error) {
        const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve user",
        });
    }
}
// GET /api/users/:id || GET /api/users/:id?query
export async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const { query } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to retrieve user",
            });
        }
        if (query) {
            const user = await UserService.getUserByIdQuery(id, query);
            res.status(200).json({
                success: true,
                data: user,
                message: "User retrieved successfully",
            });
        }
        else {
            const user = await UserService.getUserById(id);
            // Remove password from user object
            const { password, ...safeUser } = user || {};
            res.status(200).json({
                success: true,
                data: safeUser,
                message: "User retrieved successfully",
            });
        }
    }
    catch (error) {
        const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve user",
        });
    }
}
// POST /api/users
export async function createUser(req, res) {
    try {
        // Convert request body to proper Prisma input
        const userData = UserService.createUserWithCompanyId(req.body);
        const newUser = await UserService.createUser(userData);
        res.status(201).json({
            success: true,
            data: newUser,
            message: "User created successfully",
        });
    }
    catch (error) {
        const statusCode = error instanceof Error && error.message.includes("already exists")
            ? 409
            : 400;
        res.status(statusCode).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to create user",
        });
    }
}
// PUT /api/users/:id
export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to update user",
            });
        }
        const userData = req.body;
        // Convert string 'true'/'false' to boolean for accountSetup if present in body
        if (userData.accountSetup !== undefined) {
            if (userData.accountSetup === "true")
                userData.accountSetup = true;
            else if (userData.accountSetup === "false")
                userData.accountSetup = false;
        }
        const updatedUser = await UserService.updateUser(id, userData);
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: "User updated successfully",
        });
    }
    catch (error) {
        let statusCode = 500;
        if (error instanceof Error) {
            if (error.message.includes("not found"))
                statusCode = 404;
            else if (error.message.includes("already taken"))
                statusCode = 409;
            else if (error.message.includes("required") ||
                error.message.includes("Invalid"))
                statusCode = 400;
        }
        res.status(statusCode).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to update user",
        });
    }
}
// DELETE /api/users/:id
export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to delete user",
            });
        }
        await UserService.deleteUser(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to delete user",
        });
    }
}
// GET /api/user/settings
export async function getUserSettings(req, res) {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to retrieve user settings",
            });
        }
        const settings = await UserService.getUserSettings(userId);
        res.status(200).json({
            success: true,
            data: settings,
            message: "User settings retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve user settings",
        });
    }
}
// PUT /api/user/settings
export async function updateSettings(req, res) {
    try {
        // Extract userId from authenticated token (req.user set by verifyToken middleware)
        const authenticatedUserId = req.user?.id;
        // Verify user is authenticated
        if (!authenticatedUserId) {
            console.error("❌ No authenticated user found");
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
                message: "Authentication required",
            });
        }
        const { userId, ...settings } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to update user settings",
            });
        }
        // Verify user is only updating their own settings
        if (userId !== authenticatedUserId) {
            console.warn(`❌ Unauthorized update attempt: user ${authenticatedUserId} tried to update settings for user ${userId}`);
            return res.status(403).json({
                success: false,
                error: "Forbidden",
                message: "Cannot update other users' settings",
            });
        }
        // Update User email if provided
        if (settings.email !== undefined) {
            await UserService.updateUser(userId, { email: settings.email });
        }
        // Update Contacts info if provided
        if (settings.phoneNumber !== undefined ||
            settings.emergencyContact !== undefined ||
            settings.emergencyContactNumber !== undefined) {
            if (UserService.updateContact) {
                await UserService.updateContact(userId, {
                    phoneNumber: settings.phoneNumber,
                    emergencyContact: settings.emergencyContact,
                    emergencyContactNumber: settings.emergencyContactNumber,
                });
            }
        }
        // Update UserSettings if any settings provided
        const userSettingsFields = [
            "language",
            "generalReminders",
            "personalReminders",
            "cameraAccess",
            "locationAccess",
            "cookiesAccess",
        ];
        const hasSettings = userSettingsFields.some((key) => settings[key] !== undefined);
        if (hasSettings && UserService.updateUserSettings) {
            // Only extract UserSettings fields, not contact or user fields
            const sanitizedSettings = {};
            if (settings.language !== undefined) {
                sanitizedSettings.language = settings.language;
            }
            if (settings.generalReminders !== undefined) {
                sanitizedSettings.generalReminders = Boolean(settings.generalReminders);
            }
            if (settings.personalReminders !== undefined) {
                sanitizedSettings.personalReminders = Boolean(settings.personalReminders);
            }
            if (settings.cameraAccess !== undefined) {
                sanitizedSettings.cameraAccess = Boolean(settings.cameraAccess);
            }
            if (settings.locationAccess !== undefined) {
                sanitizedSettings.locationAccess = Boolean(settings.locationAccess);
            }
            if (settings.cookiesAccess !== undefined) {
                sanitizedSettings.cookiesAccess = Boolean(settings.cookiesAccess);
            }
            await UserService.updateUserSettings(userId, sanitizedSettings);
        }
        res.status(200).json({
            success: true,
            message: "User settings updated successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to update user settings",
        });
    }
}
// GET /api/v1/user/:userId/timesheet/:date
export async function getUsersTimeSheetByDate(req, res) {
    try {
        const { userId, date } = req.params;
        if (!userId || !date) {
            return res.status(400).json({
                success: false,
                error: "User ID and date are required",
                message: "Failed to retrieve timesheet",
            });
        }
        const timesheets = await UserService.getUsersTimeSheetByDate(userId, date);
        if (!timesheets || timesheets.length === 0) {
            // 204 No Content for empty result
            return res.status(204).send();
        }
        res.status(200).json({
            success: true,
            data: timesheets,
            message: "Timesheet(s) retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve timesheet",
        });
    }
}
export async function getTeamsByUserId(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to retrieve teams",
            });
        }
        const teams = await UserService.getTeamsByUserId(userId);
        if (!teams || teams.length === 0) {
            // 204 No Content for empty result
            return res.status(204).send();
        }
        res.status(200).json({
            success: true,
            data: teams,
            message: "Teams retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve teams",
        });
    }
}
// GET /api/v1/user/:userId/crew/:crewId
export async function getCrewMembers(req, res) {
    try {
        const { crewId } = req.params;
        if (!crewId) {
            return res.status(400).json({
                success: false,
                error: "Crew ID is required",
                message: "Failed to retrieve crew members",
            });
        }
        const crew = await UserService.getCrewMembers(crewId);
        if (!crew) {
            return res.status(404).json({
                success: false,
                error: "Crew not found",
                message: "No crew found for this ID",
            });
        }
        res.status(200).json({
            success: true,
            data: crew,
            message: "Crew members retrieved successfully",
        });
    }
    catch (error) {
        console.error("[UserController] Error in getCrewMembers:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve crew members",
        });
    }
}
// GET /api/v1/user/:userId/crew/:crewId/online
export async function getCrewOnlineStatus(req, res) {
    try {
        const { crewId } = req.params;
        if (!crewId) {
            return res.status(400).json({
                success: false,
                error: "Crew ID is required",
                message: "Failed to retrieve crew online status",
            });
        }
        const crew = await UserService.crewStatus(crewId);
        if (!crew) {
            return res.status(404).json({
                success: false,
                error: "Crew not found",
                message: "No crew found for this ID",
            });
        }
        res.status(200).json({
            success: true,
            data: crew,
            message: "Crew online status retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve crew online status",
        });
    }
}
// GET /api/v1/user/:userId/online
export async function getUserOnlineStatus(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to retrieve user online status",
            });
        }
        const status = await UserService.getUserOnlineStatus(userId);
        if (!status) {
            return res.status(404).json({
                success: false,
                error: "User not found",
                message: "No user found for this ID",
            });
        }
        res.status(200).json({
            success: true,
            data: status,
            message: "User online status retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve user online status",
        });
    }
}
// GET /api/v1/user/:userId/info
export async function getUserInfo(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to retrieve user info",
            });
        }
        const info = await UserService.getUserInfo(userId);
        if (!info) {
            return res.status(404).json({
                success: false,
                error: "User not found",
                message: "No user found for this ID",
            });
        }
        res.status(200).json({
            success: true,
            data: info,
            message: "User info retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to retrieve user info",
        });
    }
}
export async function sessionController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to create session",
            });
        }
        const session = await UserService.createSession(id);
        res.status(201).json({
            success: true,
            data: session,
            message: "Session created successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to create session",
        });
    }
}
export async function endSessionController(req, res) {
    try {
        const { sessionId } = req.params;
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                error: "Session ID is required",
                message: "Failed to end session",
            });
        }
        const session = await UserService.EndSession(Number(sessionId));
        res.status(200).json({
            success: true,
            data: session,
            message: "Session ended successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to end session",
        });
    }
}
export async function userSignatureController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
                message: "Failed to handle user signature",
            });
        }
        const signature = await UserService.handleUserSignature(id);
        res.status(200).json({
            success: true,
            data: signature,
            message: "User signature handled successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "Failed to handle user signature",
        });
    }
}
//# sourceMappingURL=UserController.js.map
//# debugId=8bfaf568-8d90-5138-b98d-9111dc7067ce
