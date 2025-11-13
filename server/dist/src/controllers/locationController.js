
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="41dde560-e000-56fa-b4e7-31b17833bcfe")}catch(e){}}();
import { fetchLatestLocation, fetchLocationHistory, fetchAllUsersLatestLocations, saveUserLocation, validateLocationPayload, } from "../services/locationService.js";
// get the latest location for a user
export async function getUserLocations(req, res) {
    const userId = req.user?.id || req.params.userId;
    if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
    }
    try {
        // Parse date from query parameter, default to today
        const dateParam = req.query.date;
        const date = dateParam ? new Date(dateParam) : new Date();
        const location = await fetchLatestLocation(userId, date);
        if (!location) {
            return res.status(404).json({ error: "No location found for user" });
        }
        return res.json(location);
    }
    catch (err) {
        console.error("Error fetching user location:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
// Get all users' current locations for map view
export async function getAllUsersLocations(req, res) {
    try {
        // Parse date from query parameter, default to today
        const dateParam = req.query.date;
        const date = dateParam ? new Date(dateParam) : new Date();
        const locations = await fetchAllUsersLatestLocations(date);
        return res.json(locations);
    }
    catch (err) {
        console.error("Error fetching all users locations:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
// fetch all locations for a user (for history)
export async function getUserLocationHistory(req, res) {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
    }
    try {
        // Parse date from query parameter, default to today
        const dateParam = req.query.date;
        const date = dateParam ? new Date(dateParam) : new Date();
        const locations = await fetchLocationHistory(userId, date);
        return res.json(locations);
    }
    catch (err) {
        console.error("Error fetching user location history:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
// Handle POST location from client
export async function postUserLocation(req, res) {
    // Extract userId, sessionId, and location data from request body
    const { userId, sessionId, coords, device } = req.body;
    if (!userId || !sessionId || !coords) {
        return res
            .status(400)
            .json({ error: "Missing userId, sessionId, or coordinates" });
    }
    const validationError = validateLocationPayload({ coords });
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }
    try {
        await saveUserLocation(userId, parseInt(sessionId), coords, device);
        return res.status(201).json({ success: true });
    }
    catch (err) {
        console.error("Error posting user location:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
//# sourceMappingURL=locationController.js.map
//# debugId=41dde560-e000-56fa-b4e7-31b17833bcfe
