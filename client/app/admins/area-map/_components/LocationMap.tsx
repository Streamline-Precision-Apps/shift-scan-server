"use client";

import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import { UsersRound } from "lucide-react";

// Add CSS for rounded marker images
const markerStyles = `
  .leaflet-marker-icon {
    border-radius: 50% !important;
    object-fit: cover;
    border: 3px solid var(--color-app-dark-blue, #1e3a5f) !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
    box-sizing: border-box !important;
  }
  .leaflet-marker-icon.cluster-wrapper {
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .cluster-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4f46e5;
    border-radius: 50%;
    color: white;
    font-weight: bold;
    border: 3px solid var(--color-app-dark-blue, #1e3a5f);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
  }
`;

interface Location {
  coords: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  ts: string;
}

interface UserLocation {
  userId: string;
  userName?: string;
  profilePicture?: string;
  phoneNumber?: string;
  location: Location;
  startTime?: string;
  endTime?: string;
}

const LocationMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const clusterMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const clusterCountRef = useRef<{ [key: string]: number }>({});
  const locationsRef = useRef<UserLocation[]>([]);
  const pathPolylineRef = useRef<L.Polyline | null>(null);
  const pathOutlineRef = useRef<L.Polyline | null>(null);
  const pathMarkersRef = useRef<L.CircleMarker[]>([]);
  const focusedMarkerIdRef = useRef<string | null>(null);
  const focusedClusterIdRef = useRef<string | null>(null);
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedCluster, setSelectedCluster] = useState<UserLocation[] | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [pathHistoryUserId, setPathHistoryUserId] = useState<string | null>(
    null
  );
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyStats, setHistoryStats] = useState<{
    count: number;
    avgAccuracy: number;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Calculate distance between two coordinates in meters
  const getDistance = (
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

  // Get routed path between two coordinates using OSRM
  const getRoutedPath = async (
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

  // Hide all markers
  const hideAllMarkers = () => {
    Object.keys(markersRef.current).forEach((markerId) => {
      markersRef.current[markerId]
        .getElement()
        ?.style.setProperty("display", "none", "important");
    });
    Object.keys(clusterMarkersRef.current).forEach((clusterId) => {
      clusterMarkersRef.current[clusterId]
        .getElement()
        ?.style.setProperty("display", "none", "important");
    });
  };

  // Show all markers
  const showAllMarkers = () => {
    Object.keys(markersRef.current).forEach((markerId) => {
      markersRef.current[markerId]
        .getElement()
        ?.style.removeProperty("display");
    });
    Object.keys(clusterMarkersRef.current).forEach((clusterId) => {
      clusterMarkersRef.current[clusterId]
        .getElement()
        ?.style.removeProperty("display");
    });
  };

  // Fetch and display user location history
  const displayUserHistory = async (userId: string) => {
    try {
      setLoadingHistory(true);

      // Clear existing paths if showing a different user
      if (pathPolylineRef.current) {
        map.current?.removeLayer(pathPolylineRef.current);
        pathPolylineRef.current = null;
      }
      if (pathOutlineRef.current) {
        map.current?.removeLayer(pathOutlineRef.current);
        pathOutlineRef.current = null;
      }
      // Clear existing path markers
      pathMarkersRef.current.forEach((marker) => {
        if (map.current) {
          map.current.removeLayer(marker);
        }
      });
      pathMarkersRef.current = [];

      // If clicking the same user, just toggle it off
      if (pathHistoryUserId === userId) {
        setPathHistoryUserId(null);
        setHistoryStats(null);
        showAllMarkers();
        return;
      }

      // Fetch location history for the user
      const historyData: Location[] = await apiRequest(
        `/api/location/${userId}/history?date=${selectedDate}`,
        "GET"
      );

      if (!map.current) return;

      // Extract coordinates for the path
      const coordinates = historyData
        .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
        .map((loc) => [loc.coords.lat, loc.coords.lng] as [number, number]);

      if (coordinates.length > 0) {
        // Consolidate clustered coordinates within 100 meters into single points
        const consolidatedCoordinates: [number, number][] = [];
        const processedIndices = new Set<number>();

        coordinates.forEach((coord, index) => {
          if (processedIndices.has(index)) return;

          const cluster: [number, number][] = [coord];
          processedIndices.add(index);

          // Find all nearby coordinates within 100 meters
          coordinates.forEach((otherCoord, otherIndex) => {
            if (
              index !== otherIndex &&
              !processedIndices.has(otherIndex) &&
              getDistance(coord[0], coord[1], otherCoord[0], otherCoord[1]) <=
                100
            ) {
              cluster.push(otherCoord);
              processedIndices.add(otherIndex);
            }
          });

          // Calculate average position of the cluster
          const avgLat =
            cluster.reduce((sum, c) => sum + c[0], 0) / cluster.length;
          const avgLng =
            cluster.reduce((sum, c) => sum + c[1], 0) / cluster.length;
          consolidatedCoordinates.push([avgLat, avgLng]);
        });

        // Calculate statistics
        const validAccuracies = historyData
          .filter(
            (loc) =>
              loc.coords.accuracy !== undefined && loc.coords.accuracy !== null
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

        // Get routed path that follows roads
        let routedCoordinates: [number, number][] = [];
        for (let i = 0; i < consolidatedCoordinates.length - 1; i++) {
          const segment = await getRoutedPath(
            consolidatedCoordinates[i],
            consolidatedCoordinates[i + 1]
          );
          // Add all coordinates except the last one (to avoid duplicates at segment junctions)
          routedCoordinates.push(...segment.slice(0, -1));
        }
        // Add the final coordinate
        if (consolidatedCoordinates.length > 0) {
          routedCoordinates.push(
            consolidatedCoordinates[consolidatedCoordinates.length - 1]
          );
        }

        // Create polyline to show the routed path with outline effect
        // First create a white outline layer for depth
        pathOutlineRef.current = L.polyline(routedCoordinates, {
          color: "#ffffff",
          weight: 16,
          opacity: 0.8,
          dashArray: "10, 5",
        }).addTo(map.current);

        // Then create the main blue line on top
        pathPolylineRef.current = L.polyline(routedCoordinates, {
          color: "#3b82f6",
          weight: 10,
          opacity: 1,
          dashArray: "10, 5",
          lineCap: "round" as const,
          lineJoin: "round" as const,
        }).addTo(map.current);

        // Add blue circle markers at each consolidated cluster point (not all routed points)
        consolidatedCoordinates.forEach((coord) => {
          const circleMarker = L.circleMarker(coord, {
            radius: 8,
            fillColor: "#3b82f6",
            color: "#1e40af",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          }).addTo(map.current!);
          pathMarkersRef.current.push(circleMarker);
        });

        // Fit map to show entire path
        const group = new L.FeatureGroup(
          consolidatedCoordinates.map((coord) => L.marker(coord))
        );
        map.current.fitBounds(group.getBounds().pad(0.1));

        setPathHistoryUserId(userId);
      }
    } catch (err) {
      console.error("Error fetching user history:", err);
      alert("Failed to fetch user history");
    } finally {
      setLoadingHistory(false);
    }
  };

  // Find clusters of nearby users (within 100 meters)
  const findClusters = (
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

  // Update marker icon size based on zoom and focus state
  const updateMarkerIcon = (marker: L.Marker, markerId?: string) => {
    const zoom = map.current?.getZoom() || 11;
    const isFocused = focusedId === `marker_${markerId}`;
    const baseSize = isFocused ? 50 : 10;
    const iconSize = Math.max(baseSize, baseSize + zoom * 2);

    // Find the user location for this marker
    const id =
      markerId ||
      Object.keys(markersRef.current).find(
        (id) => markersRef.current[id] === marker
      );

    if (!id) return;

    const userLocation = locationsRef.current.find((loc) => loc.userId === id);

    if (userLocation) {
      marker.setIcon(
        L.icon({
          iconUrl:
            userLocation.profilePicture ||
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [iconSize, iconSize],
          iconAnchor: [iconSize / 2, iconSize / 2],
          popupAnchor: [0, -(iconSize / 2)],
          shadowSize: [iconSize, iconSize],
          className: "rounded-full",
        })
      );
    }
  };

  // Update cluster icon size based on zoom and focus state
  const updateClusterIcon = (
    clusterCount: number,
    clusterId: string,
    marker: L.Marker
  ) => {
    const zoom = map.current?.getZoom() || 11;
    const isFocused = focusedId === `cluster_${clusterId}`;
    const baseSize = isFocused ? 50 : 10;
    const iconSize = Math.max(baseSize, baseSize + zoom * 2);

    const clusterDiv = document.createElement("div");
    clusterDiv.className = "cluster-icon";
    clusterDiv.style.width = `${iconSize}px`;
    clusterDiv.style.height = `${iconSize}px`;
    clusterDiv.style.fontSize = `${Math.max(12, zoom)}px`;
    clusterDiv.innerHTML = `${clusterCount}`;

    const newClusterIcon = L.divIcon({
      html: clusterDiv.outerHTML,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2],
      popupAnchor: [0, -(iconSize / 2)],
      className: "cluster-wrapper",
    });

    marker.setIcon(newClusterIcon);
  };

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      // Inject marker styles
      const styleElement = document.createElement("style");
      styleElement.textContent = markerStyles;
      document.head.appendChild(styleElement);

      map.current = L.map(mapContainer.current).setView(
        [42.5392, -113.7822],
        11
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map.current);

      // Listen for zoom changes to update marker sizes
      map.current.on("zoomend", () => {
        Object.keys(markersRef.current).forEach((markerId) => {
          updateMarkerIcon(markersRef.current[markerId]!, markerId);
        });
      });
    }

    return () => {
      // Cleanup is handled elsewhere to keep map state
    };
  }, []);

  // Fetch all user locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data: UserLocation[] = await apiRequest(
        `/api/location/all?date=${selectedDate}`,
        "GET"
      );
      locationsRef.current = data;
      setUserLocations(data);
      setLastUpdate(new Date());
      updateMarkers(data);
      setError(null);
      setShowError(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch locations"
      );
      setShowError(true);
      console.error("Error fetching locations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update map markers
  const updateMarkers = (locations: UserLocation[]) => {
    if (!map.current) return;

    const currentMarkerIds = new Set<string>();
    const clusters = findClusters(locations);
    const clusteredUserIds = new Set<string>();

    // Collect all user IDs that are part of a cluster
    clusters.forEach((cluster) => {
      cluster.forEach((user) => {
        clusteredUserIds.add(user.userId);
      });
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
      const isFocused = focusedId === `cluster_${clusterId}`;
      const baseSize = isFocused ? 40 : 10;
      const iconSize = Math.max(baseSize, baseSize + zoom * 2);

      const clusterDiv = document.createElement("div");
      clusterDiv.className = "cluster-icon";
      clusterDiv.style.width = `${iconSize}px`;
      clusterDiv.style.height = `${iconSize}px`;
      clusterDiv.style.fontSize = `${Math.max(12, zoom)}px`;
      clusterDiv.innerHTML = `${cluster.length}`;

      const clusterIcon = L.divIcon({
        html: clusterDiv.outerHTML,
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2],
        popupAnchor: [0, -(iconSize / 2)],
        className: "cluster-wrapper",
      });

      const clusterMarker = L.marker([avgLat, avgLng], { icon: clusterIcon });

      clusterMarker.on("click", (e: L.LeafletEvent) => {
        L.DomEvent.stopPropagation(e);
        // If clicking the same cluster, shrink it and close sidebar
        if (focusedClusterIdRef.current === `cluster_${clusterId}`) {
          setFocusedId(null);
          setSidebarOpen(false);
        } else {
          // If clicking a different cluster, set new focus and open sidebar
          setFocusedId(`cluster_${clusterId}`);
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
      // Skip if user is part of a cluster
      if (clusteredUserIds.has(userLocation.userId)) return;

      const markerId = userLocation.userId;
      currentMarkerIds.add(markerId);

      const { lat, lng } = userLocation.location.coords;
      const zoom = map.current?.getZoom() || 11;
      const isFocused = focusedId === `marker_${markerId}`;
      const baseSize = isFocused ? 50 : 30;
      const iconSize = Math.max(baseSize, baseSize + zoom * 2);

      if (markersRef.current[markerId]) {
        markersRef.current[markerId].setLatLng([lat, lng]);
        updateMarkerIcon(markersRef.current[markerId]!, markerId);
      } else {
        const marker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl:
              userLocation.profilePicture ||
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [iconSize, iconSize],
            iconAnchor: [iconSize / 2, iconSize / 2],
            popupAnchor: [0, -(iconSize / 2)],
            shadowSize: [iconSize, iconSize],
            className: "rounded-full",
          }),
        });

        marker.on("click", (e: L.LeafletEvent) => {
          // Stop propagation to prevent map click handler from firing
          L.DomEvent.stopPropagation(e);

          // If clicking the same marker, shrink it (clear focus) and close sidebar
          if (focusedMarkerIdRef.current === `marker_${markerId}`) {
            setFocusedId(null);
            setSidebarOpen(false);
          } else {
            // If clicking a different marker, set new focus and open sidebar
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
      if (!currentMarkerIds.has(markerId) && !clusteredUserIds.has(markerId)) {
        if (map.current) {
          map.current.removeLayer(markersRef.current[markerId]);
        }
        delete markersRef.current[markerId];
      }
    });

    // Clean up old cluster markers
    Object.keys(clusterMarkersRef.current).forEach((clusterId) => {
      if (!clusterId.startsWith("cluster_") || clusters.length === 0) {
        if (map.current) {
          map.current.removeLayer(clusterMarkersRef.current[clusterId]);
        }
        delete clusterMarkersRef.current[clusterId];
      }
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchLocations();
  }, [selectedDate]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchLocations, 300000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  // Update marker sizes when focus changes
  useEffect(() => {
    focusedMarkerIdRef.current = focusedId?.startsWith("marker_")
      ? focusedId
      : null;
    Object.keys(markersRef.current).forEach((markerId) => {
      updateMarkerIcon(markersRef.current[markerId]!, markerId);
    });
  }, [focusedId]);

  // Update cluster sizes when focus changes
  useEffect(() => {
    focusedClusterIdRef.current = focusedId?.startsWith("cluster_")
      ? focusedId
      : null;
    Object.keys(clusterMarkersRef.current).forEach((clusterId) => {
      const count = clusterCountRef.current[clusterId] || 2;
      updateClusterIcon(
        count,
        clusterId,
        clusterMarkersRef.current[clusterId]!
      );
    });
  }, [focusedId]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Live Location Map
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Showing {userLocations.length} active users
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={fetchLocations}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
              >
                {loading ? "Refreshing..." : "Refresh Now"}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && showError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 flex justify-between items-center z-30">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setShowError(false)}
            className="text-red-700 hover:text-red-900 font-semibold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map Container */}
        <div
          ref={mapContainer}
          className="flex-1 min-h-0 z-30"
          style={{ height: "calc(100vh - 150px)" }}
        />

        {/* Sidebar */}
        {sidebarOpen && selectedCluster && (
          <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col overflow-hidden z-20">
            {/* Sidebar Header - Only show if more than 1 user */}
            {selectedCluster.length > 1 && (
              <div className="bg-indigo-600 h-8 px-4 text-white flex justify-between items-center">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <UsersRound size={16} />
                  Group ({selectedCluster.length})
                </h2>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    setFocusedId(null);
                    setPathHistoryUserId(null);
                    setHistoryStats(null);
                    showAllMarkers();
                  }}
                  className="text-white hover:bg-indigo-700 rounded p-0.5 transition text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedCluster.map((user, index) => {
                const timestamp = new Date(user.location.ts);
                const timeString = timestamp.toLocaleTimeString();
                return (
                  <div
                    key={user.userId}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition"
                  >
                    {/* Profile Picture */}
                    {user.profilePicture && (
                      <img
                        src={user.profilePicture}
                        alt={user.userName}
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-blue-300"
                      />
                    )}

                    {/* User Info */}
                    <h3 className="font-semibold text-center text-gray-900">
                      {user.userName || user.userId}
                    </h3>

                    {user.phoneNumber && (
                      <p className="text-sm text-gray-600 text-center mb-2">
                        📞 {user.phoneNumber}
                      </p>
                    )}

                    {/* Coordinates */}
                    <div className="bg-white rounded p-2 mb-2 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Latitude:</span>
                        <span className="font-mono text-gray-900">
                          {user.location.coords.lat.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Longitude:</span>
                        <span className="font-mono text-gray-900">
                          {user.location.coords.lng.toFixed(6)}
                        </span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-gray-500 text-center mb-3">
                      🕐 {timeString}
                    </p>

                    {/* User History Button */}
                    <button
                      onClick={() => displayUserHistory(user.userId)}
                      disabled={loadingHistory}
                      className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                        pathHistoryUserId === user.userId
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loadingHistory
                        ? "Loading History..."
                        : pathHistoryUserId === user.userId
                        ? "Hide History"
                        : "Show History"}
                    </button>

                    {/* History Stats - Show when history is active for this user */}
                    {pathHistoryUserId === user.userId && historyStats && (
                      <div className="mt-3 bg-blue-50 rounded p-3 border border-blue-200">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-700">
                            <strong>Location Checks:</strong>{" "}
                            {historyStats.count}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-700">
                            <strong>Avg Accuracy:</strong>{" "}
                            {historyStats.avgAccuracy} m
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-3">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setFocusedId(null);
                  setPathHistoryUserId(null);
                  setHistoryStats(null);
                  showAllMarkers();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-400 rounded-full border-2 border-blue-600"></div>
            <span>Individual User</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
              2+
            </div>
            <span>Group</span>
          </div>
          <span>• Auto-refreshes every 5 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
