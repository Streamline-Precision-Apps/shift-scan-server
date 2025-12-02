"use client";

import { apiRequest } from "../utils/api-Utils";

/**
 * Equipment Hauled Operations
 * Uses: /api/v1/trucking-logs/:id?field=equipmentHauled
 */

export async function createEquipmentHauled(formData: FormData) {
  const timeSheetId = formData.get("timeSheetId") as string;

  const response = await apiRequest(
    `/api/v1/trucking-logs/${timeSheetId}?field=equipmentHauled`,
    "POST"
  );

  return response.equipmentHauled;
}

export async function updateEquipmentLogsLocation(formData: FormData) {
  const equipmentHauledId = formData.get("id") as string;
  const truckingLogId = formData.get("truckingLogId") as string;

  const response = await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=equipmentHauled`,
    "PUT",
    {
      equipmentHauledId,
      // Note: jobSite validation now handled by backend
    }
  );

  return response;
}

export async function updateEquipmentLogs(formData: FormData) {
  const equipmentHauledId = formData.get("id") as string;
  const truckingLogId = formData.get("truckingLogId") as string;
  const source = formData.get("source") as string;
  const destination = formData.get("destination") as string;
  const startMileageStr = formData.get("startMileage") as string;
  const endMileageStr = formData.get("endMileage") as string;

  const startMileage =
    startMileageStr !== null && startMileageStr !== ""
      ? Number(startMileageStr)
      : null;
  const endMileage =
    endMileageStr !== null && endMileageStr !== ""
      ? Number(endMileageStr)
      : null;

  const response = await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=equipmentHauled`,
    "PUT",
    {
      equipmentHauledId,
      source,
      destination,
      startMileage,
      endMileage,
    }
  );

  return response;
}

export async function updateEquipmentLogsEquipment(formData: FormData) {
  const equipmentHauledId = formData.get("id") as string;
  const equipmentId = formData.get("equipmentId") as string;
  const truckingLogId = formData.get("truckingLogId") as string;

  const response = await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=equipmentHauled`,
    "PUT",
    {
      equipmentHauledId,
      equipmentId,
    }
  );

  return response;
}

export async function deleteEquipmentHauled(
  equipmentHauledId: string,
  truckingLogId: string
) {
  await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=equipmentHauled`,
    "DELETE",
    { resourceId: equipmentHauledId }
  );

  return true;
}

/**
 * Material Hauled Operations
 * Uses: /api/v1/trucking-logs/:id?field=material
 */

export async function createHaulingLogs(formData: FormData) {
  const truckingLogId = formData.get("truckingLogId") as string;
  const name = formData.get("name") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const LocationOfMaterial = formData.get("LocationOfMaterial") as string;
  const unit = formData.get("unit") as string;
  const loadType = formData.get("loadType") as string;

  if (!truckingLogId) {
    throw new Error("Trucking log ID is required");
  }

  const response = await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=material`,
    "POST",
    {
      name,
      quantity,
      LocationOfMaterial,
      unit,
      loadType: loadType || null, // Convert empty string to null
    }
  );

  return response.material;
}

export async function updateHaulingLogs(formData: FormData) {
  const id = formData.get("id") as string;
  const truckingLogId = formData.get("truckingLogId") as string;
  const name = formData.get("name") as string;
  const LocationOfMaterial = formData.get("LocationOfMaterial") as string;
  const quantity = Number(formData.get("quantity") as string);
  const loadTypeString = formData.get("loadType") as string;
  const unit = formData.get("unit") as string;

  // If ID is provided, update the existing log
  if (id) {
    const response = await apiRequest(
      `/api/v1/trucking-logs/${truckingLogId}?field=material`,
      "PUT",
      {
        materialId: id,
        name,
        LocationOfMaterial,
        quantity,
        unit,
        loadType: loadTypeString || null, // Convert empty string to null
      }
    );

    return response;
  }

  // If no ID, create a new log (shouldn't happen but kept for compatibility)
  const response = await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=material`,
    "POST",
    {
      name,
      LocationOfMaterial,
      quantity,
      unit,
      loadType: loadTypeString || null, // Convert empty string to null
    }
  );

  return response.material;
}

export async function deleteHaulingLogs(id: string, truckingLogId: string) {
  await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=material`,
    "DELETE",
    { resourceId: id }
  );

  return true;
}

/**
 * Mileage & Notes Operations
 * Uses: /api/v1/trucking-logs/:id?field=startingMileage|endingMileage|notes
 */

export const updateTruckingMileage = async (formData: FormData) => {
  const truckingLogId = formData.get("id") as string;
  const endingMileage = parseInt(formData.get("endingMileage") as string);

  const response = await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=endingMileage`,
    "PUT",
    { endingMileage }
  );

  return response;
};

