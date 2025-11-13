import React from "react";

interface ErrorBannerProps {
  error: string;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onDismiss }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 flex justify-between items-center z-30">
      <p className="text-red-700 text-sm">{error}</p>
      <button
        onClick={onDismiss}
        className="text-red-700 hover:text-red-900 font-semibold ml-4"
      >
        ✕
      </button>
    </div>
  );
};
