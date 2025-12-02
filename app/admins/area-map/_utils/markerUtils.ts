import L from "leaflet";

/**
 * Marker styling CSS
 */
export const markerStyles = `
  .leaflet-marker-icon {
    border-radius: 50% !important;
    object-fit: cover;
    border: 3px solid var(--color-app-dark-blue, #1e3a5f) !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
    box-sizing: border-box !important;
    background-color: #e5e7eb !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
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
    background-color: #84cfef;
    border-radius: 50%;
    color: #1e3a5f;
    font-weight: bold;
    border: 3px solid var(--color-app-dark-blue, #1e3a5f);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
  }
  .user-marker-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-weight: bold;
    color: #6b7280;
    font-size: 18px;
  }
`;

/**
 * Create a user marker icon with fallback handling
 */
export const createUserMarkerIcon = (
  profilePicture: string | undefined,
  iconSize: number
): L.DivIcon => {
  // Create a container div for the icon
  const iconDiv = document.createElement("div");
  iconDiv.style.width = `${iconSize}px`;
  iconDiv.style.height = `${iconSize}px`;
  iconDiv.style.borderRadius = "50%";
  iconDiv.style.border = "3px solid #233861";
  iconDiv.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  iconDiv.style.boxSizing = "border-box";
  iconDiv.style.backgroundColor = "#e5e7eb";
  iconDiv.style.display = "flex";
  iconDiv.style.alignItems = "center";
  iconDiv.style.justifyContent = "center";
  iconDiv.style.overflow = "hidden";

  if (profilePicture) {
    // Create an image element
    const img = document.createElement("img");
    img.src = profilePicture;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.borderRadius = "50%";

    // Handle image load errors
    img.onerror = () => {
      img.style.display = "none";
      // Show fallback icon on error
      const fallback = document.createElement("div");
      fallback.className = "user-marker-fallback";
      fallback.innerHTML = "👤";
      iconDiv.appendChild(fallback);
    };

    img.onload = () => {
      // Image loaded successfully
    };

    iconDiv.appendChild(img);
  } else {
    // No profile picture, show fallback avatar icon
    const fallback = document.createElement("div");
    fallback.className = "user-marker-fallback";
    fallback.innerHTML = "👤";
    iconDiv.appendChild(fallback);
  }

  return L.divIcon({
    html: iconDiv.outerHTML,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
    popupAnchor: [0, -(iconSize / 2)],
    className: "user-marker-icon",
  });
};

/**
 * Create a cluster icon (div icon with count)
 */
export const createClusterIcon = (
  clusterCount: number,
  iconSize: number,
  fontSize: number
): L.DivIcon => {
  const clusterDiv = document.createElement("div");
  clusterDiv.className = "cluster-icon";
  clusterDiv.style.width = `${iconSize}px`;
  clusterDiv.style.height = `${iconSize}px`;
  clusterDiv.style.fontSize = `${fontSize}px`;
  clusterDiv.innerHTML = `${clusterCount}`;

  return L.divIcon({
    html: clusterDiv.outerHTML,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
    popupAnchor: [0, -(iconSize / 2)],
    className: "cluster-wrapper",
  });
};

/**
 * Calculate icon size based on zoom and focus state
 */
export const calculateIconSize = (
  zoom: number,
  isFocused: boolean,
  baseSize: number = 10
): number => {
  const focusedBase = baseSize;
  return Math.max(focusedBase, focusedBase + zoom * 2);
};