export const updateTruckDrivingNotes = async (formData: FormData) => {
  const truckingLogId = formData.get("id") as string;
  const notes = (formData.get("comment") as string) || "";

  const response = await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=notes`,
    "PUT",
    { notes }
  );

  return response;
};

/**
 * State Mileage Operations
 * Uses: /api/v1/trucking-logs/:id?field=stateMileage
 */

export async function createStateMileage(formData: FormData) {
  const truckingLogId = formData.get("truckingLogId") as string;
  const state = formData.get("state") as string;
  const stateLineMileage = Number(formData.get("stateLineMileage")) || 0;

  if (!truckingLogId) {
    throw new Error("Trucking log ID is required");
  }

  const response = await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=stateMileage`,
    "POST",
    {
      state,
      stateLineMileage,
    }
  );

  return response.stateMileage;
}

export async function updateStateMileage(formData: FormData) {
  const stateMileageId = formData.get("id") as string;
  const truckingLogId = formData.get("truckingLogId") as string;
  const state = formData.get("state") as string;
  const stateLineMileage = Number(formData.get("stateLineMileage")) || 0;

  const response = await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=stateMileage`,
    "PUT",
    {
      stateMileageId,
      state,
      stateLineMileage,
    }
  );

  return response;
}

export async function deleteStateMileage(id: string, truckingLogId: string) {
  await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=stateMileage`,
    "DELETE",
    { resourceId: id }
  );

  return true;
}

/**
 * Refuel Log Operations
 * Uses: /api/v1/trucking-logs/:id?field=refuelLogs
 */

export async function createRefuelLog(formData: FormData) {
  const truckingLogId = formData.get("truckingLogId") as string;
  const gallonsRefueled = formData.get("gallonsRefueled") as string;
  const milesAtFueling = formData.get("milesAtFueling") as string;

  if (!truckingLogId) {
    throw new Error("Trucking log ID is required");
  }

  const response = await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=refuelLogs`,
    "POST",
    {
      gallonsRefueled: gallonsRefueled ? Number(gallonsRefueled) : undefined,
      milesAtFueling: milesAtFueling ? Number(milesAtFueling) : undefined,
    }
  );

  return response.refuelLogs;
}

export async function createRefuelEquipmentLog(formData: FormData) {
  const employeeEquipmentLogId = formData.get(
    "employeeEquipmentLogId"
  ) as string;
  const gallonsRefueledStr = formData.get("gallonsRefueled") as string | null;
  const gallonsRefueled = gallonsRefueledStr
    ? parseFloat(gallonsRefueledStr)
    : null;

  // This endpoint is for equipment refueling - kept for compatibility
  // In the future, this should also use the API endpoint
  const response = await apiRequest(
    `/api/v1/timesheet/equipment-log/${employeeEquipmentLogId}`,
    "POST",
    {
      gallonsRefueled,
    }
  );

  return response;
}

/**
 * Delete refuel log for equipment logs
 * Uses: /api/v1/timesheet/equipment-log/:equipmentLogId
 */
export async function deleteEquipmentRefuelLog(refuelLogId: string) {
  try {
    await apiRequest(
      `/api/v1/timesheet/refuel-log/${refuelLogId}`,
      "DELETE"
    );
    return true;
  } catch (error) {
    console.error("Error deleting equipment refuel log:", error);
    throw error;
  }
}

export async function deleteEmployeeEquipmentLog(id: string) {
  try {
    await apiRequest(`/api/v1/timesheet/equipment-log/${id}`, "DELETE");
    return true;
  } catch (error) {
    console.error("Error deleting employee equipment log:", error);
    throw error;
  }
}

export async function updateRefuelLog(formData: FormData) {
  const refuelLogId = formData.get("id") as string;
  const truckingLogId = formData.get("truckingLogId") as string;
  const gallonsRefueled =
    Number(formData.get("gallonsRefueled") as string) || 0;
  const milesAtFueling = Number(formData.get("milesAtFueling")) || 0;

  const response = await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=refuelLogs`,
    "PUT",
    {
      refuelLogId,
      gallonsRefueled,
      milesAtFueling,
    }
  );

  return response;
}

export async function deleteRefuelLog(id: string, truckingLogId: string) {
  await apiRequest(
    `/api/v1/trucking-logs/${truckingLogId}?field=refuelLogs`,
    "DELETE",
    { resourceId: id }
  );

  return true;
}
