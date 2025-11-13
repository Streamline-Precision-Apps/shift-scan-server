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

        const updateData: Record<string, any> = {};

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
        const updateData: Record<string, any> = {};
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
        const updateData: any = {};
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
        const updateData: any = {};
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
        await prisma.formTemplate.update({
            where: { id: formId },
            data: { isActive: "ARCHIVED" },
        });

        revalidatePath("/admins/records/forms");
        return { success: true, message: "Form archived successfully" };
    } catch (error) {
        console.error("Error archiving form template:", error);
        return { success: false, error: "Failed to archive form template" };
    }
}
export async function deleteFormTemplate(formId: string) {
    try {
        await prisma.formTemplate.delete({
            where: { id: formId },
        });

        revalidatePath("/admins/forms");
        revalidatePath(`/admins/forms/${formId}`);

        return { success: true, message: "Form deleted successfully" };
    } catch (error) {
        console.error("Error deleting form template:", error);
        return { success: false, error: "Failed to delete form template" };
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
        const formSubmissions = await prisma.formSubmission.findMany({
            where: {
                formTemplateId: formId,
                submittedAt: { gte: dateRange?.from, lte: dateRange?.to },
            },
            include: {
                User: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return formSubmissions;
    } catch (error) {
        console.error("Error fetching form submissions:", error);
        return null;
    }
}

export async function getFormTemplate(formId: string) {
    try {
        const formTemplate = await prisma.formTemplate.findUnique({
            where: { id: formId },
            include: {
                FormGrouping: {
                    include: {
                        Fields: true,
                    },
                },
            },
        });
        return formTemplate;
    } catch (error) {
        console.error("Error fetching form template:", error);
        return null;
    }
}

export async function publishFormTemplate(formId: string) {
    try {
        await prisma.formTemplate.update({
            where: { id: formId },
            data: { isActive: "ACTIVE" },
        });

        revalidatePath("/admins/records/forms");
        return { success: true, message: "Form published successfully" };
    } catch (error) {
        console.error("Error publishing form template:", error);
        return { success: false, error: "Failed to publish form template" };
    }
}

export async function saveFormTemplate(data: SaveFormData) {
    try {
        const { settings, fields, companyId } = data;
        // Start a transaction
        await prisma.$transaction(async (tx) => {
            // Create new form
            const formTemplate = await tx.formTemplate.create({
                data: {
                    companyId: companyId || "1", // fallback for now
                    name: settings.name,
                    description: settings.description || null,
                    formType: settings.formType as FormTemplateCategory,
                    isActive: settings.isActive as FormTemplateStatus,
                    isSignatureRequired: settings.requireSignature,
                    isApprovalRequired: settings.isApprovalRequired,
                },
            });
            // Always create a grouping for this form
            const formGrouping = await tx.formGrouping.create({
                data: {
                    title: settings.name,
                    order: 0,
                },
            });
            // Connect form template to grouping
            await tx.formTemplate.update({
                where: { id: formTemplate.id },
                data: {
                    FormGrouping: {
                        connect: { id: formGrouping.id },
                    },
                },
            });

            // Create all form fields
            for (const field of fields) {
                if (
                    ["DROPDOWN", "RADIO", "MULTISELECT"].includes(
                        field.type?.toUpperCase?.()
                    ) &&
                    !field.Options
                ) {
                }
                const formField = await tx.formField.create({
                    data: {
                        formGroupingId: formGrouping.id,
                        label: field.label,
                        type: mapFieldType(field.type),
                        required: field.required,
                        order: field.order,
                        placeholder: field.placeholder,
                        multiple: field.multiple || false,
                        content: field.content || null,
                        filter: field.filter || null,
                        minLength: field.minLength ?? undefined,
                        maxLength: field.maxLength ?? undefined,
                    },
                });

                // Handle field options for dropdowns, radios, multiselects
                if (
                    ["DROPDOWN", "RADIO", "MULTISELECT"].includes(
                        field.type?.toUpperCase?.()
                    ) &&
                    field.Options &&
                    field.Options.length > 0
                ) {
                    for (const option of field.Options) {
                        const optionData =
                            typeof option === "string"
                                ? { value: option }
                                : option;
                        await tx.formFieldOption.create({
                            data: {
                                fieldId: formField.id,
                                value: optionData.value,
                            },
                        });
                    }
                }
            }
            return;
        });

        revalidatePath("/admins/records/forms");
        return {
            success: true,
            message: "Form saved successfully",
        };
    } catch (error) {
        console.error("Error saving form template:", error);
        return { success: false, error: "Failed to save form template" };
    }
}

export async function updateFormTemplate(data: SaveFormData) {
    try {
        const { settings, fields, formId } = data;
        if (!formId) {
            return { success: false, error: "No formId provided for update" };
        }
        // Update the form template main settings
        await prisma.formTemplate.update({
            where: { id: formId },
            data: {
                name: settings.name,
                formType: settings.formType as FormTemplateCategory,
                isActive: (settings.isActive as FormTemplateStatus) || "DRAFT",
                isSignatureRequired: settings.requireSignature,
                isApprovalRequired: settings.isApprovalRequired,
                description: settings.description,
            },
        });

        // Get the grouping(s) for this form
        const groupings = await prisma.formGrouping.findMany({
            where: { FormTemplate: { some: { id: formId } } },
        });
        let formGroupingId = groupings[0]?.id;
        // If no grouping exists, create one
        if (!formGroupingId) {
            const newGrouping = await prisma.formGrouping.create({
                data: { title: settings.name, order: 0 },
            });
            await prisma.formTemplate.update({
                where: { id: formId },
                data: { FormGrouping: { connect: { id: newGrouping.id } } },
            });
            formGroupingId = newGrouping.id;
        }

        // Fetch all existing fields for this grouping
        const existingFields = await prisma.formField.findMany({
            where: { formGroupingId },
            include: { Options: true },
        });

        // Build a map for quick lookup
        const existingFieldMap = new Map(existingFields.map((f) => [f.id, f]));
        const submittedFieldIds = new Set(fields.map((f) => f.id));

        // Delete fields that are not in the submitted fields
        for (const oldField of existingFields) {
            if (!submittedFieldIds.has(oldField.id)) {
                await prisma.formFieldOption.deleteMany({
                    where: { fieldId: oldField.id },
                });
                await prisma.formField.delete({ where: { id: oldField.id } });
            }
        }

        // Upsert submitted fields
        for (const field of fields) {
            let formFieldId = field.id;
            const isExisting = existingFieldMap.has(field.id);
            if (isExisting) {
                // Update the field
                await prisma.formField.update({
                    where: { id: field.id },
                    data: {
                        label: field.label,
                        type: mapFieldType(field.type),
                        required: field.required,
                        order: field.order,
                        placeholder: field.placeholder,
                        minLength: field.minLength,
                        maxLength: field.maxLength,
                        multiple: field.multiple,
                        content: field.content,
                        filter: field.filter,
                        formGroupingId,
                    },
                });
                // Remove all options for this field (will re-add below)
                await prisma.formFieldOption.deleteMany({
                    where: { fieldId: field.id },
                });
            } else {
                // Create the field
                const created = await prisma.formField.create({
                    data: {
                        id: field.id,
                        formGroupingId,
                        label: field.label,
                        type: mapFieldType(field.type),
                        required: field.required,
                        order: field.order,
                        placeholder: field.placeholder,
                        maxLength: field.maxLength,
                        minLength: field.minLength,
                        multiple: field.multiple || false,
                        content: field.content || null,
                        filter: field.filter || null,
                    },
                });
                formFieldId = created.id;
            }

            // Handle field options for dropdowns, radios, multiselects
            if (
                ["DROPDOWN", "RADIO", "MULTISELECT"].includes(field.type) &&
                field.Options &&
                field.Options.length > 0
            ) {
                for (const option of field.Options) {
                    await prisma.formFieldOption.create({
                        data: {
                            fieldId: formFieldId,
                            value: option.value,
                        },
                    });
                }
            }

            // Handle additional types
            if (field.type === "TEXTAREA" || field.type === "TEXT") {
                await prisma.formField.update({
                    where: { id: formFieldId },
                    data: {
                        maxLength: field.maxLength,
                    },
                });
            }

            if (field.type === "NUMBER") {
                await prisma.formField.update({
                    where: { id: formFieldId },
                    data: {
                        maxLength: field.maxLength,
                    },
                });
            }

            if (field.type === "DATE" || field.type === "TIME") {
                await prisma.formField.update({
                    where: { id: formFieldId },
                    data: {
                        placeholder: field.placeholder,
                    },
                });
            }
        }

        revalidatePath("/admins/forms");
        return { success: true, formId, message: "Form updated successfully" };
    } catch (error) {
        console.error("Error updating form template:", error);
        return { success: false, error: "Failed to update form template" };
    }
}

export async function createFormSubmission(input: CreateFormSubmissionInput) {
    try {
        const {
            formTemplateId,
            data,
            submittedBy,
            adminUserId,
            comment,
            signature,
        } = input;
        if (!submittedBy.id) {
            throw new Error("Submitted By is required");
        }

        const created = await prisma.formSubmission.create({
            data: {
                formTemplateId,
                userId: submittedBy.id,
                data,
                status: FormStatus.APPROVED,
                submittedAt: new Date(),
            },
        });

        await prisma.formApproval.create({
            data: {
                formSubmissionId: created.id,
                signedBy: adminUserId,
                comment: comment || null,
                signature: signature || null,
                submittedAt: new Date(),
                updatedAt: new Date(),
            },
        });

        revalidatePath(`/admins/forms/${formTemplateId}`);
        return { success: true, submission: created };
    } catch (error) {
        console.error("Error creating form submission:", error);
        return { success: false, error: "Failed to create form submission" };
    }
}

export async function updateFormSubmission(input: UpdateFormSubmissionInput) {
    try {
        const {
            submissionId,
            data,
            adminUserId,
            comment,
            signature,
            updateStatus,
        } = input;

        // First, update the form submission data
        const updated = await prisma.formSubmission.update({
            where: { id: submissionId },
            data: {
                data,
                updatedAt: new Date(),
                // Update the status if specified
                ...(updateStatus && { status: updateStatus as FormStatus }),
            },
        });

        // If there's an admin user making the update, record this as an approval
        if (adminUserId) {
            // Check if there's an existing approval for this submission
            const existingApproval = await prisma.formApproval.findFirst({
                where: {
                    formSubmissionId: submissionId,
                    signedBy: adminUserId,
                },
            });

            if (existingApproval) {
                // Update existing approval
                await prisma.formApproval.update({
                    where: { id: existingApproval.id },
                    data: {
                        updatedAt: new Date(),
                        comment: comment || existingApproval.comment,
                        signature: signature || existingApproval.signature,
                    },
                });
            } else {
                // Create new approval record
                await prisma.formApproval.create({
                    data: {
                        formSubmissionId: submissionId,
                        signedBy: adminUserId,
                        updatedAt: new Date(),
                        comment: comment || null,
                        signature: signature || null,
                    },
                });
            }
        }
        // update the notification
        const notification = await prisma.notification.findMany({
            where: {
                referenceId: submissionId.toString(),
                topic: "form-submissions",
                Response: {
                    is: null,
                },
            },
        });
        if (notification.length > 0) {
            if (!adminUserId) {
                throw new Error(
                    "Admin User ID is required to mark notifications as read"
                );
            }
            await prisma.$transaction([
                prisma.notificationResponse.createMany({
                    data: notification.map((notification) => ({
                        notificationId: notification.id,
                        userId: adminUserId, // Ensure adminUserId is defined and correct
                        response: "READ",
                    })),
                }),
                prisma.notificationRead.createMany({
                    data: notification.map((notification) => ({
                        notificationId: notification.id,
                        userId: adminUserId, // Ensure adminUserId is defined and correct
                    })),
                    skipDuplicates: true, // Avoid duplicate entries
                }),
            ]);
        }

        revalidatePath(`/admins/forms/${updated.formTemplateId}`);
        return { success: true, submission: updated };
    } catch (error) {
        console.error("Error updating form submission:", error);
        return { success: false, error: "Failed to update form submission" };
    }
}

export async function deleteFormSubmission(submissionId: number) {
    try {
        const submission = await prisma.formSubmission.delete({
            where: { id: submissionId },
        });
        revalidatePath(`/admins/forms/${submission.formTemplateId}`);
        return {
            success: true,
            message: "Form submission deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting form submission:", error);
        return { success: false, error: "Failed to delete form submission" };
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

        const updated = await prisma.formSubmission.update({
            where: { id: submissionId },
            data: {
                status: action as FormStatus,
                updatedAt: new Date(),
                Approvals: {
                    create: {
                        signedBy: adminUserId || null,
                        comment: comment || null,
                        submittedAt: new Date(),
                        updatedAt: new Date(),
                    },
                },
            },
        });

        // update the notification
        const notification = await prisma.notification.findMany({
            where: {
                referenceId: submissionId.toString(),
                topic: "form-submissions",
                Response: {
                    is: null,
                },
            },
        });
        if (notification.length > 0) {
            if (!adminUserId) {
                throw new Error(
                    "Admin User ID is required to mark notifications as read"
                );
            }
            await prisma.$transaction([
                prisma.notificationResponse.createMany({
                    data: notification.map((notification) => ({
                        notificationId: notification.id,
                        response: "Approved",
                        respondedAt: new Date(),
                        userId: adminUserId,
                    })),
                }),
                prisma.notificationRead.createMany({
                    data: notification.map((notification) => ({
                        notificationId: notification.id,
                        userId: adminUserId, // Ensure adminUserId is defined and correct
                    })),
                    skipDuplicates: true, // Avoid duplicate entries
                }),
            ]);
        }

        revalidatePath(`/admins/forms/${updated.formTemplateId}`);
        return { success: true, submission: updated };
    } catch (error) {
        console.error("Error approving/rejecting form submission:", error);
        return {
            success: false,
            error: "Failed to approve/reject form submission",
        };
    }
}
export async function getFormSubmissionById(submissionId: number) {
    try {
        const submission = await prisma.formSubmission.findUnique({
            where: { id: submissionId },
            include: {
                User: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        signature: true,
                    },
                },
                FormTemplate: {
                    include: {
                        FormGrouping: {
                            include: {
                                Fields: {
                                    include: {
                                        Options: true, // if you need select/radio options
                                    },
                                },
                            },
                        },
                    },
                },
                Approvals: {
                    include: {
                        Approver: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { updatedAt: "desc" },
                },
            },
        });
        return submission;
    } catch (error) {
        console.error("Error fetching form submission:", error);
        return null;
    }
}

export async function draftFormTemplate(formId: string) {
    try {
        await prisma.formTemplate.update({
            where: { id: formId },
            data: { isActive: "DRAFT" },
        });

        revalidatePath("/admins/records/forms");
        return { success: true, message: "Form drafted successfully" };
    } catch (error) {
        console.error("Error drafting form template:", error);
        return { success: false, error: "Failed to draft form template" };
    }
}

// ============================================================================
// TIMESHEET ACTIONS
// ============================================================================

export async function createTimesheetAdmin(payload: any) {
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
