import { useState, useCallback, useRef } from "react";
import L from "leaflet";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import {
  getRoutedPath,
  consolidateCoordinates,
  getDistance,
} from "../_utils/locationUtils";

interface Location {
  coords: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  ts: string;
}

/**
 * Hook to manage user location history display
 */
export const useUserHistory = () => {
  const [pathHistoryUserId, setPathHistoryUserId] = useState<string | null>(
    null
  );
  const [loadingHistoryUserId, setLoadingHistoryUserId] = useState<
    string | null
  >(null);
  const [historyStats, setHistoryStats] = useState<{
    count: number;
    avgAccuracy: number;
  } | null>(null);
  const [pathLayers, setPathLayers] = useState<{
    polyline: L.Polyline | null;
    outline: L.Polyline | null;
    markers: L.CircleMarker[];
  }>({
    polyline: null,
    outline: null,
    markers: [],
  });

  const clearPathLayers = useCallback(
    (map: L.Map | null) => {
      if (pathLayers.polyline && map) {
        map.removeLayer(pathLayers.polyline);
      }
      if (pathLayers.outline && map) {
        map.removeLayer(pathLayers.outline);
      }
      pathLayers.markers.forEach((marker) => {
        if (map) {
          map.removeLayer(marker);
        }
      });
      setPathLayers({
        polyline: null,
        outline: null,
        markers: [],
      });
    },
    [pathLayers]
  );

  const clearUserHistory = useCallback(
    (map: L.Map | null, showAllMarkers: () => void) => {
      clearPathLayers(map);
      setPathHistoryUserId(null);
      setHistoryStats(null);
      setLoadingHistoryUserId(null);
      showAllMarkers();
    },
    [clearPathLayers]
  );

  const displayUserHistory = useCallback(
    async (
      userId: string,
      map: L.Map | null,
      selectedDate: string,
      hideAllMarkers: () => void,
      showAllMarkers: () => void
    ) => {
      try {
        setLoadingHistoryUserId(userId);

        // Add a small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Clear existing paths
        clearPathLayers(map);

        // If clicking the same user, just toggle it off
        if (pathHistoryUserId === userId) {
          setPathHistoryUserId(null);
          setHistoryStats(null);
          setLoadingHistoryUserId(null);
          showAllMarkers();
          return;
        }

        if (!map) return;

        // Fetch location history for the user
        const historyData: Location[] = await apiRequest(
          `/api/location/${userId}/history?date=${selectedDate}`,
          "GET"
        );

        // Extract and sort coordinates
        const coordinates = historyData
          .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
          .map((loc) => [loc.coords.lat, loc.coords.lng] as [number, number]);

        if (coordinates.length > 0) {
          // Consolidate clustered coordinates
          const consolidatedCoordinates = consolidateCoordinates(coordinates);

          // Calculate statistics
          const validAccuracies = historyData
            .filter(
              (loc) =>
                loc.coords.accuracy !== undefined &&
                loc.coords.accuracy !== null
            )
            .map((loc) => loc.coords.accuracy as number);

          const avgAccuracy =
            validAccuracies.length > 0
              ? validAccuracies.reduce((a, b) => a + b, 0) /
                validAccuracies.length
              : 0;

          setHistoryStats({
            count: historyData.length,
            avgAccuracy: Math.round(avgAccuracy * 100) / 100,
          });

          // Hide all markers to show only the path
          hideAllMarkers();

          // Get routed path
          let routedCoordinates: [number, number][] = [];
          for (let i = 0; i < consolidatedCoordinates.length - 1; i++) {
            const segment = await getRoutedPath(
              consolidatedCoordinates[i],
              consolidatedCoordinates[i + 1]
            );
            routedCoordinates.push(...segment.slice(0, -1));
          }
          if (consolidatedCoordinates.length > 0) {
            routedCoordinates.push(
              consolidatedCoordinates[consolidatedCoordinates.length - 1]
            );
          }

          // Create outline polyline
          const outlinePolyline = L.polyline(routedCoordinates, {
            color: "#ffffff",
            weight: 16,
            opacity: 0.8,
            dashArray: "10, 5",
          }).addTo(map);

          // Create main polyline
          const mainPolyline = L.polyline(routedCoordinates, {
            color: "#3b82f6",
            weight: 10,
            opacity: 1,
            dashArray: "10, 5",
            lineCap: "round" as const,
            lineJoin: "round" as const,
          }).addTo(map);

          // Add circle markers at consolidated points
          const circleMarkers: L.CircleMarker[] = [];
          consolidatedCoordinates.forEach((coord) => {
            const circleMarker = L.circleMarker(coord, {
              radius: 8,
              fillColor: "#3b82f6",
              color: "#1e40af",
              weight: 2,
              opacity: 1,
              fillOpacity: 0.9,
            }).addTo(map);
            circleMarkers.push(circleMarker);
          });

          setPathLayers({
            polyline: mainPolyline,
            outline: outlinePolyline,
            markers: circleMarkers,
          });

          // Fit map to show entire path
          const group = new L.FeatureGroup(
            consolidatedCoordinates.map((coord) => L.marker(coord))
          );
          map.fitBounds(group.getBounds().pad(0.1));

          setPathHistoryUserId(userId);
        }
      } catch (err) {
        console.error("Error fetching user history:", err);
        alert("Failed to fetch user history");
      } finally {
        setLoadingHistoryUserId(null);
      }
    },
    [pathHistoryUserId, clearPathLayers, pathLayers]
  );

  return {
    pathHistoryUserId,
    setPathHistoryUserId,
    loadingHistoryUserId,
    historyStats,
    setHistoryStats,
    displayUserHistory,
    clearUserHistory,
    clearPathLayers,
  };
};
