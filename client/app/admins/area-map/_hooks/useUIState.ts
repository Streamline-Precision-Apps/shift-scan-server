import { useState } from "react";
import { UserLocation } from "../_utils/clusteringUtils";

/**
 * Hook to manage UI state for sidebar and focus
 */
export const useUIState = () => {
  const [selectedCluster, setSelectedCluster] = useState<UserLocation[] | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const closeSidebar = () => {
    setSidebarOpen(false);
    setFocusedId(null);
  };

  return {
    selectedCluster,
    setSelectedCluster,
    sidebarOpen,
    setSidebarOpen,
    focusedId,
    setFocusedId,
    selectedDate,
    setSelectedDate,
    closeSidebar,
  };
};
