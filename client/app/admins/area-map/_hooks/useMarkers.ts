import { useRef, useCallback } from "react";
import L from "leaflet";
import { UserLocation } from "../_utils/clusteringUtils";
import {
  createUserMarkerIcon,
  createClusterIcon,
  calculateIconSize,
} from "../_utils/markerUtils";

/**
 * Hook to manage marker creation, updates, and cleanup
 */
export const useMarkers = () => {
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const clusterMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const clusterCountRef = useRef<{ [key: string]: number }>({});
  const locationsRef = useRef<UserLocation[]>([]);

  const updateMarkerIcon = useCallback(
    (marker: L.Marker, markerId: string, map: L.Map | null) => {
      const zoom = map?.getZoom() || 11;
      const isFocused = false; // Will be set from parent
      const baseSize = isFocused ? 50 : 10;
      const iconSize = calculateIconSize(zoom, isFocused, baseSize);

      const userLocation = locationsRef.current.find(
        (loc) => loc.userId === markerId
      );

      if (userLocation) {
        marker.setIcon(
          createUserMarkerIcon(userLocation.profilePicture, iconSize)
        );
      }
    },
    []
  );

  const updateClusterIcon = useCallback(
    (
      clusterCount: number,
      clusterId: string,
      marker: L.Marker,
      map: L.Map | null
    ) => {
      const zoom = map?.getZoom() || 11;
      const isFocused = false; // Will be set from parent
      const baseSize = isFocused ? 50 : 10;
      const iconSize = calculateIconSize(zoom, isFocused, baseSize);

      const newClusterIcon = createClusterIcon(
        clusterCount,
        iconSize,
        Math.max(12, zoom)
      );
      marker.setIcon(newClusterIcon);
    },
    []
  );

  const hideAllMarkers = useCallback(() => {
    console.log("Hiding all markers");
    Object.values(markersRef.current).forEach((marker) => {
      marker.setOpacity(0);
    });
    Object.values(clusterMarkersRef.current).forEach((marker) => {
      marker.setOpacity(0);
    });
  }, []);

  const showAllMarkers = useCallback(() => {
    Object.values(markersRef.current).forEach((marker) => {
      marker.setOpacity(1);
    });
    Object.values(clusterMarkersRef.current).forEach((marker) => {
      marker.setOpacity(1);
    });
  }, []);

  const clearAllMarkers = useCallback((map: L.Map | null) => {
    Object.keys(markersRef.current).forEach((markerId) => {
      if (map) {
        map.removeLayer(markersRef.current[markerId]);
      }
      delete markersRef.current[markerId];
    });

    Object.keys(clusterMarkersRef.current).forEach((clusterId) => {
      if (map) {
        map.removeLayer(clusterMarkersRef.current[clusterId]);
      }
      delete clusterMarkersRef.current[clusterId];
    });
  }, []);

  return {
    markersRef,
    clusterMarkersRef,
    clusterCountRef,
    locationsRef,
    updateMarkerIcon,
    updateClusterIcon,
    hideAllMarkers,
    showAllMarkers,
    clearAllMarkers,
  };
};
