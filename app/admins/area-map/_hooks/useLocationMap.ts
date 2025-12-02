import { useEffect, useRef } from "react";
import L from "leaflet";
import { markerStyles } from "../_utils/markerUtils";

/**
 * Hook to initialize and manage the Leaflet map instance
 */
export const useLocationMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

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
    }

    return () => {
      // Cleanup is handled elsewhere to keep map state
    };
  }, []);

  return { mapContainer, map };
};
