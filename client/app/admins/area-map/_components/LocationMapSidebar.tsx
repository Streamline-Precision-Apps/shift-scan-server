import React, { useState, useEffect } from "react";
import { UsersRound, ExternalLink } from "lucide-react";
import { UserLocation } from "../_utils/clusteringUtils";
import {
  getAddressFromCoordinates,
  AddressResult,
} from "../_utils/locationUtils";
import { formatPhoneNumber } from "@/app/lib/utils/phoneNumberFormatter";

interface LocationMapSidebarProps {
  selectedCluster: UserLocation[];
  pathHistoryUserId: string | null;
  loadingHistory: boolean;
  historyStats: { count: number; avgAccuracy: number } | null;
  onUserHistoryClick: (userId: string) => void;
  onClose: () => void;
}

export const LocationMapSidebar: React.FC<LocationMapSidebarProps> = ({
  selectedCluster,
  pathHistoryUserId,
  loadingHistory,
  historyStats,
  onUserHistoryClick,
  onClose,
}) => {
  const [addresses, setAddresses] = useState<Map<string, AddressResult | null>>(
    new Map()
  );
  const [loadingAddresses, setLoadingAddresses] = useState<Set<string>>(
    new Set()
  );

  // Fetch addresses for users in the cluster
  useEffect(() => {
    selectedCluster.forEach((user) => {
      if (!addresses.has(user.userId)) {
        const fetchAddress = async () => {
          setLoadingAddresses((prev) => new Set([...prev, user.userId]));
          const address = await getAddressFromCoordinates(
            user.location.coords.lat,
            user.location.coords.lng
          );
          setAddresses((prev) => new Map([...prev, [user.userId, address]]));
          setLoadingAddresses((prev) => {
            const updated = new Set(prev);
            updated.delete(user.userId);
            return updated;
          });
        };
        fetchAddress();
      }
    });
  }, [selectedCluster, addresses]);
  return (
    <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col overflow-hidden z-20">
      {/* Sidebar Header - Only show if more than 1 user */}
      {selectedCluster.length > 1 && (
        <div className="bg-indigo-600 h-8 px-4 text-white flex justify-between items-center">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <UsersRound size={16} />
            Group ({selectedCluster.length})
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-indigo-700 rounded p-0.5 transition text-lg leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedCluster.map((user) => {
          const timestamp = new Date(user.location.ts);
          const timeString = timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          const dateString = timestamp.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return (
            <div
              key={user.userId}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="mb-10 border-b border-gray-200 pb-2">
                {/* Profile Picture */}
                {user.profilePicture && (
                  <img
                    src={user.profilePicture}
                    alt={user.userName}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-blue-300"
                  />
                )}

                {/* User Info */}
                <h3 className="font-semibold text-center text-base text-gray-900">
                  {user.userName || user.userId}
                </h3>
                <p className="text-base py-1 text-gray-600 text-center">
                  {formatPhoneNumber(user.phoneNumber)}
                </p>
              </div>
              {/* Activity online */}
              <div className="mb-3">
                {user.endTime ? (
                  <p className="text-sm text-red-600 font-semibold text-center">
                    Inactive since {new Date(user.endTime).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-sm text-green-600 font-semibold text-center">
                    Active Now
                  </p>
                )}
              </div>

              {/* Timestamp */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                  Last Updated
                </p>
                <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⏱️</span>
                    <div className="flex flex-col justify-center">
                      <p className="text-sm text-gray-800 font-semibold leading-snug">
                        {timeString}
                      </p>
                      <p className="text-xs text-gray-600 leading-snug">
                        {dateString}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                  Current Location
                </p>
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                  {loadingAddresses.has(user.userId) ? (
                    <p className="text-sm text-gray-400">Loading address...</p>
                  ) : addresses.get(user.userId)?.fullAddress ? (
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-800 font-medium leading-tight flex-1">
                        {addresses.get(user.userId)?.fullAddress}
                      </p>
                      <button
                        onClick={() => {
                          const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(
                            addresses.get(user.userId)?.fullAddress || ""
                          )}`;
                          window.open(mapUrl, "_blank");
                        }}
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-blue-100 p-2 rounded transition shrink-0"
                        title="Open in Google Maps"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Address not available
                    </p>
                  )}
                </div>
              </div>
              {/* User History Button */}
              <button
                onClick={() => onUserHistoryClick(user.userId)}
                disabled={loadingHistory}
                className={`w-full py-2.5 px-3 rounded-lg font-medium text-sm transition-all ${
                  pathHistoryUserId === user.userId
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                <div className="mt-3 bg-linear-to-r from-indigo-50 to-blue-50 rounded-lg p-3 border border-indigo-200">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">
                      <strong>Location Checks:</strong>
                    </span>
                    <span className="text-indigo-700 font-semibold">
                      {historyStats.count}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-gray-700">
                      <strong>Avg Accuracy:</strong>
                    </span>
                    <span className="text-indigo-700 font-semibold">
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
      <div className="bg-linear-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-3">
        <button
          onClick={onClose}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};
