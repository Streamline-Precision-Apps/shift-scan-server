import { useState, useCallback } from "react";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import { UserLocation } from "../_utils/clusteringUtils";

/**
 * Hook to fetch and manage location data
 */
export const useLocationData = () => {
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchLocations = useCallback(async (selectedDate: string) => {
    try {
      setLoading(true);
      const data: UserLocation[] = await apiRequest(
        `/api/location/all?date=${selectedDate}`,
        "GET"
      );
      console.log("Fetched locations:", data);
      setUserLocations(data);
      setLastUpdate(new Date());
      setError(null);
      setShowError(false);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch locations";
      setError(errorMessage);
      setShowError(true);
      console.error("Error fetching locations:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    userLocations,
    setUserLocations,
    loading,
    error,
    showError,
    setShowError,
    lastUpdate,
    fetchLocations,
  };
};
