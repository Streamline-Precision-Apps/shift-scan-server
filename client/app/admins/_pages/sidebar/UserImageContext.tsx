"use client";
import { useUserStore } from "@/app/lib/store/userStore";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  Suspense,
} from "react";

interface UserProfileContextType {
  image: string | null;
  name: string;
  role: string;
  refresh: () => Promise<void>;
  setImage: (img: string | null) => void;
  loading: boolean;
}

// Create a cache for the user image promise
let imageCache: Promise<string | null> | null = null;
let imageData: string | null = null;

// Function to fetch user image data
const fetchUserImage = async (): Promise<string | null> => {
  if (imageData !== null) return imageData;

  if (!imageCache) {
    imageCache = fetch("/api/getUserImage")
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to fetch profile picture");
        const data = await response.json();
        imageData = data.image || null;
        return imageData;
      })
      .catch((error) => {
        console.error("Error fetching profile picture:", error);
        imageData = null;
        return null;
      });
  }

  return imageCache;
};

// Main UserImage component using user.image from store
export const UserImage: React.FC<{
  className?: string;
  alt?: string;
}> = ({ className, alt = "profile" }) => {
  const { user } = useUserStore();
  const imageUrl = user?.image || "/profileEmpty.svg";
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = "/profileEmpty.svg";
      }}
    />
  );
};

// Component that uses Suspense for async name loading
const AsyncUserName: React.FC<{
  onDataLoad: (data: { name: string; role: string }) => void;
  className?: string;
  maxLength?: number;
}> = ({ onDataLoad, className = "", maxLength = 12 }) => {
  const { user } = useUserStore();
  const [displayName, setDisplayName] = useState<string>("");

  React.useEffect(() => {
    if (user) {
      const name =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName.slice(0, 1)}`
          : "";
      const role = user.permission || "";

      setDisplayName(name);
      onDataLoad({ name, role });
    }
  }, [user, onDataLoad]);

  const truncatedName =
    displayName.length >= maxLength
      ? displayName.slice(0, maxLength) + "..."
      : displayName;

  return (
    <div className={`justify-start text-black text-xs font-bold ${className}`}>
      {truncatedName}
    </div>
  );
};

// Component that uses Suspense for async role loading
const AsyncUserRole: React.FC<{
  onDataLoad: (data: { name: string; role: string }) => void;
  className?: string;
}> = ({ onDataLoad, className = "" }) => {
  const { user } = useUserStore();
  const [displayRole, setDisplayRole] = useState<string>("");

  React.useEffect(() => {
    if (user) {
      const name =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName.slice(0, 1)}`
          : "";
      const role = user.permission || "";

      setDisplayRole(role);
      onDataLoad({ name, role });
    }
  }, [user, onDataLoad]);

  return (
    <div
      className={`text-center justify-start text-neutral-400 text-[10px] font-normal ${className}`}
    >
      {displayRole}
    </div>
  );
};

// Fallback components for Suspense
const UserNameFallback: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div className={`justify-start text-black text-xs font-bold ${className}`}>
    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

const UserRoleFallback: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`text-center justify-start text-neutral-400 text-[10px] font-normal ${className}`}
  >
    <div className="h-2 w-16 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

// Main UserName component with Suspense boundary
export const UserName: React.FC<{
  onDataLoad?: (data: { name: string; role: string }) => void;
  className?: string;
  maxLength?: number;
}> = ({ onDataLoad = () => {}, className, maxLength }) => (
  <Suspense fallback={<UserNameFallback className={className} />}>
    <AsyncUserName
      onDataLoad={onDataLoad}
      className={className}
      maxLength={maxLength}
    />
  </Suspense>
);

// Main UserRole component with Suspense boundary
export const UserRole: React.FC<{
  onDataLoad?: (data: { name: string; role: string }) => void;
  className?: string;
}> = ({ onDataLoad = () => {}, className }) => (
  <Suspense fallback={<UserRoleFallback className={className} />}>
    <AsyncUserRole onDataLoad={onDataLoad} className={className} />
  </Suspense>
);

// UserProfileProvider is not needed if you use useUserStore directly everywhere.
