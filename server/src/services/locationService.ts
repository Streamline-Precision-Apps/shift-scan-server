import prisma from "../lib/prisma.js";
import type { Location } from "../types/Location.js";

// Helper function to get start and end of day in user's local timezone
function getDayRange(date: Date = new Date()) {
  // Parse ISO string and create date in local timezone
  const isoString = date.toISOString();
  const dateStr = isoString.split("T")[0] || "2025-01-01";
  const parts = dateStr.split("-");
  const year = parseInt(parts[0]!);
  const month = parseInt(parts[1]!);
  const day = parseInt(parts[2]!);

  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  return { startOfDay, endOfDay };
}

export async function fetchLatestLocation(
  userId: string,
  date: Date = new Date()
): Promise<Location | null> {
  const { startOfDay, endOfDay } = getDayRange(date);

  const marker = await prisma.locationMarker.findFirst({
    where: {
      Session: {
        userId,
      },
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
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

export async function fetchLocationHistory(
  userId: string,
  date: Date = new Date()
): Promise<Location[]> {
  const { startOfDay, endOfDay } = getDayRange(date);

  const markers = await prisma.locationMarker.findMany({
    where: {
      Session: {
        userId,
      },
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let locations = markers.map((marker) => ({
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

  // Add fake history for Emily Wilson (test-user-4)
  if (userId === "test-user-4") {
    const baseTime = new Date();
    const fakeHistory = [
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 3600000), // 1 hour ago
        coords: {
          lat: 42.5395,
          lng: -113.782,
          accuracy: 5,
          speed: 0,
          heading: 0,
        },
        device: {},
      },
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 3300000), // 55 min ago
        coords: {
          lat: 42.5397,
          lng: -113.7825,
          accuracy: 6,
          speed: 1.2,
          heading: 45,
        },
        device: {},
      },
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 3000000), // 50 min ago
        coords: {
          lat: 42.54,
          lng: -113.783,
          accuracy: 5,
          speed: 1.5,
          heading: 90,
        },
        device: {},
      },
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 2700000), // 45 min ago
        coords: {
          lat: 42.5402,
          lng: -113.7835,
          accuracy: 7,
          speed: 2.0,
          heading: 45,
        },
        device: {},
      },
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 2400000), // 40 min ago
        coords: {
          lat: 42.5405,
          lng: -113.784,
          accuracy: 6,
          speed: 1.8,
          heading: 0,
        },
        device: {},
      },
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 2100000), // 35 min ago
        coords: {
          lat: 42.5408,
          lng: -113.7838,
          accuracy: 5,
          speed: 1.2,
          heading: 315,
        },
        device: {},
      },
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 1800000), // 30 min ago
        coords: {
          lat: 42.541,
          lng: -113.7833,
          accuracy: 8,
          speed: 0.5,
          heading: 270,
        },
        device: {},
      },
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 1500000), // 25 min ago
        coords: {
          lat: 42.5408,
          lng: -113.7828,
          accuracy: 6,
          speed: 1.0,
          heading: 180,
        },
        device: {},
      },
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 1200000), // 20 min ago
        coords: {
          lat: 42.5405,
          lng: -113.7822,
          accuracy: 5,
          speed: 1.5,
          heading: 225,
        },
        device: {},
      },
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 900000), // 15 min ago
        coords: {
          lat: 42.54,
          lng: -113.7815,
          accuracy: 7,
          speed: 2.0,
          heading: 270,
        },
        device: {},
      },
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 600000), // 10 min ago
        coords: {
          lat: 42.5397,
          lng: -113.781,
          accuracy: 6,
          speed: 1.8,
          heading: 225,
        },
        device: {},
      },
      {
        uid: userId,
        ts: new Date(baseTime.getTime() - 300000), // 5 min ago
        coords: {
          lat: 42.5393,
          lng: -113.7818,
          accuracy: 5,
          speed: 1.2,
          heading: 90,
        },
        device: {},
      },
      {
        uid: userId,
        ts: baseTime, // now
        coords: {
          lat: 42.5393,
          lng: -113.7823,
          accuracy: 5,
          speed: 0,
          heading: 0,
        },
        device: {},
      },
    ];
    locations = [...fakeHistory, ...locations];
  }

  return locations;
}

export async function fetchAllUsersLatestLocations(
  date: Date = new Date()
): Promise<
  Array<{
    userId: string;
    location: Location;
    userName?: string;
    profilePicture?: string | undefined;
    phoneNumber?: string | undefined;
    startTime?: string;
    endTime?: string;
  }>
