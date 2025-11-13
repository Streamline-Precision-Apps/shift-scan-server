import { getDistance } from "./locationUtils";

export interface UserLocation {
  userId: string;
  userName?: string;
  profilePicture?: string;
  phoneNumber?: string;
  location: {
    coords: {
      lat: number;
      lng: number;
      accuracy?: number;
    };
    ts: string;
  };
  startTime?: string;
  endTime?: string;
}

/**
 * Find clusters of nearby users within a proximity radius
 */
export const findClusters = (
  locations: UserLocation[],
  proximityRadius: number = 100
): UserLocation[][] => {
  const clustered = new Set<string>();
  const clusters: UserLocation[][] = [];

  locations.forEach((location, index) => {
    if (clustered.has(location.userId)) return;

    const cluster: UserLocation[] = [location];
    clustered.add(location.userId);

    locations.forEach((otherLocation, otherIndex) => {
      if (
        index !== otherIndex &&
        !clustered.has(otherLocation.userId) &&
        getDistance(
          location.location.coords.lat,
          location.location.coords.lng,
          otherLocation.location.coords.lat,
          otherLocation.location.coords.lng
        ) <= proximityRadius
      ) {
        cluster.push(otherLocation);
        clustered.add(otherLocation.userId);
      }
    });

    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  });

  return clusters;
};

/**
 * Get all user IDs that are part of a cluster
 */
export const getClusteredUserIds = (
  clusters: UserLocation[][]
): Set<string> => {
  const clusteredUserIds = new Set<string>();
  clusters.forEach((cluster) => {
    cluster.forEach((user) => {
      clusteredUserIds.add(user.userId);
    });
  });
  return clusteredUserIds;
};
