"use client";
import { apiRequest } from "@/app/lib/utils/api-Utils";

export interface SaveFormData {
    settings: FormSettingsData;
    fields: FormFieldData[];
    companyId: string;
    formId?: string; // for updates
}

export interface FormSettingsData {
    name: string;
    description: string;
    formType: string;
    requireSignature: boolean;
    isApprovalRequired: boolean;
    isActive: string;
}

export interface FormFieldData {
    id: string;
    formGroupingId: string;
    label: string;
    type: string;
    required: boolean;
    order: number;
    placeholder?: string;
    minLength?: number | undefined;
    maxLength?: number | undefined;
    multiple?: boolean;
    content?: string | null;
    filter?: string | null;
    Options?: { id: string; value: string }[];
}

export interface UpdateFormSubmissionInput {
    submissionId: number;
    data: Record<string, string | number | boolean | null>;
    adminUserId: string | null;
    comment?: string;
    signature?: string;
    updateStatus?: string;
}

export interface CreateFormSubmissionInput {
    formTemplateId: string;
    data: Record<string, string | number | boolean | null>;
    submittedBy: {
        id: string;
        firstName: string;
        lastName: string;
    };
    adminUserId?: string | null;
    comment?: string;
    signature?: string;
    status?: string;
}

export async function createCrew(formData: FormData) {
    try {
        // Extract data from formData
        const crewName = formData.get("name") as string;
        const Users = formData.get("Users") as string;
        const teamLead = formData.get("leadId") as string;
        const crewType = formData.get("crewType") as string;

        if (!crewName || !crewName.trim()) {
            throw new Error("Crew name is required.");
        }
        if (!Users) {
            throw new Error("Crew members data is missing.");
        }
        if (!teamLead) {
            throw new Error("A team lead is required.");
        }

        // Call API to create crew
        const result = await apiRequest(
            "/api/v1/admins/personnel/createCrew",
            "POST",
            {
                name: crewName.trim(),
                leadId: teamLead,
                crewType,
                Users,
            }
        );

        return {
            success: true,
            crewId: result.crewId,
            message: "Crew created successfully",
        };
    } catch (error) {
        console.error("Error creating crew:", error);
        throw new Error(
            `Failed to create crew: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

export async function createUserAdmin(payload: {
    terminationDate: Date | null;
    createdById: string;
    username: string;
    firstName: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    password: string;
    permission: string;
    truckView: boolean;
    tascoView: boolean;
    mechanicView: boolean;
    laborView: boolean;
    crews: {
        id: string;
    }[];
}) {
    try {
        console.log("Payload in createUserAdmin:", payload);
        // Call API to create user
        const result = await apiRequest(
            "/api/v1/admins/personnel/createUserAdmin",
            "POST",
            {
                ...payload,
                terminationDate: payload.terminationDate?.toISOString() || null,
            }
        );

        return { success: true, userId: result.userId };
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error(
            `Failed to create user: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

export async function editCrew(formData: FormData) {
    try {
        // Extract data from formData
        const crewName = formData.get("name") as string;
        const Users = formData.get("Users") as string;
        const teamLead = formData.get("leadId") as string;
        const crewType = formData.get("crewType") as string;
        const crewId = formData.get("id") as string;

        if (!crewName || !crewName.trim()) {
            throw new Error("Crew name is required.");
        }
        if (!Users) {
            throw new Error("Crew members data is missing.");
        }
        if (!teamLead) {
            throw new Error("A team lead is required.");
        }

        // Call API to update crew
        const result = await apiRequest(
            `/api/v1/admins/personnel/editCrew/${crewId}`,
            "PUT",
            {
                name: crewName.trim(),
                leadId: teamLead,
                crewType,
                Users,
            }
        );

        return {
            success: true,
            crewId: result.crewId,
            message: "Crew updated successfully",
        };
    } catch (error) {
        console.error("Error updating crew:", error);
        throw new Error(
            `Failed to update crew: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

export async function editUserAdmin(payload: {
    id: string;
    terminationDate: string | null;
    username: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    secondLastName: string | null;
    permission: string;
    truckView: boolean;
    tascoView: boolean;
    mechanicView: boolean;
    laborView: boolean;
    crews: {
        id: string;
    }[];
}) {
    try {
        console.log("Payload in editUserAdmin:", payload);
        // Call API to update user
        const result = await apiRequest(
            `/api/v1/admins/personnel/editUserAdmin/${payload.id}`,
            "PUT",
            {
                ...payload,
            }
        );

        return { success: true, userId: result.userId };
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error(
            `Failed to update user: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

export async function deleteCrew(id: string) {
    try {
        await apiRequest(`/api/v1/admins/personnel/${id}`, "DELETE");
        return { success: true };
    } catch (error) {
        console.error("Error deleting crew:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export async function deleteUser(id: string) {
    try {
        await apiRequest(`/api/v1/admins/personnel/${id}`, "DELETE");
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

export async function registerEquipment(
    equipmentData: {
        code: string;
        name: string;
        description?: string;
        memo?: string;
        ownershipType?: string | null;
        make?: string | null;
        model?: string | null;
        year?: string | null;
        color?: string | null;
        serialNumber?: string | null;
        acquiredDate?: Date | null;
        acquiredCondition?: string | null;
        licensePlate?: string | null;
        licenseState?: string | null;
        equipmentTag: string;
        status?: string;
        state?: string;
        approvalStatus?: string;
        isDisabledByAdmin?: boolean;
        overWeight: boolean | null;
        currentWeight: number | null;
    },
    createdById: string
) {
    try {
        if (!equipmentData.name.trim()) {
            throw new Error("Equipment name is required.");
        }

        if (!equipmentData.equipmentTag) {
            throw new Error("Please select an equipment tag.");
        }

        // Generate QR ID for new equipment
        const qrId = `EQ-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;

        const result = await apiRequest("/api/v1/admins/equipment", "POST", {
            ...equipmentData,
            qrId,
            createdById,
            acquiredDate: equipmentData.acquiredDate?.toISOString() || null,
        });

        return { success: true, equipmentId: result.id };
    } catch (error) {
        console.error("Error registering equipment:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}

export async function updateEquipmentAsset(formData: FormData) {
    try {
        const id = formData.get("id") as string;

        if (!id) {
            throw new Error("Equipment ID is required");
        }

        const updateData: Record<string, unknown> = {};

        // Process all possible equipment fields
        if (formData.has("name"))
            updateData.name = (formData.get("name") as string)?.trim();
        if (formData.has("code"))
            updateData.code = (formData.get("code") as string)?.trim();
        if (formData.has("description"))
            updateData.description =
                (formData.get("description") as string)?.trim() || "";
        if (formData.has("memo"))
            updateData.memo = (formData.get("memo") as string)?.trim();
        if (formData.has("equipmentTag"))
            updateData.equipmentTag = formData.get("equipmentTag") as string;
        if (formData.has("state"))
            updateData.state = formData.get("state") as string;
        if (formData.has("status"))
            updateData.status = formData.get("status") as string;
        if (formData.has("ownershipType"))
            updateData.ownershipType =
                (formData.get("ownershipType") as string) || null;
        if (formData.has("acquiredCondition"))
            updateData.acquiredCondition =
                (formData.get("acquiredCondition") as string) || null;
        if (formData.has("serialNumber"))
            updateData.serialNumber = (
                formData.get("serialNumber") as string
            )?.trim();
        if (formData.has("color"))
            updateData.color = (formData.get("color") as string)?.trim();

        // Vehicle/equipment specific fields
        if (formData.has("make"))
            updateData.make = (formData.get("make") as string)?.trim();
        if (formData.has("model"))
            updateData.model = (formData.get("model") as string)?.trim();
        if (formData.has("year"))
            updateData.year = (formData.get("year") as string)?.trim();
        if (formData.has("licensePlate"))
            updateData.licensePlate = (
                formData.get("licensePlate") as string
            )?.trim();
        if (formData.has("licenseState"))
            updateData.licenseState = (
                formData.get("licenseState") as string
            )?.trim();

        // Handle date fields
        if (formData.has("acquiredDate")) {
            const dateValue = formData.get("acquiredDate") as string;
            updateData.acquiredDate = dateValue
                ? new Date(dateValue).toISOString()
                : null;
        }

        if (formData.has("registrationExpiration")) {
            const regExpValue = formData.get(
                "registrationExpiration"
            ) as string;
            if (
                regExpValue &&
                regExpValue !== "null" &&
                regExpValue !== "undefined"
            ) {
                updateData.registrationExpiration = new Date(
                    regExpValue
                ).toISOString();
            } else {
                updateData.registrationExpiration = null;
            }
        }

        // Handle numeric fields
        if (formData.has("currentWeight")) {
            const weightValue = formData.get("currentWeight") as string;
            updateData.currentWeight = weightValue
                ? parseFloat(weightValue) || 0
                : 0;
        }

        // Handle boolean fields
        if (formData.has("overWeight")) {
            const overWeightValue = formData.get("overWeight") as string;
            updateData.overWeight = overWeightValue === "true";
        }

        // Handle status fields
        if (formData.has("approvalStatus"))
            updateData.approvalStatus = formData.get(
                "approvalStatus"
            ) as string;
        if (formData.has("creationReason"))
            updateData.creationReason = formData.get(
                "creationReason"
            ) as string;

        const result = await apiRequest(
            `/api/v1/admins/equipment/${id}`,
            "PUT",
            updateData
        );

        return {
            success: true,
            data: result,
            message: "Equipment updated successfully",
        };
    } catch (error) {
        console.error("Error updating equipment:", error);
        throw new Error(
            `Failed to update equipment: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

export async function deleteEquipment(id: string) {
    try {
        await apiRequest(`/api/v1/admins/equipment/${id}`, "DELETE");
        return { success: true, message: "Equipment deleted successfully" };
    } catch (error) {
        console.error("Error deleting equipment:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function archiveEquipment(id: string) {
    try {
        await apiRequest(`/api/v1/admins/equipment/${id}/archive`, "PUT", {
            status: "ARCHIVED",
        });
        return { success: true };
    } catch (error) {
        console.error("Error archiving equipment:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function restoreEquipment(id: string) {
    try {
        await apiRequest(`/api/v1/admins/equipment/${id}/restore`, "PUT", {
            status: "ACTIVE",
        });
        return { success: true };
    } catch (error) {
        console.error("Error restoring equipment:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function createJobsiteAdmin({
    payload,
}: {
    payload: {
        code: string;
        name: string;
        description: string;
        ApprovalStatus: string;
        status: string;
        Address: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
        };
        Client?: {
            id: string;
        } | null;
        CCTags?: Array<{ id: string }>;
        CreatedVia: string;
        createdById: string;
    };
}) {
    try {
        const result = await apiRequest(
            "/api/v1/admins/jobsite",
            "POST",
            payload
        );
        return {
            success: true,
            message: "Jobsite created successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error creating jobsite:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function updateJobsiteAdmin(formData: FormData) {
    try {
        const id = formData.get("id") as string;
        if (!id) {
            throw new Error("Jobsite ID is required");
        }
        const updateData: Record<string, unknown> = {};
        if (formData.has("userId"))
            updateData.userId = formData.get("userId") as string; // add userId to updateData
        if (formData.has("code"))
            updateData.code = (formData.get("code") as string)?.trim();
        if (formData.has("name")) {
            const code = (formData.get("code") as string)?.trim();
            const name = (formData.get("name") as string)?.trim();
            updateData.name = `${code} - ${name}`;
        }
        if (formData.has("description"))
            updateData.description =
                (formData.get("description") as string)?.trim() || "";
        if (formData.has("approvalStatus"))
            updateData.approvalStatus = formData.get("approvalStatus");
        if (formData.has("status")) updateData.status = formData.get("status");
        if (formData.has("creationReason"))
            updateData.creationReason = formData.get("creationReason");
        updateData.updatedAt = new Date();
        if (formData.has("CCTags")) {
            const cCTagsString = formData.get("CCTags") as string;
            const cCTagsArray = JSON.parse(cCTagsString || "[]");
            updateData.CCTags = cCTagsArray;
        }
        const result = await apiRequest(
            `/api/v1/admins/jobsite/${id}`,
            "PUT",
            updateData
        );
        return {
            success: true,
            data: result,
            message: "Jobsite updated successfully",
        };
    } catch (error) {
        console.error("Error updating jobsite:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function deleteJobsite(id: string) {
    try {
        const result = await apiRequest(
            `/api/v1/admins/jobsite/${id}`,
            "DELETE"
        );
        return {
            success: true,
            message: "Jobsite deleted successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error deleting jobsite:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function archiveJobsite(id: string) {
    try {
        const result = await apiRequest(
            `/api/v1/admins/jobsite/${id}/archive`,
            "PUT",
            { status: "ARCHIVED" }
        );
        return {
            success: true,
            message: "Jobsite archived successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error archiving jobsite:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function restoreJobsite(id: string) {
    try {
        const result = await apiRequest(
            `/api/v1/admins/jobsite/${id}/restore`,
            "PUT",
            { status: "ACTIVE" }
        );
        return {
            success: true,
            message: "Jobsite restored successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error restoring jobsite:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

// -- Cost Codes
export async function createTag(payload: {
    name: string;
    description: string;
    CostCodes: { id: string; name: string }[];
    Jobsites: { id: string; name: string }[];
}) {
    try {
        const result = await apiRequest("/api/v1/admins/tags", "POST", payload);
        return {
            success: true,
            data: result,
            message: "Tag created successfully",
        };
    } catch (error) {
        console.error("Error creating tag:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function deleteTag(id: string) {
    try {
        await apiRequest(`/api/v1/admins/tags/${id}`, "DELETE");
        return {
            success: true,
            message: "Tag deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting tag:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function deleteCostCode(id: string) {
    try {
        await apiRequest(`/api/v1/admins/cost-codes/${id}`, "DELETE");
        return {
            success: true,
            message: "Cost code deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting cost code:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}
export async function archiveCostCode(id: string) {
    try {
        await apiRequest(`/api/v1/admins/cost-codes/${id}/archive`, "PUT");
        return { success: true, message: "Cost code archived successfully" };
    } catch (error) {
        console.error("Error archiving cost code:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function restoreCostCode(id: string) {
    try {
        await apiRequest(`/api/v1/admins/cost-codes/${id}/restore`, "PUT");
        return { success: true, message: "Cost code restored successfully" };
    } catch (error) {
        console.error("Error restoring cost code:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function updateTagAdmin(formData: FormData) {
    try {
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        const id = formData.get("id") as string;
        if (!id) {
            throw new Error("Tag ID is required");
        }
        const updateData: Record<string, unknown> = {};
        if (formData.has("name")) {
            updateData.name = (formData.get("name") as string)?.trim();
        }
        if (formData.has("description")) {
            updateData.description =
                (formData.get("description") as string)?.trim() || "";
        }
        if (formData.has("Jobsites")) {
            const jobsitesString = formData.get("Jobsites") as string;
            updateData.Jobsites = JSON.parse(jobsitesString || "[]");
        }
        if (formData.has("CostCodes")) {
            const costCodesString = formData.get("CostCodes") as string;
            updateData.CostCodes = JSON.parse(costCodesString || "[]");
        }
        const result = await apiRequest(
            `/api/v1/admins/tags/${id}`,
            "PUT",
            updateData
        );
        return {
            success: true,
            data: result,
            message: "Tag updated successfully",
        };
    } catch (error) {
        console.error("Error updating tag:", error);
        throw new Error(
            `Failed to update tag: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

export async function createCostCode(payload: {
    code: string;
    name: string;
    isActive: boolean;
    CCTags: { id: string; name: string }[];
}) {
    try {
        const result = await apiRequest(
            "/api/v1/admins/cost-codes",
            "POST",
            payload
        );
        return {
            success: true,
            data: result,
            message: "Cost code created successfully",
        };
    } catch (error) {
        console.error("Error creating cost code:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function updateCostCodeAdmin(formData: FormData) {
    try {
        const id = formData.get("id") as string;
        if (!id) {
            throw new Error("Cost code ID is required");
        }
        const updateData: Record<string, unknown> = {};
        if (formData.has("code")) {
            updateData.code = (formData.get("code") as string)?.trim();
        }
        if (formData.has("name")) {
            updateData.name = (formData.get("name") as string)?.trim();
        }
        if (formData.has("isActive")) {
            updateData.isActive = formData.get("isActive") === "true";
        }
        if (formData.has("cCTags")) {
            const cCTagsString = formData.get("cCTags") as string;
            updateData.CCTags = JSON.parse(cCTagsString || "[]");
        }
        updateData.updatedAt = new Date();
        const result = await apiRequest(
            `/api/v1/admins/cost-codes/${id}`,
            "PUT",
            updateData
        );
        return {
            success: true,
            data: result,
            message: "Cost code updated successfully",
        };
    } catch (error) {
        console.error("Error updating cost code:", error);
        throw new Error(
            `Failed to update cost code: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

// forms actions

export async function archiveFormTemplate(formId: string) {
  try {
    const result = await apiRequest(
      `/api/v1/admins/forms/template/${formId}/archive`,
      "PUT"
    );
    return {
      success: true,
      message: "Form archived successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error archiving form template:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to archive form template",
    };
  }
}

export async function deleteFormTemplate(formId: string) {
  try {
    const result = await apiRequest(
      `/api/v1/admins/forms/template/${formId}`,
      "DELETE"
    );
    return {
      success: true,
      message: "Form deleted successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error deleting form template:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete form template",
    };
  }
}

export async function getFormSubmissions(
    formId: string,
    dateRange?: {
        from?: Date;
        to?: Date;
    }
) {
  try {
    const queryParams = new URLSearchParams();
    if (dateRange?.from) {
      queryParams.append("from", dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      queryParams.append("to", dateRange.to.toISOString());
    }

    const url = `/api/v1/admins/forms/template/${formId}/submissions/export${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const result = await apiRequest(url, "GET");
    return result.data || result;
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    return null;
  }
}

export async function getFormTemplate(formId: string) {
  try {
    const result = await apiRequest(
      `/api/v1/admins/forms/template/${formId}`,
      "GET"
    );
    return result.data || result;
  } catch (error) {
    console.error("Error fetching form template:", error);
    return null;
  }
}

export async function publishFormTemplate(formId: string) {
  try {
    const result = await apiRequest(
      `/api/v1/admins/forms/template/${formId}/publish`,
      "PUT"
    );
    return {
      success: true,
      message: "Form published successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error publishing form template:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to publish form template",
    };
  }
}

export async function saveFormTemplate(data: SaveFormData) {
  try {
    const result = await apiRequest(
      "/api/v1/admins/forms/template",
      "POST",
      data as unknown as Record<string, unknown>
    );
    return {
      success: true,
      message: "Form saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error saving form template:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to save form template",
    };
  }
}

export async function updateFormTemplate(data: SaveFormData) {
  try {
    const { formId } = data;
    if (!formId) {
      return { success: false, error: "No formId provided for update" };
    }

    const result = await apiRequest(
      `/api/v1/admins/forms/template/${formId}`,
      "PUT",
      data as unknown as Record<string, unknown>
    );

    return {
      success: true,
      formId,
      message: "Form updated successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error updating form template:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update form template",
    };
  }
}

export async function createFormSubmission(input: CreateFormSubmissionInput) {
  try {
    const { formTemplateId } = input;
    if (!input.submittedBy.id) {
      throw new Error("Submitted By is required");
    }

    const result = await apiRequest(
      `/api/v1/admins/forms/template/${formTemplateId}/submissions`,
      "POST",
      input as unknown as Record<string, unknown>
    );

    return { success: true, submission: result };
  } catch (error) {
    console.error("Error creating form submission:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create form submission",
    };
  }
}

export async function updateFormSubmission(input: UpdateFormSubmissionInput) {
  try {
    const { submissionId } = input;

    const result = await apiRequest(
      `/api/v1/admins/forms/submissions/${submissionId}`,
      "PUT",
      input as unknown as Record<string, unknown>
    );

    return { success: true, submission: result };
  } catch (error) {
    console.error("Error updating form submission:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update form submission",
    };
  }
}

export async function deleteFormSubmission(submissionId: number) {
  try {
    const result = await apiRequest(
      `/api/v1/admins/forms/submissions/${submissionId}`,
      "DELETE"
    );
    return {
      success: true,
      message: "Form submission deleted successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error deleting form submission:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete form submission",
    };
  }
}

export async function ApproveFormSubmission(
    submissionId: number,
    action: "APPROVED" | "REJECTED",
    formData: FormData
) {
    try {
        const comment = formData.get("comment") as string;
        const adminUserId = formData.get("adminUserId") as string;

    const body = {
      action,
      comment,
      adminUserId,
    };

    const result = await apiRequest(
      `/api/v1/admins/forms/submissions/${submissionId}/approve`,
      "PUT",
      body
    );

    return { success: true, submission: result };
  } catch (error) {
    console.error("Error approving/rejecting form submission:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to approve/reject form submission",
    };
  }
}

export async function getFormSubmissionById(submissionId: number) {
  try {
    const result = await apiRequest(
      `/api/v1/admins/forms/submissions/${submissionId}`,
      "GET"
    );
    return result;
  } catch (error) {
    console.error("Error fetching form submission:", error);
    return null;
  }
}

export async function draftFormTemplate(formId: string) {
  try {
    const result = await apiRequest(
      `/api/v1/admins/forms/template/${formId}/draft`,
      "PUT"
    );
    return {
      success: true,
      message: "Form drafted successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error drafting form template:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to draft form template",
    };
  }
}

export async function createTimesheetAdmin(payload: FormData | Record<string, unknown> | undefined) {
    try {
        const result = await apiRequest(
            "/api/v1/admins/timesheet",
            "POST",
            payload
        );
        return {
            success: true,
            message: "Timesheet created successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error creating timesheet:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function updateTimesheetAdmin(formData: FormData) {
    try {
        const id = formData.get("id") as string;
        if (!id) {
            throw new Error("Timesheet ID is required");
        }

        const data = formData.get("data") as string;
        const originalData = formData.get("originalData") as string;
        const changes = formData.get("changes") as string;
        const editorId = formData.get("editorId") as string;
        const changeReason = formData.get("changeReason") as string;
        const wasStatusChanged = formData.get("wasStatusChanged") as string;
        const numberOfChanges = formData.get("numberOfChanges") as string;

        const result = await apiRequest(
            `/api/v1/admins/timesheet/${id}`,
            "PUT",
            {
                data: JSON.parse(data),
                originalData: JSON.parse(originalData),
                changes: JSON.parse(changes),
                editorId,
                changeReason,
                wasStatusChanged: wasStatusChanged === "true",
                numberOfChanges: parseInt(numberOfChanges, 10),
            }
        );

        return {
            success: true,
            data: result.data,
            message: "Timesheet updated successfully",
        };
    } catch (error) {
        console.error("Error updating timesheet:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function updateTimesheetStatus(
    id: number,
    status: "APPROVED" | "REJECTED" | "PENDING",
    changes: Record<string, { old: unknown; new: unknown }>
) {
    try {
        const result = await apiRequest(
            `/api/v1/admins/timesheet/${id}/status`,
            "PUT",
            { status, changes }
        );
        return {
            success: true,
            message: result.message || "Timesheet status updated successfully",
        };
    } catch (error) {
        console.error("Error updating timesheet status:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function deleteTimesheet(id: number) {
    try {
        const result = await apiRequest(
            `/api/v1/admins/timesheet/${id}`,
            "DELETE"
        );
        return {
            success: true,
            message: "Timesheet deleted successfully",
            data: result,
        };
    } catch (error) {
        console.error("Error deleting timesheet:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

export async function exportTimesheets(
    timesheetIds: number[],
    fields: string[],
    dateRange?: { from?: Date; to?: Date },
    filters?: {
        users?: string[];
        crews?: string[];
        profitCenters?: string[];
    }
) {
    try {
        const result = await apiRequest(
            "/api/v1/admins/timesheet/export",
            "POST",
            {
                timesheetIds,
                fields,
                dateRange,
                filters,
            }
        );
        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error("Error exporting timesheets:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}


