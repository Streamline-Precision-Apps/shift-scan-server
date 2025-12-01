import React, { useState, useEffect } from "react";
import { UsersRound, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/app/v1/components/ui/tooltip";
import { UserLocation } from "../_utils/clusteringUtils";
import {
  getAddressFromCoordinates,
  AddressResult,
} from "../_utils/locationUtils";
import { formatPhoneNumber } from "@/app/lib/utils/phoneNumberFormatter";
import { apiRequest } from "@/app/lib/utils/api-Utils";

interface LocationMapSidebarProps {
  selectedCluster: UserLocation[];
  pathHistoryUserId: string | null;
  loadingHistoryUserId: string | null;
  historyStats: { count: number; avgAccuracy: number } | null;
  onUserHistoryClick: (userId: string) => void;
  onCloseHistory: () => void;
  onClose: () => void;
  selectedDate: string;
}

export const LocationMapSidebar: React.FC<LocationMapSidebarProps> = ({
  selectedCluster,
  pathHistoryUserId,
  loadingHistoryUserId,
  historyStats,
  onUserHistoryClick,
  onCloseHistory,
  onClose,
  selectedDate,
}) => {
  const [usersWithHistory, setUsersWithHistory] = useState<Set<string>>(
    new Set()
  );
  const [checkingHistory, setCheckingHistory] = useState<Set<string>>(
    new Set()
  );

  // Check which users have history
  useEffect(() => {
    selectedCluster.forEach((user) => {
      if (
        !usersWithHistory.has(user.userId) &&
        !checkingHistory.has(user.userId)
      ) {
        const checkHistory = async () => {
          setCheckingHistory((prev) => new Set([...prev, user.userId]));
          try {
            const historyData = await apiRequest(
              `/api/location/${user.userId}/history?date=${selectedDate}`,
              "GET"
            );
            if (
              historyData &&
              Array.isArray(historyData) &&
              historyData.length > 0
            ) {
              setUsersWithHistory((prev) => new Set([...prev, user.userId]));
            }
          } catch (error) {
            // User has no history
          } finally {
            setCheckingHistory((prev) => {
              const updated = new Set(prev);
              updated.delete(user.userId);
              return updated;
            });
          }
        };
        checkHistory();
      }
    });
  }, [selectedCluster, selectedDate, usersWithHistory, checkingHistory]);
  return (
    <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col overflow-hidden z-20">
      {/* Sidebar Header - Only show if more than 1 user */}
      {selectedCluster.length > 1 && (
        <div className="bg-app-blue h-8 px-4 text-gray-900 flex justify-between items-center">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <UsersRound size={16} />
            Group ({selectedCluster.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-900  rounded p-0.5 transition text-lg leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedCluster
          .sort((a, b) => {
            // Online users (no endTime) first, then offline users
            if (!a.endTime && b.endTime) return -1;
            if (a.endTime && !b.endTime) return 1;
            return 0;
          })
          .map((user) => {
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
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-cyan-300 hover:shadow-md transition-all relative"
              >
                <div className="">
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
                  <div className="absolute top-2 right-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-3 h-3 rounded-full cursor-pointer ${
                            user.endTime ? "bg-gray-400" : "bg-green-500"
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {user.endTime ? "Offline" : "Online"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-base pt-1 text-gray-600 text-center">
                    {formatPhoneNumber(user.phoneNumber)}
                  </p>
                </div>

                {/* User History Button */}
                {usersWithHistory.has(user.userId) && (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <button
                      onClick={() =>
                        pathHistoryUserId === user.userId
                          ? onCloseHistory()
                          : onUserHistoryClick(user.userId)
                      }
                      disabled={loadingHistoryUserId === user.userId}
                      className={`w-full py-1.5 px-3 rounded-lg font-medium text-sm transition-all ${
                        pathHistoryUserId === user.userId
                          ? "bg-app-blue text-gray-900  shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loadingHistoryUserId === user.userId
                        ? "Loading History..."
                        : pathHistoryUserId === user.userId
                        ? "Hide History"
                        : "Show History"}
                    </button>
                  </div>
                )}

                {/* History Stats - Show when history is active for this user */}
                {pathHistoryUserId === user.userId && historyStats && (
                  <div className="mt-3 bg-linear-to-r from-app-blue to-blue-100 rounded-lg p-3 border border-cyan-300">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700">
                        <strong>Location Checks:</strong>
                      </span>
                      <span className="text-cyan-700 font-semibold">
                        {historyStats.count}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <span className="text-gray-700">
                        <strong>Avg Accuracy:</strong>
                      </span>
                      <span className="text-cyan-700 font-semibold">
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
          className="w-full bg-app-blue  text-gray-900 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};
