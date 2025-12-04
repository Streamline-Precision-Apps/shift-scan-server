"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/app/v1/components/ui/button";
import { toast } from "sonner";
import {
    createFormSubmission,
    ApproveFormSubmission,
} from "@/app/lib/actions/adminActions";
import Spinner from "@/app/v1/components/(animations)/spinner";
import { X } from "lucide-react";
import { Label } from "@/app/v1/components/ui/label";
import { Textarea } from "@/app/v1/components/ui/textarea";
import { useUserStore } from "@/app/lib/store/userStore";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import {
    denormalizeFormValues,
    validateFieldStructure,
} from "@/app/lib/utils/formNormalization";
import { FormTemplate, FormFieldValue } from "@/app/lib/types/forms";
import FormBridge from "@/app/admins/forms/_components/RenderFields/FormBridge";
import { DateTimePicker } from "../../../_pages/DateTimePicker";

interface CreateFormSubmissionModalProps {
    formTemplate: FormTemplate;
    closeModal: () => void;
    onSuccess?: () => void;
}

const CreateFormSubmissionModal: React.FC<CreateFormSubmissionModalProps> = ({
    formTemplate,
    closeModal,
    onSuccess,
}) => {
    const { user } = useUserStore();
    const adminUserId = user?.id || null;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Record<string, FormFieldValue>>(
        {}
    );
    const [submittedBy, setSubmittedBy] = useState<{
        id: string;
        firstName: string;
        lastName: string;
    } | null>(null);
    const [submittedByTouched, setSubmittedByTouched] = useState(false);
    const [submissionDate, setSubmissionDate] = useState<Date | null>(
        new Date()
    );

    // State for manager approval
    const [managerComment, setManagerComment] = useState<string>("");
    const [managerSignature, setManagerSignature] = useState<boolean>(false);

    // State for different asset types
    const [equipment, setEquipment] = useState<{ id: string; name: string }[]>(
        []
    );
    const [jobsites, setJobsites] = useState<{ id: string; name: string }[]>(
        []
    );
    const [costCodes, setCostCodes] = useState<{ id: string; name: string }[]>(
        []
    );

    const [users, setUsers] = useState<
        { id: string; firstName: string; lastName: string }[]
    >([]);

    const userOptions = users.map((u) => ({
        value: u.id,
        label: `${u.firstName} ${u.lastName}`,
    }));

    const equipmentOptions = equipment.map((e) => ({
        value: e.id,
        label: e.name,
    }));

    const jobsiteOptions = jobsites.map((j) => ({
        value: j.id,
        label: j.name,
    }));

    const costCodeOptions = costCodes.map((c) => ({
        value: c.id,
        label: c.name,
    }));

    useEffect(() => {
        const fetchEmployees = async () => {
            const employees = await apiRequest(
                "/api/v1/admins/personnel/getAllActiveEmployees",
                "GET"
            );
            setUsers(employees);
        };
        fetchEmployees();
    }, []);

    // Fetch equipment data
    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const data = await apiRequest(
                    "/api/v1/admins/equipment/summary",
                    "GET"
                );
                setEquipment(data || []);
            } catch (error) {
                console.error("Error fetching equipment:", error);
            }
        };
        fetchEquipment();
    }, []);

    // Fetch jobsites data
    useEffect(() => {
        const fetchJobsites = async () => {
            try {
                const data = await apiRequest("/api/v1/admins/jobsite", "GET");
                setJobsites(data.jobsiteSummary || []);
            } catch (error) {
                console.error("Error fetching jobsites:", error);
            }
        };
        fetchJobsites();
    }, []);

    // Fetch cost codes data
    useEffect(() => {
        const fetchCostCodes = async () => {
            try {
                const data = await apiRequest(
                    "/api/v1/admins/cost-codes",
                    "GET"
                );
                setCostCodes(data.costCodes || []);
            } catch (error) {
                console.error("Error fetching cost codes:", error);
            }
        };
        fetchCostCodes();
    }, []);

    // Helper to get the field type by fieldId
    function getFieldType(fieldId: string): string | undefined {
        for (const group of formTemplate.FormGrouping || []) {
            for (const field of group.Fields || []) {
                if (field.id === fieldId) {
                    return field.type;
                }
            }
        }
        return undefined;
    }

    const handleFieldChange = (
        fieldId: string,
        value: string | Date | string[] | object | boolean | number | null
    ) => {
        const fieldType = getFieldType(fieldId);

        // Store the value directly - RenderFields components handle the format they need
        // We'll only normalize when submitting to the API
        setFormData((prev) => ({ ...prev, [fieldId]: value }));
    };

    // Signature state is now tied to manager signature
    const [signatureChecked, setSignatureChecked] = useState(false);

    const handleSubmit = async () => {
        console.log("[DEBUG] formData before submit:", formData);
        setSubmittedByTouched(true);
        if (!submittedBy) {
            toast.error("'Submitted By' is required", { duration: 3000 });
            return;
        }
        if (formTemplate.isSignatureRequired && !signatureChecked) {
            toast.error("You must electronically sign this submission.", {
                duration: 3000,
            });
            return;
        }
        if (formTemplate.isApprovalRequired && !managerSignature) {
            toast.error(
                "You must sign the submission as a manager to approve it.",
                {
                    duration: 3000,
                }
            );
            return;
        }

        setLoading(true);
        try {
            // Ensure signature value is set in the form values if required
            const valuesToSubmit = { ...(formData || {}) } as Record<
                string,
                FormFieldValue
            >;
            if (formTemplate.isSignatureRequired) {
                valuesToSubmit.signature = true;
            }

            // Validate entire form against template structure
            const tempSubmission = {
                id: 0,
                title: null,
                formTemplateId: formTemplate.id,
                userId: submittedBy.id,
                formType: formTemplate.formType || null,
                data: valuesToSubmit,
                createdAt: new Date(),
                updatedAt: new Date(),
                submittedAt: new Date(),
                status: "DRAFT",
                User: {
                    id: submittedBy.id,
                    firstName: submittedBy.firstName,
                    lastName: submittedBy.lastName,
                },
                FormTemplate: formTemplate,
            } as any;

            const validation = validateFieldStructure(
                formTemplate,
                tempSubmission
            );
            if (!validation.valid) {
                validation.errors.forEach((e) =>
                    toast.error(e, { duration: 5000 })
                );
                setLoading(false);
                return;
            }

            // Denormalize values for API submission
            const apiPayload = denormalizeFormValues(
                formTemplate,
                valuesToSubmit
            );

            const createResult = await createFormSubmission({
                formTemplateId: formTemplate.id,
                data: apiPayload,
                submittedBy: {
                    id: submittedBy.id,
                    firstName: submittedBy.firstName,
                    lastName: submittedBy.lastName,
                },
                adminUserId,
                comment: managerComment || undefined,
                signature: signatureChecked
                    ? `${user?.firstName} ${user?.lastName}`
                    : undefined,
                status:
                    formTemplate.isApprovalRequired && managerSignature
                        ? "APPROVED"
                        : formTemplate.isApprovalRequired
                        ? "PENDING"
                        : "SUBMITTED",
                submittedAt: submissionDate
                    ? submissionDate.toISOString()
                    : new Date().toISOString(),
            });

            if (!createResult.success) {
                toast.error(
                    createResult.error || "Failed to create submission",
                    {
                        duration: 3000,
                    }
                );
                setLoading(false);
                return;
            }

            // If approval is required and manager signed, trigger approval action
            const createdSubmission = createResult.submission;
            const createdSubmissionId =
                createdSubmission?.id ||
                createdSubmission?.submissionId ||
                null;

            if (
                formTemplate.isApprovalRequired &&
                managerSignature &&
                createdSubmissionId
            ) {
                try {
                    const formDataObj = new FormData();
                    formDataObj.append("comment", managerComment || "");
                    formDataObj.append("adminUserId", adminUserId || "");
                    await ApproveFormSubmission(
                        Number(createdSubmissionId),
                        "APPROVED",
                        formDataObj
                    );
                } catch (apprErr) {
                    // Non-fatal: log and inform user these need manual approval or retry
                    console.error("Approval action failed:", apprErr);
                    toast.error(
                        "Submission created but manager approval failed. Please retry approval.",
                        { duration: 5000 }
                    );
                    setLoading(false);
                    return;
                }
            }

            toast.success("Submission created successfully", {
                duration: 3000,
            });
            closeModal();
            onSuccess?.();
        } catch (err) {
            toast.error("An unexpected error occurred", { duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    // Pass formData directly - child components handle their own data formatting
    // No transformation needed here since components already return properly formatted values
    const getDisplayFormData = () => {
        return formData;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-40 ">
            <div className="bg-white rounded-lg shadow-lg w-[600px] h-[80vh] overflow-y-auto no-scrollbar px-6 py-4 flex flex-col items-center">
                <div className="w-full flex flex-col border-b border-gray-100 pb-3 relative">
                    <Button
                        type="button"
                        variant={"ghost"}
                        size={"icon"}
                        onClick={closeModal}
                        className="absolute top-0 right-0 cursor-pointer"
                    >
                        <X width={20} height={20} />
                    </Button>
                    <div className="w-full flex flex-col justify-center  ">
                        <div>
                            <p className="text-lg text-black font-semibold ">
                                {formTemplate?.name || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">
                                Please complete the form fields to create a new
                                submission.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 w-full px-2 pb-10 overflow-y-auto no-scrollbar">
                    <div className="w-full mt-3 mb-4">
                        <DateTimePicker
                            label="Submission Date"
                            value={
                                submissionDate
                                    ? submissionDate.toISOString()
                                    : undefined
                            }
                            onChange={(val) => {
                                setSubmissionDate(val ? new Date(val) : null);
                            }}
                            font="font-semibold"
                        />
                    </div>
                    <div className="w-full mt-3">
                        <FormBridge
                            formTemplate={formTemplate}
                            userOptions={userOptions}
                            submittedBy={submittedBy}
                            setSubmittedBy={setSubmittedBy}
                            submittedByTouched={submittedByTouched}
                            formValues={getDisplayFormData()}
                            setFormValues={setFormData}
                            onFieldChange={handleFieldChange}
                            equipmentOptions={equipmentOptions}
                            jobsiteOptions={jobsiteOptions}
                            costCodeOptions={costCodeOptions}
                        />
                    </div>

                    {/* Manager Approval Section */}
                    {adminUserId &&
                    formTemplate.isApprovalRequired &&
                    formTemplate.isSignatureRequired ? (
                        <div className="w-full border-t border-gray-200 pt-4 mt-4">
                            <div className="flex items-center mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-600 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <h3 className="text-md font-semibold">
                                    Manager Approval
                                </h3>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                                <div className="mb-4">
                                    <Label
                                        htmlFor="manager-comment"
                                        className="text-sm font-medium mb-1 block"
                                    >
                                        Comment (Optional)
                                    </Label>
                                    <Textarea
                                        id="manager-comment"
                                        placeholder="Add any comments about this submission..."
                                        value={managerComment}
                                        onChange={(e) =>
                                            setManagerComment(e.target.value)
                                        }
                                        className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="manager-signature"
                                        checked={managerSignature}
                                        onChange={(e) => {
                                            setManagerSignature(
                                                e.target.checked
                                            );
                                            setSignatureChecked(
                                                e.target.checked
                                            );
                                        }}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="manager-signature"
                                        className="text-sm text-gray-700 select-none cursor-pointer"
                                    >
                                        I,{" "}
                                        <span className="font-semibold">
                                            {user?.firstName} {user?.lastName}
                                        </span>
                                        , electronically sign and approve this
                                        submission.
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : adminUserId &&
                      formTemplate.isApprovalRequired &&
                      !formTemplate.isSignatureRequired ? (
                        <div className="w-full border-t border-gray-200 pt-4 mt-4">
                            <div className="flex items-center mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-600 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <h3 className="text-md font-semibold">
                                    Manager Approval
                                </h3>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                                <div className="mb-4">
                                    <Label
                                        htmlFor="manager-comment"
                                        className="text-sm font-medium mb-1 block"
                                    >
                                        Comment (Optional)
                                    </Label>
                                    <Textarea
                                        id="manager-comment"
                                        placeholder="Add any comments about this submission..."
                                        value={managerComment}
                                        onChange={(e) =>
                                            setManagerComment(e.target.value)
                                        }
                                        className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="manager-signature"
                                        checked={managerSignature}
                                        onChange={(e) => {
                                            setManagerSignature(
                                                e.target.checked
                                            );
                                        }}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="manager-signature"
                                        className="text-sm text-gray-700 select-none cursor-pointer"
                                    >
                                        I,{" "}
                                        <span className="font-semibold">
                                            {user?.firstName} {user?.lastName}
                                        </span>
                                        , electronically sign and approve this
                                        submission.
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : adminUserId &&
                      !formTemplate.isApprovalRequired &&
                      formTemplate.isSignatureRequired ? (
                        <div className="w-full border-t border-gray-200 pt-4 mt-4">
                            <div className="flex items-center mb-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-600 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <h3 className="text-md font-semibold">
                                    Electronic Signature{" "}
                                </h3>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="signature"
                                        checked={signatureChecked}
                                        onChange={(e) => {
                                            setSignatureChecked(
                                                e.target.checked
                                            );
                                        }}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="signature"
                                        className="text-sm text-gray-700 select-none cursor-pointer"
                                    >
                                        I,{" "}
                                        <span className="font-semibold">
                                            {user?.firstName} {user?.lastName}
                                        </span>
                                        , electronically sign and approve this
                                        submission.
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="w-full flex flex-row justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                    <Button
                        size={"sm"}
                        onClick={closeModal}
                        variant="outline"
                        className="bg-gray-100 text-gray-800 hover:bg-gray-50 hover:text-gray-800"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        size={"sm"}
                        onClick={handleSubmit}
                        variant="outline"
                        className={`bg-sky-500 text-white hover:bg-sky-400 hover:text-white`}
                        disabled={
                            loading ||
                            (!managerSignature &&
                                formTemplate.isApprovalRequired) ||
                            (!signatureChecked &&
                                formTemplate.isSignatureRequired)
                        }
                    >
                        {loading ? <Spinner size={20} /> : "Create & Approve"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateFormSubmissionModal;
