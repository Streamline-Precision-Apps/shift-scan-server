// This is used to store the state of costcode.

"use client";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { setCostCode as setCostCodeCookie } from "@/app/lib/actions/cookieActions";
import { apiRequest } from "../utils/api-Utils";
// creates a prop to be passes to a context
type SavedCostCodeProps = {
  savedCostCode: string | null;
  setCostCode: (costCode: string | null) => void;
};
// creates a value to a savedCostCode context
type savedCostCode = {
  savedCostCode: string;
};
// creates a context for the savedCostCode we pass this through the export
const savedCostCode = createContext<SavedCostCodeProps | undefined>(undefined);

export const SavedCostCodeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // creates a state for the savedCostCode
  const [costcode, setCostCode] = useState<string | null>(null);

  useEffect(() => {
    const initializeCostCode = async () => {
      try {
        // Fetch cookie data once during initialization
        const res = await apiRequest("/api/cookies?name=costCode", "GET");

        // Only parse JSON if response is ok (not 404 or other errors)
        if (res.success) {
          const previousCostCode = await res.json();
          if (
            previousCostCode &&
            previousCostCode !== "" &&
            previousCostCode !== costcode
          ) {
            setCostCode(previousCostCode);
          }
        }
        // Silently handle 404 or other errors - just leave costCode as null
      } catch (error) {
        // Silently handle errors - costCode will remain as null
        console.debug("Cost code not found or error fetching:", error);
      }
    };

    initializeCostCode();
  }, []); // Run only on mount

  // when the provider is called it will return the value below
  useEffect(() => {
    const savedCostCode = async () => {
      try {
        if (costcode !== "") setCostCodeCookie(costcode || "");
      } catch (error) {
        console.error(error);
      }
    };
    savedCostCode();
  }, [costcode]);
  return (
    <savedCostCode.Provider value={{ savedCostCode: costcode, setCostCode }}>
      {children}
    </savedCostCode.Provider>
  );
};
// this is used to get the value of the savedCostCode
export const useSavedCostCode = () => {
  const context = useContext(savedCostCode);
  if (context === undefined) {
    throw new Error("useScanData must be used within a ScanDataProvider");
  }
  return context;
};
