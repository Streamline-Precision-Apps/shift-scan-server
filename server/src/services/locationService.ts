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

  const locations = markers.map((marker) => ({
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
  coords?: Location["coords"],
  device?: Location["device"]
): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx) => {
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
