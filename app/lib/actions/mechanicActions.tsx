"use client";

import { apiRequest } from "@/app/lib/utils/api-Utils";

export async function createProject(formData: FormData) {
  try {
    const equipmentId = formData.get("equipmentId") as string;
    const hours = Number(formData.get("hours") as string);
    const description = formData.get("description") as string;
    const timeSheetId = Number(formData.get("timecardId") as string);

    // User Only needs to provide equipmentId and timeSheetId
    if (!equipmentId || !timeSheetId) {
      throw new Error("All fields are required.");
    }

    const result = await apiRequest("/api/v1/mechanic-logs", "POST", {
      timeSheetId,
      equipmentId,
      hours: hours || 0,
      description: description || "",
    });

    return result;
  } catch (error) {
    console.error("Error creating project:", error);
    return false;
  }
}
export async function updateProject(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const equipmentId = formData.get("equipmentId") as string;
    const hours = Number(formData.get("hours") as string);
    const description = formData.get("description") as string;

    if (!id) {
      throw new Error("Project ID is required.");
    }

    const updateData: Record<string, unknown> = {};

    if (equipmentId) updateData.equipmentId = equipmentId;
    if (hours) updateData.hours = hours;
    if (description) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields to update.");
    }

    const result = await apiRequest(
      `/api/v1/mechanic-logs/${id}`,
      "PUT",
      updateData
    );

    return result;
  } catch (error) {
    console.error("Error updating project:", error);
    return false;
  }
}
export async function deleteProject(projectId: number) {
  try {
    if (!projectId) {
      throw new Error("Project ID is required.");
    }

    await apiRequest(`/api/v1/mechanic-logs/${projectId}`, "DELETE");

    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
}
