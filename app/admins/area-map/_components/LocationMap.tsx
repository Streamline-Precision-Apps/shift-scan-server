"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Hooks
import { useLocationMap } from "../_hooks/useLocationMap";
import { useLocationData } from "../_hooks/useLocationData";
import { useMarkers } from "../_hooks/useMarkers";
import { useUserHistory } from "../_hooks/useUserHistory";
import { useUIState } from "../_hooks/useUIState";

// Utils
import {
  findClusters,
  getClusteredUserIds,
  UserLocation,
} from "../_utils/clusteringUtils";
import {
  createClusterIcon,
  calculateIconSize,
  createUserMarkerIcon,
} from "../_utils/markerUtils";

// Components
import { LocationMapHeader } from "./LocationMapHeader";
import { LocationMapSidebar } from "./LocationMapSidebar";
import { LocationMapLegend } from "./LocationMapLegend";
import { ErrorBanner } from "./ErrorBanner";

const LocationMap: React.FC = () => {
  // Initialize hooks
  const { mapContainer, map } = useLocationMap();
  const {
    userLocations,
    loading,
    error,
    showError,
    setShowError,
    lastUpdate,
    fetchLocations: fetchLocationData,
  } = useLocationData();

  const {
    markersRef,
    clusterMarkersRef,
    clusterCountRef,
    locationsRef,
    hideAllMarkers,
    showAllMarkers,
  } = useMarkers();

  const {
    pathHistoryUserId,
    loadingHistoryUserId,
    historyStats,
    displayUserHistory: displayUserHistoryFn,
    clearUserHistory,
  } = useUserHistory();

  const {
    selectedCluster,
    setSelectedCluster,
    sidebarOpen,
    setSidebarOpen,
    focusedId,
    setFocusedId,
    selectedDate,
    setSelectedDate,
  } = useUIState();

  // Refs for focus tracking
  const focusedMarkerIdRef = useRef<string | null>(null);
  const focusedClusterIdRef = useRef<string | null>(null);

  // Fetch locations on date change
  useEffect(() => {
    fetchLocationData(selectedDate).then((data) => {
      locationsRef.current = data;
      updateMarkers(data);
    });
  }, [selectedDate, fetchLocationData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLocationData(selectedDate).then((data) => {
        locationsRef.current = data;
        updateMarkers(data);
      });
    }, 300000);
    return () => clearInterval(interval);
  }, [selectedDate, fetchLocationData]);

  // Update marker sizes when focus changes
  useEffect(() => {
    focusedMarkerIdRef.current = focusedId?.startsWith("marker_")
      ? focusedId
      : null;
  }, [focusedId]);

  // Update cluster sizes when focus changes
  useEffect(() => {
    focusedClusterIdRef.current = focusedId?.startsWith("cluster_")
      ? focusedId
      : null;
  }, [focusedId]);

  // Update map markers
  const updateMarkers = (locations: UserLocation[]) => {
    if (!map.current) return;

    const clusters = findClusters(locations);
    const clusteredUserIds = getClusteredUserIds(clusters);

    // Clear old cluster markers before adding new ones
    Object.keys(clusterMarkersRef.current).forEach((clusterId) => {
      if (map.current) {
        map.current.removeLayer(clusterMarkersRef.current[clusterId]);
      }
      delete clusterMarkersRef.current[clusterId];
    });
    Object.keys(clusterCountRef.current).forEach((clusterId) => {
      delete clusterCountRef.current[clusterId];
    });

    // Add cluster markers
    clusters.forEach((cluster, clusterIndex) => {
      const avgLat =
        cluster.reduce((sum, loc) => sum + loc.location.coords.lat, 0) /
        cluster.length;
      const avgLng =
        cluster.reduce((sum, loc) => sum + loc.location.coords.lng, 0) /
        cluster.length;

      const clusterId = `cluster_${clusterIndex}`;
      const zoom = map.current?.getZoom() || 11;
      const isFocused = focusedId === clusterId;
      const baseSize = 20;
      const iconSize = calculateIconSize(zoom, isFocused, baseSize);

      const clusterIcon = createClusterIcon(
        cluster.length,
        iconSize,
        Math.max(12, zoom)
      );

      const clusterMarker = L.marker([avgLat, avgLng], { icon: clusterIcon });

      clusterMarker.on("click", (e: L.LeafletEvent) => {
        L.DomEvent.stopPropagation(e);
        if (focusedClusterIdRef.current === clusterId) {
          setFocusedId(null);
          setSidebarOpen(false);
        } else {
          setFocusedId(clusterId);
          setSelectedCluster(cluster);
          setSidebarOpen(true);
        }
      });

      if (map.current) {
        clusterMarker.addTo(map.current);
      }
      clusterMarkersRef.current[clusterId] = clusterMarker;
      clusterCountRef.current[clusterId] = cluster.length;
    });

    // Add individual markers for non-clustered users
    locations.forEach((userLocation) => {
      if (clusteredUserIds.has(userLocation.userId)) return;

      const markerId = userLocation.userId;
      const { lat, lng } = userLocation.location.coords;
      const zoom = map.current?.getZoom() || 11;
      const isFocused = focusedId === `marker_${markerId}`;
      const baseSize = 20;
      const iconSize = calculateIconSize(zoom, isFocused, baseSize);

      if (markersRef.current[markerId]) {
        markersRef.current[markerId].setLatLng([lat, lng]);
        markersRef.current[markerId].setIcon(
          createUserMarkerIcon(userLocation.profilePicture, iconSize)
        );
      } else {
        const icon = createUserMarkerIcon(
          userLocation.profilePicture,
          iconSize
        );
        const marker = L.marker([lat, lng], { icon });

        marker.on("click", (e: L.LeafletEvent) => {
          L.DomEvent.stopPropagation(e);
          if (focusedMarkerIdRef.current === `marker_${markerId}`) {
            setFocusedId(null);
            setSidebarOpen(false);
          } else {
            setFocusedId(`marker_${markerId}`);
            setSelectedCluster([userLocation]);
            setSidebarOpen(true);
          }
        });

        if (map.current) {
          marker.addTo(map.current);
        }
        markersRef.current[markerId] = marker;
      }
    });

    // Clean up old markers
    Object.keys(markersRef.current).forEach((markerId) => {
      if (!locations.some((loc) => loc.userId === markerId)) {
        if (map.current) {
          map.current.removeLayer(markersRef.current[markerId]);
        }
        delete markersRef.current[markerId];
      }
    });
  };

  // Handle user history display
  const handleUserHistory = (userId: string) => {
    displayUserHistoryFn(
      userId,
      map.current,
      selectedDate,
      hideAllMarkers,
      showAllMarkers
    );
  };

  // Handle closing user history
  const handleCloseHistory = () => {
    clearUserHistory(map.current, showAllMarkers);
  };

  // Handle sidebar close
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setFocusedId(null);
    clearUserHistory(map.current, showAllMarkers);
  };

  return (
    <div className="w-full h-full flex flex-col ">
      <LocationMapHeader
        userLocationsCount={userLocations.length}
        loading={loading}
        lastUpdate={lastUpdate}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onRefresh={() =>
          fetchLocationData(selectedDate).then((data) => {
            locationsRef.current = data;
            updateMarkers(data);
          })
        }
      />

      {error && showError && (
        <ErrorBanner error={error} onDismiss={() => setShowError(false)} />
      )}

      <div className="flex flex-1 overflow-hidden">
        <div
          ref={mapContainer}
          className="flex-1 min-h-0 z-0"
          style={{ height: "calc(100vh - 150px)" }}
        />

        {sidebarOpen && selectedCluster && (
          <LocationMapSidebar
            selectedCluster={selectedCluster}
            pathHistoryUserId={pathHistoryUserId}
            loadingHistoryUserId={loadingHistoryUserId}
            historyStats={historyStats}
            onUserHistoryClick={handleUserHistory}
            onCloseHistory={handleCloseHistory}
            onClose={handleCloseSidebar}
            selectedDate={selectedDate}
          />
        )}
      </div>

      <LocationMapLegend />
    </div>
  );
};

export default LocationMap;
