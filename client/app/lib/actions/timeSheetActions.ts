"use client";

import { apiRequest } from "../utils/api-Utils";

//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------   General   CRUD  ---------------------------------------------------------------

export async function handleGeneralTimeSheet({
  date,
  jobsiteId,
  workType,
  userId,
  costCode,
  startTime,
  clockInLat,
  clockInLong,
  type,
  previousTimeSheetId,
  endTime,
  previoustimeSheetComments,
  clockOutLat,
  clockOutLong,
}: {
  date: string;
  jobsiteId: string;
  workType: string;
  userId: string;
  costCode: string;
  startTime: string;
  clockInLat?: number | null;
  clockInLong?: number | null;
  type?: string;
  previousTimeSheetId?: number;
  endTime?: string;
  previoustimeSheetComments?: string;
  clockOutLat?: number | null;
  clockOutLong?: number | null;
}) {
  const body: Record<string, any> = {
    date,
    jobsiteId,
    workType,
    userId,
    costCode,
    startTime,
    clockInLat,
    clockInLong,
  };

  // Only include switchJobs fields if type === "switchJobs"
  if (type === "switchJobs") {
    body.type = type;
    body.previousTimeSheetId = previousTimeSheetId;
    body.endTime = endTime;
    body.previoustimeSheetComments = previoustimeSheetComments;
    body.clockOutLat = clockOutLat;
    body.clockOutLong = clockOutLong;
  }

  // If you want to always send optional fields, you can remove the above if and just include all fields

  return apiRequest("/api/v1/timesheet/create", "POST", body);
}

export async function handleMechanicTimeSheet({
  date,
  jobsiteId,
  workType,
  userId,
  costCode,
  startTime,
  clockInLat,
  clockInLong,
  type,
  previousTimeSheetId,
  endTime,
  previoustimeSheetComments,
  clockOutLat,
  clockOutLong,
}: {
  date: string;
  jobsiteId: string;
  workType: string;
  userId: string;
  costCode: string;
  startTime: string;
  clockInLat?: number | null;
  clockInLong?: number | null;
  type?: string;
  previousTimeSheetId?: number;
  endTime?: string;
  previoustimeSheetComments?: string;
  clockOutLat?: number | null;
  clockOutLong?: number | null;
}) {
  const body: Record<string, string | number | null | undefined> = {
    date,
    jobsiteId,
    workType,
    userId,
    costCode,
    startTime,
    clockInLat,
    clockInLong,
  };

  // Only include switchJobs fields if type === "switchJobs"
  if (type === "switchJobs") {
    body.type = type;
    body.previousTimeSheetId = previousTimeSheetId;
    body.endTime = endTime;
    body.previoustimeSheetComments = previoustimeSheetComments;
    body.clockOutLat = clockOutLat;
    body.clockOutLong = clockOutLong;
  }

  // If you want to always send optional fields, you can remove the above if and just include all fields

  return apiRequest("/api/v1/timesheet/create", "POST", body);
}

export async function handleTascoTimeSheet({
  date,
  jobsiteId,
  workType,
  userId,
  costCode,
  startTime,
  clockInLat,
  clockInLong,
  type,
  previousTimeSheetId,
  endTime,
  previoustimeSheetComments,
  clockOutLat,
  clockOutLong,
  shiftType,
  laborType,
  equipmentId,
  materialType,
}: {
  date: string;
  jobsiteId: string;
  workType: string;
  userId: string;
  costCode: string;
  startTime: string;
  clockInLat?: number | null;
  clockInLong?: number | null;
  type?: string;
  previousTimeSheetId?: number;
  endTime?: string;
  previoustimeSheetComments?: string;
  clockOutLat?: number | null;
  clockOutLong?: number | null;
  shiftType?: string;
  laborType?: string;
  equipmentId?: string;
  materialType?: string;
}) {
  const body: Record<string, string | number | null | undefined> = {
    date,
    jobsiteId,
    workType,
    userId,
    costCode,
    startTime,
    clockInLat,
    clockInLong,
    shiftType,
    laborType,
    equipmentId,
    materialType,
  };

  // Only include switchJobs fields if type === "switchJobs"
  if (type === "switchJobs") {
    body.type = type;
    body.previousTimeSheetId = previousTimeSheetId;
    body.endTime = endTime;
    body.previoustimeSheetComments = previoustimeSheetComments;
    body.clockOutLat = clockOutLat;
    body.clockOutLong = clockOutLong;
  }

  // If you want to always send optional fields, you can remove the above if and just include all fields

  return apiRequest("/api/v1/timesheet/create", "POST", body);
}

export async function handleTruckTimeSheet({
  date,
  jobsiteId,
  workType,
  userId,
  costCode,
  startTime,
  clockInLat,
  clockInLong,
  type,
  previousTimeSheetId,
  endTime,
  previoustimeSheetComments,
  clockOutLat,
  clockOutLong,
  startingMileage,
  laborType,
  truck,
  equipmentId,
}: {
  date: string;
  jobsiteId: string;
  workType: string;
  userId: string;
  costCode: string;
  startTime: string;
  clockInLat?: number | null;
  clockInLong?: number | null;
  type?: string;
  previousTimeSheetId?: number;
  endTime?: string;
  previoustimeSheetComments?: string;
  clockOutLat?: number | null;
  clockOutLong?: number | null;
  startingMileage: number;
  laborType: string;
  truck: string;
  equipmentId?: string;
}) {
  const body: Record<string, string | number | null | undefined> = {
    date,
    jobsiteId,
    workType,
    userId,
    costCode,
    startTime,
    clockInLat,
    clockInLong,
    startingMileage,
    laborType,
    truck,
    equipmentId,
  };

  // Only include switchJobs fields if type === "switchJobs"
  if (type === "switchJobs") {
    body.type = type;
    body.previousTimeSheetId = previousTimeSheetId;
    body.endTime = endTime;
    body.previoustimeSheetComments = previoustimeSheetComments;
    body.clockOutLat = clockOutLat;
    body.clockOutLong = clockOutLong;
  }

  // If you want to always send optional fields, you can remove the above if and just include all fields

  return apiRequest("/api/v1/timesheet/create", "POST", body);
}

export async function ClockOutComment({ userId }: { userId: string }) {
  try {
    const response = await apiRequest(
      `/api/v1/timesheet/user/${userId}/clockOutComment`,
      "GET"
    );

    if (response.success && response.data) {
      return response.data || "";
    }
    return "";
  } catch (error) {
    console.error("Error fetching clock out comment:", error);
    return "";
  }
}
