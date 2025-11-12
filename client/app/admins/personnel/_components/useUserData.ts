"use client";
import { useState, useEffect } from "react";
import { apiRequest } from "@/app/lib/utils/api-Utils";

export type userInfo = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  secondLastName: string | null;
  username: string;
  DOB: string | null;
  image: string | null;
  email: string | null;
  terminationDate: string | null;
  truckView: boolean;
  tascoView: boolean;
  mechanicView: boolean;
  laborView: boolean;
  permission: string;
  startDate: string | null;
  Contact: {
    phoneNumber: string | null;
    emergencyContact: string | null;
    emergencyContactNumber: string | null;
  };
  Crews: { id: string; name: string; leadId: string }[];
};

export interface CrewData {
  id: string;
  name: string;
  leadId: string;
  crewType: "MECHANIC" | "TRUCK_DRIVER" | "LABOR" | "TASCO" | "";
  Users: { id: string; firstName: string; lastName: string }[];
}

export const useUserData = ({ userid }: { userid: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [crew, setCrew] = useState<CrewData[]>([]);
  const [userData, setUserData] = useState<userInfo>({} as userInfo);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(
          `/api/v1/admins/personnel/getEmployeeInfo/${userid}`,
          "GET"
        );
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch personnel details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userid]);

  useEffect(() => {
    const fetchCrews = async () => {
      try {
        const data = await apiRequest(
          "/api/v1/admins/personnel/getAllCrews",
          "GET"
        );
        setCrew(data || []);
      } catch (error) {
        console.error("Failed to fetch crews:", error);
      }
    };
    fetchCrews();
  }, []);

  return {
    userData,
    setUserData,
    loading,
    crew,
    setCrew,
  };
};