> {
  try {
    const { startOfDay, endOfDay } = getDayRange(date);

    // Get all unique users who have location markers on the specified day
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
            image: true,
            Contact: {
              select: { phoneNumber: true },
            },
          },
        },
        locationMarkers: {
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    const allLocations: Array<{
      userId: string;
      location: Location;
      userName?: string;
      profilePicture?: string | undefined;
      phoneNumber?: string | undefined;
      startTime?: string;
      endTime?: string;
    }> = [];

    for (const session of sessions) {
      if (session.locationMarkers.length > 0) {
        const marker = session.locationMarkers[0]!;
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
          profilePicture: session.User?.image || undefined,
          phoneNumber: session.User?.Contact?.phoneNumber || undefined,
          ...(session.startTime && {
            startTime: session.startTime.toISOString(),
          }),
          ...(session.endTime && { endTime: session.endTime.toISOString() }),
        });
      }
    }

    // Append fake test users for development
    const fakeUsers = [
      {
        userId: "test-user-1",
        location: {
          uid: "test-user-1",
          ts: new Date(),
          coords: {
            lat: 42.5392,
            lng: -113.7822,
            accuracy: 5,
            speed: 0,
            heading: 0,
          },
          device: {},
        },
        userName: "John Smith",
        profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        phoneNumber: "(208) 555-0101",
        startTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        endTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
      },
      {
        userId: "test-user-2",
        location: {
          uid: "test-user-2",
          ts: new Date(),
          coords: {
            lat: 42.53925,
            lng: -113.78225,
            accuracy: 8,
            speed: 2,
            heading: 90,
          },
          device: {},
        },
        userName: "Sarah Johnson",
        profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        phoneNumber: "(208) 555-0102",
        startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      },
      {
        userId: "test-user-3",
        location: {
          uid: "test-user-3",
          ts: new Date(),
          coords: {
            lat: 42.53915,
            lng: -113.78215,
            accuracy: 6,
            speed: 1.5,
            heading: 180,
          },
          device: {},
        },
        userName: "Mike Davis",
        profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        phoneNumber: "(208) 555-0103",
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
      },
      {
        userId: "test-user-4",
        location: {
          uid: "test-user-4",
          ts: new Date(),
          coords: {
            lat: 42.53935,
            lng: -113.78235,
            accuracy: 7,
            speed: 3,
            heading: 45,
          },
          device: {},
        },
        userName: "Emily Wilson",
        profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        phoneNumber: "(208) 555-0104",
        startTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
      },
      {
        userId: "test-user-5",
        location: {
          uid: "test-user-5",
          ts: new Date(),
          coords: {
            lat: 42.539,
            lng: -113.782,
            accuracy: 9,
            speed: 0.5,
            heading: 270,
          },
          device: {},
        },
        userName: "Robert Brown",
        profilePicture:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
        phoneNumber: "(208) 555-0105",
        startTime: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
        endTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
      },
    ];

    allLocations.push(...fakeUsers);

    return allLocations;
  } catch (err) {
    console.error("Error fetching all users locations:", err);
    return [];
  }
}

export function validateLocationPayload(
  payload: Partial<Location>
): string | null {
  if (
    !payload.coords ||
    typeof payload.coords.lat !== "number" ||
    typeof payload.coords.lng !== "number"
  ) {
    return "Missing or invalid coordinates";
  }
  return null;
}

export async function saveUserClockInLocation(
  userId: string,
  sessionId: number,
  coords: Location["coords"],
  device?: Location["device"]
): Promise<boolean> {
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
  } catch (err) {
    console.error("Error saving location marker:", err);
    throw err;
  }
}
export async function saveUserClockOutLocation(
  userId: string,
  sessionId: number,
  coords: Location["coords"],
  device?: Location["device"]
): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.locationMarker.create({
        data: {
          sessionId,
          lat: coords.lat,
          long: coords.lng,
          accuracy: coords.accuracy ?? null,
          speed: coords.speed ?? null,
          heading: coords.heading ?? null,
        },
      });

      await tx.session.update({
        where: {
          id: sessionId,
        },
        data: {
          endTime: new Date(),
        },
      });
    });
    return true;
  } catch (err) {
    console.error("Error saving location marker:", err);
    throw err;
  }
}
