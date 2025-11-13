/**
 * Utility functions for location calculations and operations
 */

/**
 * Calculate distance between two coordinates in meters using Haversine formula
 */
export const getDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Get routed path between two coordinates using OSRM (Open Source Routing Machine)
 */
export const getRoutedPath = async (
  start: [number, number],
  end: [number, number]
): Promise<[number, number][]> => {
  try {
    // OSRM format is lng,lat (opposite of Leaflet)
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson&overview=full`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      // Convert GeoJSON coordinates (lng,lat) back to Leaflet format (lat,lng)
      return data.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng]
      );
    }
    // Fallback to direct line if routing fails
    return [start, end];
  } catch (err) {
    console.warn("OSRM routing failed, using direct path:", err);
    // Fallback to direct line
    return [start, end];
  }
};

/**
 * Consolidate coordinates that are clustered within a certain radius
 */
export const consolidateCoordinates = (
  coordinates: [number, number][],
  radiusMeters: number = 100
): [number, number][] => {
  const consolidatedCoordinates: [number, number][] = [];
  const processedIndices = new Set<number>();

  coordinates.forEach((coord, index) => {
    if (processedIndices.has(index)) return;

    const cluster: [number, number][] = [coord];
    processedIndices.add(index);

    // Find all nearby coordinates within the radius
    coordinates.forEach((otherCoord, otherIndex) => {
      if (
        index !== otherIndex &&
        !processedIndices.has(otherIndex) &&
        getDistance(coord[0], coord[1], otherCoord[0], otherCoord[1]) <=
          radiusMeters
      ) {
        cluster.push(otherCoord);
        processedIndices.add(otherIndex);
      }
    });

    // Calculate average position of the cluster
    const avgLat = cluster.reduce((sum, c) => sum + c[0], 0) / cluster.length;
    const avgLng = cluster.reduce((sum, c) => sum + c[1], 0) / cluster.length;
    consolidatedCoordinates.push([avgLat, avgLng]);
  });

  return consolidatedCoordinates;
};

/**
 * Interface for reverse geocoding response
 */
export interface AddressResult {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  fullAddress?: string;
}

/**
 * Get street address from coordinates using Google Geocoding API
 * Requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable
 */
export const getAddressFromCoordinates = async (
  lat: number,
  lng: number
): Promise<AddressResult | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key not configured");
      return null;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn("Google Geocoding failed:", response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      console.warn("Google Geocoding returned no results:", data.status);
      return null;
    }

    // Use the first result (most accurate)
    const result = data.results[0];
    const addressComponents = result.address_components;
    let formattedAddress = result.formatted_address;

    // Remove USA and country from the formatted address
    formattedAddress = formattedAddress.replace(/, USA$/, "");

    // Extract address components
    let street = "";
    let city = "";
    let state = "";
    let zipCode = "";

    addressComponents.forEach(
      (component: { long_name: string; types: string[] }) => {
        if (component.types.includes("route")) {
          street = component.long_name;
        }
        if (component.types.includes("street_number")) {
          street = `${component.long_name} ${street}`;
        }
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      }
    );

    return {
      street: street || undefined,
      city: city || undefined,
      state: state || undefined,
      zipCode: zipCode || undefined,
      fullAddress: formattedAddress || undefined,
    };
  } catch (err) {
    console.warn("Error getting address from coordinates:", err);
    return null;
  }
};

/**
 * Get coordinates from street address using Google Geocoding API
 * Requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable
 */
export const getCoordinatesFromAddress = async (
  address: string
): Promise<[number, number] | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key not configured");
      return null;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn("Google Geocoding failed:", response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      console.warn("Google Geocoding returned no results:", data.status);
      return null;
    }

    const result = data.results[0];
    const location = result.geometry.location;
    return [location.lat, location.lng];
  } catch (err) {
    console.warn("Error getting coordinates from address:", err);
    return null;
  }
};
