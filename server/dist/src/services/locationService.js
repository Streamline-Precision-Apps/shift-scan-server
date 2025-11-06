
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="17734c60-656f-5b2d-a1f7-0e4978af6e6c")}catch(e){}}();
import prisma from "../lib/prisma.js";
export async function fetchLatestLocation(userId) {
    const marker = await prisma.locationMarker.findFirst({
        where: {
            Session: {
                userId,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!marker) {
        console.warn(`[Location] No location found for user ${userId}`);
        return null;
    }
    console.log(`[Location] Fetching latest for user ${userId}: location found`);
    return {
        uid: userId,
        ts: marker.createdAt,
        coords: {
            lat: marker.lat,
            lng: marker.long,
            accuracy: marker.accuracy,
            speed: marker.speed,
            heading: marker.heading,
        },
        device: {},
    };
}
export async function fetchLocationHistory(userId) {
    const markers = await prisma.locationMarker.findMany({
        where: {
            Session: {
                userId,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return markers.map((marker) => ({
        uid: userId,
        ts: marker.createdAt,
        coords: {
            lat: marker.lat,
            lng: marker.long,
            accuracy: marker.accuracy,
            speed: marker.speed,
            heading: marker.heading,
        },
        device: {},
    }));
}
export async function fetchAllUsersLatestLocations() {
    try {
        // Get all unique users who have location markers
        const sessions = await prisma.session.findMany({
            distinct: ["userId"],
            orderBy: {
                startTime: "desc",
            },
            include: {
                User: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                locationMarkers: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                },
            },
        });
        const allLocations = [];
        for (const session of sessions) {
            if (session.locationMarkers.length > 0) {
                const marker = session.locationMarkers[0];
                const userName = session.User
                    ? `${session.User.firstName} ${session.User.lastName || ""}`.trim()
                    : session.userId;
                allLocations.push({
                    userId: session.userId,
                    location: {
                        uid: session.userId,
                        ts: marker.createdAt,
                        coords: {
                            lat: marker.lat,
                            lng: marker.long,
                            accuracy: marker.accuracy,
                            speed: marker.speed,
                            heading: marker.heading,
                        },
                        device: {},
                    },
                    userName,
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
export async function saveUserLocation(userId, sessionId, coords, device) {
    try {
        await prisma.locationMarker.create({
            data: {
                sessionId,
                lat: coords.lat,
                long: coords.lng,
                accuracy: coords.accuracy ?? null,
                speed: coords.speed ?? null,
                heading: coords.heading ?? null,
            },
        });
        return true;
    }
    catch (err) {
        console.error("Error saving location marker:", err);
        throw err;
    }
}
//# sourceMappingURL=locationService.js.map
//# debugId=17734c60-656f-5b2d-a1f7-0e4978af6e6c
