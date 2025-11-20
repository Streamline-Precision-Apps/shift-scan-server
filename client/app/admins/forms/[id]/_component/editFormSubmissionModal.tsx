"use client";

import { Button } from "@/app/v1/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/v1/components/ui/accordion";
import React, { useEffect, useState, useMemo, use } from "react";
import {
  FormIndividualTemplate,
  FormSubmissionWithTemplate,
} from "./hooks/types";
import { Label } from "@/app/v1/components/ui/label";
import { Input } from "@/app/v1/components/ui/input";
import { toast } from "sonner";
import FormBridge from "@/app/admins/forms/_components/RenderFields/FormBridge";
import { Textarea } from "@/app/v1/components/ui/textarea";
import { ChevronDown, X } from "lucide-react";
import { useDashboardData } from "../../../_pages/sidebar/DashboardDataContext";
import {
  getFormSubmissionById,
  updateFormSubmission,
} from "@/app/lib/actions/adminActions";
import { useUserStore } from "@/app/lib/store/userStore";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import { denormalizeFormValues } from "@/app/lib/utils/formNormalization";

import { FormFieldValue, FormTemplate } from "@/app/lib/types/forms";

export default function EditFormSubmissionModal({
  id,
  closeModal,
  formTemplate,
  onSuccess,
}: {
  id: number;
  closeModal: () => void;
  formTemplate: FormTemplate | null;
  onSuccess: () => void;
}) {
  const { refresh } = useDashboardData();
  const { user } = useUserStore();

  const adminUserId = user?.id || null;

  const [loading, setLoading] = useState(true);
  const [formSubmission, setFormSubmission] =
    useState<FormSubmissionWithTemplate | null>(null);
  const [editData, setEditData] = useState<
    Record<string, string | number | boolean | null | Date | object | string[]>
  >({});

  // State for manager comment and signature
  const [managerComment, setManagerComment] = useState<string>("");
  const [managerSignature, setManagerSignature] = useState<boolean>(false);

  // State for different asset types
  const [equipment, setEquipment] = useState<{ id: string; name: string }[]>(
    []
  );
  const [jobsites, setJobsites] = useState<{ id: string; name: string }[]>([]);
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
    console.log("editData:", editData);
  }, [editData]);

  // Fetch form submission data by ID
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const submission = await getFormSubmissionById(id);
      if (!submission) {
        console.error("Submission not found for ID:", id);
        return;
      }
      console.log("Api Response:", submission);
      setFormSubmission(submission as unknown as FormSubmissionWithTemplate);

      // Convert submission data to the correct type
      const processedData: Record<string, FormFieldValue> = {};
      if (
        submission &&
        typeof submission.data === "object" &&
        submission.data !== null
      ) {
        // First, add all the original data entries
        Object.entries(submission.data).forEach(([key, value]) => {
          if (value === undefined) return;
          if (value === null) {
            processedData[key] = null;
            return;
          }

          if (typeof value === "string") {
            const trimmed = value.trim();
            // If value looks like a JSON string, try to parse it back to object/array
            if (
              (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
              (trimmed.startsWith("[") && trimmed.endsWith("]"))
            ) {
              try {
                processedData[key] = JSON.parse(trimmed) as FormFieldValue;
                return;
              } catch (e) {
                // Not valid JSON - leave as string
              }
            }
            // Otherwise store raw string (CSV etc.) and let display logic handle conversion
            processedData[key] = value as FormFieldValue;
            return;
          }

          if (typeof value === "object") {
            // Preserve arrays/objects without converting to string
            processedData[key] = value as FormFieldValue;
            return;
          }

          // number / boolean fall-through
          processedData[key] = value as FormFieldValue;
        });
      }
      setEditData(processedData);

      setLoading(false);
    };
    fetchData();
  }, [id]);
  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await apiRequest(
        "/api/v1/admins/personnel/getAllActiveEmployees",
        "GET"
      );
      setUsers(users);
    };
    fetchUsers();
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
        const data = await apiRequest("/api/v1/admins/cost-codes", "GET");

        const codes = data.costCodes || [];

        setCostCodes(codes);
      } catch (error) {
        console.error("Error fetching cost codes:", error);
      }
    };
    fetchCostCodes();
  }, []);

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleFieldTouch = (fieldId: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldId]: true }));
  };

  const validateField = (
    fieldId: string,
    value:
      | string
      | number
      | boolean
      | null
      | Date
      | string[]
      | object
      | undefined,
    required: boolean
  ) => {
    if (required && (value === null || value === undefined || value === "")) {
      return "This field is required.";
    }
    return null;
  };

  const handleFieldChange = (
    fieldId: string,
    value: string | Date | string[] | object | boolean | number | null
  ) => {
    // Store value directly - child components handle their own formatting
    // Normalization happens only during submission
    setEditData((prev) => ({ ...prev, [fieldId]: value }));
    const fieldError = validateField(fieldId, value, true);
    setErrors((prev) => ({ ...prev, [fieldId]: fieldError }));
  };

  // Transform editData to display format for child components
  // Converts stored strings back to proper object formats
  // Use useMemo to re-compute only when dependencies change
  const displayFormData = useMemo(() => {
    const displayData: Record<string, any> = { ...editData };

    if (formSubmission?.FormTemplate?.FormGrouping) {
      for (const group of formSubmission.FormTemplate.FormGrouping) {
        for (const field of group.Fields || []) {
          const val = editData[field.id];

          // SEARCH_PERSON: Convert comma-separated names back to person objects
          if (
            field.type === "SEARCH_PERSON" &&
            typeof val === "string" &&
            val.trim()
          ) {
            if (field.multiple) {
              // Multi-select: comma-separated names → array of person objects
              const names = val
                .split(",")
                .map((n) => n.trim())
                .filter(Boolean);
              displayData[field.id] = names
                .map((name) => {
                  const match = userOptions.find((opt) => opt.label === name);
                  return match ? { id: match.value, name: match.label } : null;
                })
                .filter(Boolean);
            } else {
              // Single select: name → person object
              const match = userOptions.find((opt) => opt.label === val.trim());
              if (match) {
                displayData[field.id] = { id: match.value, name: match.label };
              }
            }
          }

          // SEARCH_ASSET: Convert asset names back to asset objects
          if (field.type === "SEARCH_ASSET") {
            // Skip if already an object or array of objects
            if (typeof val === "string" && val.trim()) {
              const allAssetOptions = [
                ...(equipmentOptions || []),
                ...(jobsiteOptions || []),
                ...(costCodeOptions || []),
              ];

              if (field.multiple) {
                // Multi-select: comma-separated names → array of asset objects
                const names = val
                  .split(",")
                  .map((n) => n.trim())
                  .filter(Boolean);
                displayData[field.id] = names
                  .map((name) => {
                    // Try exact match first, then case-insensitive match
                    let match = allAssetOptions.find(
                      (opt) => opt.label.trim() === name
                    );
                    if (!match) {
                      match = allAssetOptions.find(
                        (opt) =>
                          opt.label.trim().toLowerCase() === name.toLowerCase()
                      );
                    }

                    return match
                      ? {
                          id: match.value,
                          name: match.label,
                          type: (field.filter || "asset").toLowerCase(),
                        }
                      : null;
                  })
                  .filter(Boolean);
              } else {
                // Single select: name → asset object
                // Try exact match first, then case-insensitive match
                let match = allAssetOptions.find(
                  (opt) => opt.label.trim() === val.trim()
                );
                if (!match) {
                  match = allAssetOptions.find(
                    (opt) =>
                      opt.label.trim().toLowerCase() ===
                      val.trim().toLowerCase()
                  );
                }

                if (match) {
                  displayData[field.id] = {
                    id: match.value,
                    name: match.label,
                    type: (field.filter || "asset").toLowerCase(),
                  };
                }
              }
            }
          }
        }
      }
    }

    return displayData;
  }, [
    editData,
    equipmentOptions,
    jobsiteOptions,
    costCodeOptions,
    formSubmission,
    userOptions,
  ]);

  // Transform editData to API submission format
  const getSubmitFormData = () => {
    if (!formSubmission?.FormTemplate) return {};
    // Use canonical denormalization utility to convert the editable form values
    const apiPayload = denormalizeFormValues(
      formSubmission.FormTemplate as unknown as FormTemplate,
      editData as Record<string, any>
    );
    return apiPayload as Record<string, string | number | boolean | null>;
  };

  // Signature state for editing
  const [signatureChecked, setSignatureChecked] = useState(false);

  const saveChanges = async () => {
    if (!formSubmission) return;
    if (
      formTemplate?.isSignatureRequired &&
      !editData.signature &&
      !signatureChecked
    ) {
      toast.error("You must electronically sign this submission.", {
        duration: 3000,
      });
      return;
    }
    try {
      // Transform editData to API submission format
      const updatedData = getSubmitFormData();

      if (
        formTemplate?.isSignatureRequired &&
        !editData.signature &&
        signatureChecked
      ) {
        updatedData.signature = "true";
      }

      // Submit with correct typing
      const res = await updateFormSubmission({
        submissionId: formSubmission.id,
        data: updatedData,
        adminUserId,
        comment: managerComment,
        signature: managerSignature
          ? `${user?.firstName} ${user?.lastName}`
          : undefined,
        // If the status is PENDING and manager has signed, update status to APPROVED
        updateStatus:
          formSubmission.status === "PENDING" && managerSignature
            ? "APPROVED"
            : undefined,
      });

      if (res.success) {
        toast.success("Submission updated successfully", { duration: 3000 });

        refresh();
        onSuccess();
      } else {
        toast.error(res.error || "Failed to update submission", {
          duration: 3000,
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred", { duration: 3000 });
    }
  };

  if (loading) {
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

            <p className="text-lg text-black font-semibold">
              {formTemplate?.name || "N/A"}
            </p>

            <div className="flex flex-row items-center gap-2">
              <span className="text-xs text-gray-500 px-2 py-1 rounded-lg bg-gray-100">
                Submission ID: {id}
              </span>
              <span
                className={`w-fit text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-500 `}
              >
                loading...
              </span>
            </div>
          </div>
          <div className="flex-1 w-full pb-10 overflow-y-auto no-scrollbar">
            {formTemplate?.isApprovalRequired && (
              <div className="w-full flex flex-col ">
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-gray-200 rounded-md bg-gray-50 mt-3 cursor-default w-fit px-3 py-2 hover:no-underline"
                  disabled
                >
                  <div className="w-full flex flex-row ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-emerald-600 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold text-xs text-gray-700 ">
                      Approval History
                    </span>
                    <div className="grow">
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </div>
                  </div>
                </Button>
              </div>
            )}
            {/* Simulated form fields skeleton */}
            {/* Simulated form fields skeleton - Including submitted for field */}
            <div className="w-full h-full space-y-6 mt-4">
              {/* Submitted For field skeleton */}
              <div className="space-y-1">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-full bg-gray-100 rounded animate-pulse"></div>
              </div>
              {/* Form template fields skeleton - Adding one for "Submitted For" field */}
              {Array.from({
                length: formTemplate?.FormGrouping?.[0]?.Fields?.length || 4,
              }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
              <div className="w-full border-t border-gray-200 pt-4 mt-4"></div>
            </div>
          </div>

          <div className="w-full flex flex-row justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
            <Button
              size={"sm"}
              onClick={closeModal}
              variant="outline"
              className="bg-gray-100 text-gray-800 hover:bg-gray-50 hover:text-gray-800  "
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              onClick={saveChanges}
              variant="outline"
              className="bg-sky-500 text-white hover:bg-sky-400 hover:text-white"
              disabled
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render editable fields for each field in the template
  const renderFields = () => {
    if (!formSubmission?.FormTemplate?.FormGrouping) return null;

    // displayFormData is already computed by useMemo above
    // Helper to check if signed
    const isSigned =
      displayFormData.signature === true ||
      displayFormData.signature === "true";
    const signature = formSubmission.User.signature;

    // Use FormBridge to render the template fields. We pass `displayFormData`
    // as `formValues` so that SEARCH_PERSON/SEARCH_ASSET fields can receive
    // object shapes (not just CSV strings). We still keep "Submitted For"
    // as a separate display field above and keep signature display below.
    return (
      <>
        <div>
          {formSubmission.FormTemplate.FormGrouping.map((group) => (
            <div key={group.id} className="mb-4">
              <div className="mb-4">
                <Label className="text-sm font-medium mb-1 ">
                  Submitted For <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Submitted For"
                  value={`${formSubmission.User?.firstName} ${formSubmission.User?.lastName}`}
                  disabled={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <FormBridge
                  formTemplate={
                    formSubmission.FormTemplate as unknown as FormTemplate
                  }
                  formValues={displayFormData}
                  setFormValues={(newValues) => setEditData(newValues as any)}
                  onFieldChange={(fieldId: string, value: any) =>
                    handleFieldChange(fieldId, value)
                  }
                  userOptions={userOptions}
                  equipmentOptions={equipmentOptions}
                  jobsiteOptions={jobsiteOptions}
                  costCodeOptions={costCodeOptions}
                  readOnly={false}
                  disabled={false}
                  hideSubmittedBy={true}
                />
              </div>
            </div>
          ))}
          {/* Signature display logic */}
          {formSubmission.FormTemplate.isSignatureRequired && (
            <div className="w-full p-3 mb-2 bg-gray-50 rounded-md border border-gray-200">
              {isSigned && signature && (
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2">Signature</label>
                  <div className="border border-gray-300 bg-white rounded-md p-3">
                    <img
                      src={signature || ""}
                      alt="User Signature"
                      className="w-24 h-auto "
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-row items-center gap-2">
                <input
                  type="checkbox"
                  id="signature-checkbox-edit"
                  checked={isSigned}
                  onChange={(e) => setSignatureChecked(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="signature-checkbox-edit"
                  className="text-sm text-gray-700 select-none cursor-pointer font-medium"
                >
                  User electronically signed this submission
                </label>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-40 ">
      <div className="bg-white rounded-lg shadow-lg w-[600px] h-[80vh] px-6 py-4 flex flex-col items-center">
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
          <p className="text-lg text-black font-semibold">
            {formTemplate?.name || "N/A"}
          </p>
          <div className="flex flex-row items-center gap-2">
            <span className="text-xs text-gray-500 px-2 py-1 rounded-lg bg-gray-100">
              Submission ID: {id}
            </span>
            <span
              className={`w-fit text-xs px-2 py-1 rounded-lg ${
                formSubmission?.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : formSubmission?.status === "DENIED"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {formSubmission?.status
                ? `${formSubmission.status
                    .slice(0, 1)
                    .toUpperCase()}${formSubmission.status
                    .slice(1)
                    .toLowerCase()}`
                : "Pending"}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full px-2 pb-10 overflow-y-auto no-scrollbar">
          {/* Show approval information if available */}
          {formTemplate?.isApprovalRequired && (
            <>
              {formSubmission?.Approvals &&
              formSubmission.Approvals.length > 0 ? (
                <Accordion type="single" collapsible className="mt-3">
                  <AccordionItem
                    value="approvals"
                    className="border border-gray-200 rounded-md bg-gray-50"
                  >
                    <AccordionTrigger className="px-3 py-2 hover:no-underline">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-emerald-600 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-semibold text-xs text-gray-700">
                          Approval History
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3">
                      <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-1">
                        {/* Sort approvals by date (newest first) */}
                        {[...formSubmission.Approvals]
                          .sort(
                            (a, b) =>
                              new Date(b.updatedAt).getTime() -
                              new Date(a.updatedAt).getTime()
                          )
                          .map((approval, index) => (
                            <div
                              key={approval.id}
                              className={`py-1.5 ${
                                index !== 0 ? "border-t border-gray-100" : ""
                              }`}
                            >
                              <div className="flex items-center text-xs">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 text-emerald-500 mr-1 shrink-0"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <div>
                                  {approval.Approver ? (
                                    <span className="font-medium">
                                      {approval.Approver.firstName}{" "}
                                      {approval.Approver.lastName}
                                    </span>
                                  ) : (
                                    <span className="font-medium">
                                      System Approval
                                    </span>
                                  )}
                                  <span className="text-xs ml-1 text-gray-500">
                                    (
                                    {new Date(
                                      approval.updatedAt
                                    ).toLocaleDateString()}{" "}
                                    at{" "}
                                    {new Date(
                                      approval.updatedAt
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                    )
                                  </span>
                                </div>
                              </div>
                              {approval.comment && (
                                <p className="text-xs mt-1 italic text-gray-600 bg-white px-2 py-1 rounded border border-gray-100">
                                  {approval.comment}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-gray-200 rounded-md bg-gray-50 mt-3   py-2 hover:no-underline"
                  disabled
                >
                  <div className="w-full flex flex-row ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-emerald-600 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold text-xs text-gray-700">
                      Approval History
                    </span>
                    <div className="grow">
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </div>
                  </div>
                </Button>
              )}
            </>
          )}

          <div className="w-full mt-4">{renderFields()}</div>
          {/* Manager Approval Section - Only show when status is PENDING */}
          {formTemplate?.isApprovalRequired &&
            formSubmission?.status === "PENDING" && (
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
                  <h3 className="text-md font-semibold">Manager Approval</h3>
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
                      onChange={(e) => setManagerComment(e.target.value)}
                      className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="manager-signature"
                      checked={managerSignature}
                      onChange={(e) => setManagerSignature(e.target.checked)}
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
                      , electronically sign and approve this submission.
                    </label>
                  </div>
                </div>
              </div>
            )}
        </div>

        <div className="w-full flex flex-row justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
          <Button
            size={"sm"}
            onClick={closeModal}
            variant="outline"
            className="bg-gray-100 text-gray-800 hover:bg-gray-50 hover:text-gray-800"
          >
            Cancel
          </Button>
          <Button
            size={"sm"}
            onClick={saveChanges}
            variant="outline"
            className={`${
              formSubmission?.status === "PENDING"
                ? "bg-sky-500 text-white hover:bg-sky-400 hover:text-white"
                : "bg-sky-500 text-white hover:bg-sky-400 hover:text-white"
            }`}
            disabled={
              formSubmission?.status === "PENDING" &&
              !managerSignature &&
              formTemplate?.isApprovalRequired
            }
          >
            {formSubmission?.status === "PENDING"
              ? "Approve Submission"
              : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
