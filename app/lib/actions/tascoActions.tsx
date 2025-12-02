"use client";

import { apiRequest } from "@/app/lib/utils/api-Utils";

export interface UpdateRefuelLogParams extends RefuelLogBase {
  type: RefuelLogType;
}
export interface RefuelLogBase {
  id: string;
  gallonsRefueled?: number;
  milesAtFueling?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface DeleteRefuelLogParams {
  type: RefuelLogType;
  id: string;
}

export interface CreateRefuelLogParams {
  type: RefuelLogType;
  parentId: string; // tascoLogId or employeeEquipmentLogId
}

export type RefuelLogType = "tasco" | "equipment";

export interface CreateTascoFLoadParams {
  tascoLogId: string;
}

export interface UpdateTascoFLoadParams {
  id: number;
  weight?: number | null;
  screenType?: string | null;
}

export interface DeleteTascoFLoadParams {
  id: number;
}

export type LoadType = "SCREENED" | "UNSCREENED";

/* LOADS Hauled */
//------------------------------------------------------------------
//------------------------------------------------------------------

/**
 * Update Tasco Log load quantity
 * PUT /api/v1/tasco-logs/:id/load-quantity
 */
export async function SetLoad(formData: FormData) {
  const tascoLogId = formData.get("tascoLogId") as string;
  const loadCount = Number(formData.get("loadCount"));

  if (!tascoLogId) {
    throw new Error("Tasco Log ID is required");
  }

  try {
    const response = await apiRequest(
      `/api/v1/tasco-logs/${tascoLogId}/load-quantity`,
      "PUT",
      { loadCount }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update load quantity:", error);
    throw new Error("Failed to update load quantity");
  }
}

// /* Tasco Comments */
// ------------------------------------------------------------------
// ------------------------------------------------------------------

/**
 * Update Tasco Log comment (updates associated TimeSheet comment)
 * PUT /api/v1/tasco-logs/:id/comment
 */
export const updateTascoComments = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const comment = formData.get("comment") as string;

  if (!id) {
    throw new Error("Tasco Log ID is required");
  }

  try {
    const response = await apiRequest(
      `/api/v1/tasco-logs/${id}/comment`,
      "PUT",
      { comment }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update comment:", error);
    throw new Error("Failed to update comment");
  }
};

// /* Tasco Refuel Logs */
// ------------------------------------------------------------------
// ------------------------------------------------------------------

/**
 * Creates a new refuel log
 * POST /api/v1/tasco-logs/:id/refuel-logs
 */
export async function createRefuelLog(
  params: CreateRefuelLogParams
): Promise<any> {
  try {
    if (params.type !== "tasco") {
      throw new Error("Only tasco type is supported in new API");
    }

    const response = await apiRequest(
      `/api/v1/tasco-logs/${params.parentId}/refuel-logs`,
      "POST"
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to create ${params.type} refuel log:`, error);
    throw new Error(`Failed to create ${params.type} refuel log`);
  }
}

/**
 * Updates an existing refuel log
 * PUT /api/v1/tasco-logs/refuel-logs/:refuelLogId
 */
export async function updateRefuelLog(
  params: UpdateRefuelLogParams
): Promise<any> {
  try {
    const updateBody: Record<string, any> = {};

    if (params.gallonsRefueled !== undefined) {
      updateBody.gallonsRefueled = params.gallonsRefueled;
    }
    if (params.milesAtFueling !== undefined) {
      updateBody.milesAtFueling = params.milesAtFueling;
    }

    const response = await apiRequest(
      `/api/v1/tasco-logs/refuel-logs/${params.id}`,
      "PUT",
      updateBody
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update ${params.type} refuel log:`, error);
    throw new Error(`Failed to update ${params.type} refuel log`);
  }
}

/**
 * Deletes a refuel log
 * DELETE /api/v1/tasco-logs/refuel-logs/:refuelLogId
 */
export async function deleteRefuelLog(params: DeleteRefuelLogParams) {
  try {
    await apiRequest(
      `/api/v1/tasco-logs/refuel-logs/${params.id}`,
      "DELETE"
    );
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete ${params.type} refuel log:`, error);
    throw new Error(`Failed to delete ${params.type} refuel log`);
  }
}

/* TascoFLoads CRUD Operations */
//------------------------------------------------------------------
//------------------------------------------------------------------

/**
 * Creates a new TascoFLoad
 * POST /api/v1/tasco-logs/:id/f-loads
 */
export async function createTascoFLoad(
  params: CreateTascoFLoadParams
): Promise<any> {
  try {
    const response = await apiRequest(
      `/api/v1/tasco-logs/${params.tascoLogId}/f-loads`,
      "POST"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create TascoFLoad:", error);
    throw new Error("Failed to create TascoFLoad");
  }
}

/**
 * Updates an existing TascoFLoad
 * PUT /api/v1/tasco-logs/f-loads/:fLoadId
 */
export async function updateTascoFLoad(
  params: UpdateTascoFLoadParams
): Promise<any> {
  try {
    const updateBody: Record<string, any> = {};

    if (params.weight !== undefined) {
      updateBody.weight = params.weight;
    }
    if (params.screenType !== undefined) {
      updateBody.screenType = params.screenType;
    }

    const response = await apiRequest(
      `/api/v1/tasco-logs/f-loads/${params.id}`,
      "PUT",
      updateBody
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update TascoFLoad:", error);
    throw new Error("Failed to update TascoFLoad");
  }
}

/**
 * Deletes a TascoFLoad
 * DELETE /api/v1/tasco-logs/f-loads/:fLoadId
 */
export async function deleteTascoFLoad(params: DeleteTascoFLoadParams) {
  try {
    await apiRequest(
      `/api/v1/tasco-logs/f-loads/${params.id}`,
      "DELETE"
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to delete TascoFLoad:", error);
    throw new Error("Failed to delete TascoFLoad");
  }
}
