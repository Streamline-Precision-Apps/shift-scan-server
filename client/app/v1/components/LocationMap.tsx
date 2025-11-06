"use client";

import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { apiRequest } from "@/app/lib/utils/api-Utils";

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
  location: Location;
}

const LocationMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = L.map(mapContainer.current).setView(
        [42.5392, -113.7822],
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 10,
      }).addTo(map.current);
    }

    return () => {
      // Cleanup is handled elsewhere to keep map state
    };
  }, []);

  // Fetch all user locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data: UserLocation[] = await apiRequest("/api/location/all", "GET");
      console.log(data);
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

    locations.forEach((userLocation) => {
      const markerId = userLocation.userId;
      currentMarkerIds.add(markerId);

      const { lat, lng } = userLocation.location.coords;
      const timestamp = new Date(userLocation.location.ts);
      const timeString = timestamp.toLocaleTimeString();

      if (markersRef.current[markerId]) {
        // Update existing marker
        markersRef.current[markerId].setLatLng([lat, lng]);
        const popup = markersRef.current[markerId].getPopup();
        if (popup) {
          popup.setContent(
            `<div class="text-sm font-semibold">${
              userLocation.userName || userLocation.userId
            }</div>
             <div class="text-xs text-gray-600">Lat: ${lat.toFixed(4)}</div>
             <div class="text-xs text-gray-600">Lng: ${lng.toFixed(4)}</div>
             <div class="text-xs text-gray-600">Time: ${timeString}</div>`
          );
        }
      } else {
        // Create new marker
        const marker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        }).bindPopup(
          `<div class="text-sm font-semibold">${
            userLocation.userName || userLocation.userId
          }</div>
             <div class="text-xs text-gray-600">Lat: ${lat.toFixed(4)}</div>
             <div class="text-xs text-gray-600">Lng: ${lng.toFixed(4)}</div>
             <div class="text-xs text-gray-600">Time: ${timeString}</div>`
        );

        if (map.current) {
          marker.addTo(map.current);
        }

        markersRef.current[markerId] = marker;
      }
    });

    // Remove markers for users no longer in the list
    Object.keys(markersRef.current).forEach((markerId) => {
      if (!currentMarkerIds.has(markerId)) {
        if (map.current) {
          map.current.removeLayer(markersRef.current[markerId]);
        }
        delete markersRef.current[markerId];
      }
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchLocations();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchLocations, 300000);
    return () => clearInterval(interval);
  }, []);

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
            <button
              onClick={fetchLocations}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
            >
              {loading ? "Refreshing..." : "Refresh Now"}
            </button>
            <p className="text-xs text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && showError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 flex justify-between items-center">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setShowError(false)}
            className="text-red-700 hover:text-red-900 font-semibold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="flex-1 min-h-0"
        style={{ height: "calc(100vh - 150px)" }}
      />

      {/* Legend */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-6 bg-blue-400 rounded-full border border-blue-600"></div>
          <span>User Location • Auto-refreshes every 5 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
