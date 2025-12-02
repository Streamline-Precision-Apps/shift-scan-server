import React from "react";

interface LocationMapHeaderProps {
  userLocationsCount: number;
  loading: boolean;
  lastUpdate: Date;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onRefresh: () => void;
}

export const LocationMapHeader: React.FC<LocationMapHeaderProps> = ({
  userLocationsCount,
  loading,
  lastUpdate,
  selectedDate,
  onDateChange,
  onRefresh,
}) => {
  return (
    <div className="bg-white-10 border-b border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Location Map</h1>
          <p className="text-sm text-white mt-1">
            Showing {userLocationsCount} active users
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-4 py-2 bg-app-blue text-gray-900 rounded-lg  disabled:bg-gray-400 transition-colors text-sm font-medium"
            >
              {loading ? "Refreshing..." : "Refresh Now"}
            </button>
          </div>
          <p className="text-xs text-white">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};
