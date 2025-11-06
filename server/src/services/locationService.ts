import { firestoreDb } from "../lib/firebase.js";
import type { Location } from "../models/location.js";

// Helper to get collection reference
function getLocationsCollection(userId: string) {
  return firestoreDb.collection(`users/${userId}/locations`);
}

// No need for getFirestore; using firestoreDb from admin SDK

export async function fetchLatestLocation(
  userId: string
): Promise<Location | null> {
  const locationsRef = getLocationsCollection(userId);
  const snapshot = await locationsRef.orderBy("ts", "desc").limit(1).get();
  console.log(
    `[Location] Fetching latest for user ${userId}: ${snapshot.size} docs found`
  );
  if (snapshot.empty || !snapshot.docs[0]) {
    console.warn(`[Location] No location found for user ${userId}`);
    return null;
  }
  return snapshot.docs[0].data() as Location;
}

export async function fetchLocationHistory(
  userId: string
): Promise<Location[]> {
  const locationsRef = getLocationsCollection(userId);
  const snapshot = await locationsRef.orderBy("ts", "desc").get();
  return snapshot.docs.map((doc) => doc.data() as Location);
}

export async function fetchAllUsersLatestLocations(): Promise<
  Array<{
    userId: string;
    location: Location;
    userName?: string;
  }>
> {
  try {
    // Get all users from the main users collection
    const usersRef = firestoreDb.collection("users");
    const usersSnapshot = await usersRef.get();

    const allLocations: Array<{
      userId: string;
      location: Location;
      userName?: string;
    }> = [];

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

export async function saveUserLocation(
  userId: string,
  coords: Location["coords"],
  device?: Location["device"]
): Promise<boolean> {
  const payload: Location = {
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
