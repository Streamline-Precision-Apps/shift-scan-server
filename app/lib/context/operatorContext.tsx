"use client";
import { setEquipment } from "@/app/lib/actions/cookieActions";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { apiRequest } from "../utils/api-Utils";

type EquipmentIdProps = {
  equipmentId: string | null;
  setEquipmentId: (equipmentId: string | null | Record<string, any>) => void;
};

const EquipmentData = createContext<EquipmentIdProps | undefined>(undefined);

export const EquipmentIdProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [equipmentId, setEquipmentIdState] = useState<string | null>(null);

  // Load initial state from localStorage if available
  useEffect(() => {
    const initializeEquipment = async () => {
      let previousTruck;
      try {
        // Fetch cookie data once during initialization
        previousTruck = await apiRequest("/api/cookies?name=equipment", "GET");
      } catch (error) {
        // Only log the error, do not set state or retry
        console.error("Error fetching job site cookie:", error);
        return;
      }
      if (previousTruck && previousTruck !== "") {
        // Ensure we only store the string value, not an object
        const value = typeof previousTruck === "string" ? previousTruck : "";
        setEquipmentIdState(value);
      }
    };
    initializeEquipment();
  }, []); // Run only on mount

  useEffect(() => {
    const saveEquipmentId = async () => {
      // Renamed function
      try {
        if (equipmentId && equipmentId !== "") {
          // Extract just the string value if an object was passed
          let valueToSave = equipmentId;
          if (typeof equipmentId === "object") {
            // If it's an object with id or code, use that
            valueToSave =
              (equipmentId as any).id || (equipmentId as any).code || "";
          }
          await setEquipment(valueToSave); // Set the cookie if equipmentId changes
        }
      } catch (error) {
        console.error("Error saving equipment cookie:", error);
      }
    };
    saveEquipmentId();
  }, [equipmentId]);

  // Wrapper function to handle both string and object inputs
  const setEquipmentId = (value: string | null | Record<string, any>) => {
    if (typeof value === "string" || value === null) {
      setEquipmentIdState(value);
    } else if (typeof value === "object") {
      // If an object is passed (like an Option), extract the id or code
      const extractedValue = value.id || value.code || "";
      setEquipmentIdState(extractedValue);
    }
  };

  return (
    <EquipmentData.Provider value={{ equipmentId, setEquipmentId }}>
      {children}
    </EquipmentData.Provider>
  );
};

export const useOperator = () => {
  const context = useContext(EquipmentData);
  if (!context) {
    throw new Error("useOperator must be used within a EquipmentIdProvider"); // Updated error message
  }
  return context;
};
