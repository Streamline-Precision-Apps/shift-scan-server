
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a7e0f227-7e31-5244-8430-82ac689db331")}catch(e){}}();
import { firestoreDb } from "../lib/firebase.js";
// Helper to get collection reference
function getLocationsCollection(userId) {
    return firestoreDb.collection(`users/${userId}/locations`);
}
// No need for getFirestore; using firestoreDb from admin SDK
export async function fetchLatestLocation(userId) {
    const locationsRef = getLocationsCollection(userId);
    const snapshot = await locationsRef.orderBy("ts", "desc").limit(1).get();
    if (snapshot.empty || !snapshot.docs[0])
        return null;
    return snapshot.docs[0].data();
}
export async function fetchLocationHistory(userId) {
    const locationsRef = getLocationsCollection(userId);
    const snapshot = await locationsRef.orderBy("ts", "desc").get();
    return snapshot.docs.map((doc) => doc.data());
}
export async function fetchAllUsersLatestLocations() {
    try {
        // Get all users from the main users collection
        const usersRef = firestoreDb.collection("users");
        const usersSnapshot = await usersRef.get();
        const allLocations = [];
        // For each user, get their latest location
        for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;
            const userData = userDoc.data();
            const latestLocation = await fetchLatestLocation(userId);
            if (latestLocation) {
                allLocations.push({
                    userId,
                    location: latestLocation,
                    userName: userData.firstName
                        ? `${userData.firstName} ${userData.lastName || ""}`
                        : userId,
                });
            }
        }
        return allLocations;
    }
    catch (err) {
        console.error("Error fetching all users locations:", err);
        return [];
    }
}
export function validateLocationPayload(payload) {
    if (!payload.coords ||
        typeof payload.coords.lat !== "number" ||
        typeof payload.coords.lng !== "number") {
        return "Missing or invalid coordinates";
    }
    return null;
}
export async function saveUserLocation(userId, coords, device) {
    const payload = {
        uid: userId,
        ts: new Date(),
        coords,
        device: device || {},
    };
    const locationsRef = getLocationsCollection(userId);
    const docId = Date.now().toString();
    await locationsRef.doc(docId).set(payload);
    return true;
}
//# sourceMappingURL=locationService.js.map
//# debugId=a7e0f227-7e31-5244-8430-82ac689db331
