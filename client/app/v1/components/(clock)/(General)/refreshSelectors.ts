import { useCostCodeStore } from "@/app/lib/store/costCodeStore";
import { useEquipmentStore } from "@/app/lib/store/equipmentStore";
import { useProfitStore } from "@/app/lib/store/profitStore";
import { apiRequest } from "@/app/lib/utils/api-Utils";

export async function refreshCostCodes() {
  try {
    const response = await apiRequest("/api/v1/cost-codes", "GET");

    // Extract the data array from the response
    const data = Array.isArray(response) ? response : response.data || response;
    useCostCodeStore.getState().setCostCodes(data);
  } catch (error) {
    console.error("Error refreshing cost codes:", error);
    throw error;
  }
}

export async function refreshEquipment() {
  try {
    const response = await apiRequest("/api/v1/equipment", "GET");

    // Extract the data array from the response
    const data = Array.isArray(response) ? response : response.data || response;
    useEquipmentStore.getState().setEquipments(data);
  } catch (error) {
    console.error("Error refreshing equipment:", error);
    throw error;
  }
}

export async function refreshJobsites() {
  try {
    const response = await apiRequest("/api/v1/jobsite", "GET");

    // Extract the data array from the response
    const data = Array.isArray(response) ? response : response.data || response;
    useProfitStore.getState().setJobsites(data);
  } catch (error) {
    console.error("Error refreshing jobsites:", error);
    throw error;
  }
}
