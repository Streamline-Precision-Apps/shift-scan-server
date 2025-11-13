import React from "react";

export const LocationMapLegend: React.FC = () => {
  return (
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
  );
};
