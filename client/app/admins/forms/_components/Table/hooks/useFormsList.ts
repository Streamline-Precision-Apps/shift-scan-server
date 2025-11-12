"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import type { FormTemplate } from "./types";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/app/admins/_pages/sidebar/DashboardDataContext";
import { apiRequest } from "@/app/lib/utils/api-Utils";

/**
 * Custom hook to manage fetching, filtering, and paginating forms for the List view.
 * Handles loading, error, search, filter, and pagination state.
 */

export type FormTemplateCategory =
  | "MAINTENANCE"
  | "GENERAL"
  | "SAFETY"
  | "INSPECTION"
  | "INCIDENT"
  | "FINANCE"
  | "OTHER"
  | "HR"
  | "OPERATIONS"
  | "COMPLIANCE"
  | "CLIENTS"
  | "IT";

export type FormTypeFilter = FormTemplateCategory | "ALL";

interface FilterOptions {
  formType: string[];
  status: string[];
}
export function useFormsList() {
  const { refresh } = useDashboardData();
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formType, setFormType] = useState<FormTypeFilter>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const [refilterKey, setRefilterKey] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const rerender = useCallback(() => {
    setRefreshKey((k) => k + 1);
    refresh();
  }, [refresh]);

  const [filters, setFilters] = useState<FilterOptions>({
    formType: [],
    status: [],
  });

  const reFilterPage = useCallback(() => {
    setRefilterKey((k) => k + 1);
  }, []);

  const handleClearFilters = async () => {
    // First clear the URL
    router.replace("/admins/forms");

    // Reset all filter-related states
    setFilters({
      formType: [],
      status: [],
    });
    setFormType("ALL");
    setPage(1);

    // Trigger immediate refetch
    setRefilterKey((k) => k + 1);
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const buildFilterQuery = () => {
    const params = new URLSearchParams();

    // Form Type
    if (filters.formType && filters.formType.length > 0) {
      filters.formType.forEach((type) => {
        // Skip if type is "ALL"
        if (type !== "ALL") {
          params.append("formType", type);
        }
      });
    }

    // Status (array)
    if (filters.status && filters.status.length > 0) {
      filters.status.forEach((status) => {
        params.append("status", status);
      });
    }

    return params.toString();
  };

  async function fetchForms() {
    setLoading(true);
    setError(null);
    try {
      const filterQuery = buildFilterQuery();
      const encodedSearch = encodeURIComponent(searchTerm.trim());
      const result = await apiRequest(
        `/api/v1/admins/forms/template?page=${page}&pageSize=${pageSize}&search=${encodedSearch}${
          filterQuery ? `&${filterQuery}` : ""
        }`,
        "GET"
      );
      setForms(result.data as FormTemplate[]);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load forms");
    } finally {
      setLoading(false);
    }
  }

  // Effect to handle filters and fetching
  useEffect(() => {
    fetchForms();
  }, [page, pageSize, searchTerm, refilterKey, refreshKey]);

  // Get unique form types from the current forms
  const formTypes = useMemo(() => {
    const types = new Set<string>();
    forms.forEach((form) => {
      if (form.formType) types.add(form.formType);
    });
    return Array.from(types).sort();
  }, [forms]);

  // Filter by search and formType
  const filteredForms = useMemo(() => {
    return forms
      .filter((form) => {
        const matchesName = searchTerm.trim()
          ? form.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
          : true;
        const matchesType =
          formType === "ALL" ? true : form.formType === formType;
        return matchesName && matchesType;
      })
      .map((form) => ({
        id: form.id,
        name: form.name,
        description: form.description,
        formType: form.formType || "UNKNOWN",
        _count: form._count,
        isActive: form.isActive,
        createdAt: form.createdAt || new Date().toISOString(),
        updatedAt: form.updatedAt || new Date().toISOString(),
      }));
  }, [forms, searchTerm, formType]);

  // Dialog state management
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingArchiveId, setPendingArchiveId] = useState<string | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false);
  const [pendingUnarchiveId, setPendingUnarchiveId] = useState<string | null>(
    null
  );
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportingFormId, setExportingFormId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  // Helper functions for archive, unarchive, delete, export
  const handleUnarchiveForm = useCallback((formId: string) => {
    setPendingUnarchiveId(formId);
    setShowUnarchiveDialog(true);
  }, []);

  const handleUnarchive = useCallback(async (formId: string) => {
    try {
      const { publishFormTemplate } = await import(
        "@/app/lib/actions/adminActions"
      );
      await publishFormTemplate(formId);
      setForms((prevForms) =>
        prevForms.map((form) =>
          form.id === formId ? { ...form, isActive: "ACTIVE" } : form
        )
      );
    } catch (error) {
      // error handling can be done in the page
    }
  }, []);

  const confirmUnarchive = useCallback(async () => {
    if (pendingUnarchiveId) {
      await handleUnarchive(pendingUnarchiveId);
      setShowUnarchiveDialog(false);
      setPendingUnarchiveId(null);
    }
  }, [pendingUnarchiveId, handleUnarchive]);

  const cancelUnarchive = useCallback(() => {
    setShowUnarchiveDialog(false);
    setPendingUnarchiveId(null);
  }, []);

  const handleArchive = useCallback(async (formId: string) => {
    try {
      const { archiveFormTemplate } = await import(
        "@/app/lib/actions/adminActions"
      );
      await archiveFormTemplate(formId);
      setForms((prevForms) =>
        prevForms.map((form) =>
          form.id === formId ? { ...form, isActive: "ARCHIVED" } : form
        )
      );
    } catch (error) {
      // error handling can be done in the page
    }
  }, []);

  const handleArchiveForm = useCallback((formId: string) => {
    setPendingArchiveId(formId);
    setShowArchiveDialog(true);
  }, []);

  const confirmArchive = useCallback(async () => {
    if (pendingArchiveId) {
      await handleArchive(pendingArchiveId);
      setShowArchiveDialog(false);
      setPendingArchiveId(null);
    }
  }, [pendingArchiveId, handleArchive]);

  const cancelArchive = useCallback(() => {
    setShowArchiveDialog(false);
    setPendingArchiveId(null);
  }, []);

  const handleDelete = useCallback(async (submissionId: string) => {
    try {
      const { deleteFormTemplate } = await import(
        "@/app/lib/actions/adminActions"
      );
      const isDeleted = await deleteFormTemplate(submissionId);
      if (isDeleted) {
        setForms((prevForms) =>
          prevForms.map((form) =>
            form.id === submissionId ? { ...form, isActive: "ACTIVE" } : form
          )
        );
      }
    } catch (error) {
      // error handling can be done in the page
    }
  }, []);

  const openHandleDelete = useCallback((id: string) => {
    setPendingDeleteId(id);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (pendingDeleteId) {
      await handleDelete(pendingDeleteId);
      setShowDeleteDialog(false);
      setPendingDeleteId(null);
    }
  }, [pendingDeleteId, handleDelete]);

  const cancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
    setPendingDeleteId(null);
  }, []);

  const handleShowExportModal = useCallback((id: string) => {
    setExportingFormId(id);
    setShowExportModal(true);
  }, []);

  const handleExport = useCallback(
    async (exportFormat = "xlsx") => {
      if (exportingFormId) {
        try {
          const { getFormTemplate, getFormSubmissions } = await import(
            "@/app/lib/actions/adminActions"
          );
          const template = await getFormTemplate(exportingFormId);
          const submissions = await getFormSubmissions(exportingFormId, {
            from: dateRange.from,
            to: dateRange.to,
          });
          if (!template || !template.FormGrouping) {
            return;
          }
          const groupings = template.FormGrouping;
          const fields = groupings
            .flatMap((group: { Fields?: any[] }) =>
              Array.isArray(group.Fields) ? group.Fields : []
            )
            .filter((field: any) => field && field.id && field.label);
          const headers = [
            "Submission ID",
            "Submitted By",
            "Submitted At",
            ...fields.map((field: any) => field.label),
          ];
          const rows = (submissions || []).map(
            (submission: Record<string, any>) => {
              const user = submission.User
                ? `${submission.User.firstName} ${submission.User.lastName}`
                : "";
              const submittedAt =
                (submission.submittedAt ? submission.submittedAt : "") ||
                (submission.createdAt ? submission.createdAt : "") ||
                "";
              return [
                submission.id,
                user,
                submittedAt,
                ...fields.map((field: any) => {
                  const value =
                    submission.data?.[
                      field.id as keyof typeof submission.data
                    ] ??
                    submission.data?.[
                      field.label as keyof typeof submission.data
                    ] ??
                    "";
                  if (field.type === "SEARCH_PERSON") {
                    if (Array.isArray(value)) {
                      return value
                        .map((v: any) => v?.name)
                        .filter(Boolean)
                        .join(", ");
                    }
                    if (typeof value === "object" && value !== null) {
                      return value.name || "";
                    }
                    return "";
                  }
                  if (field.type === "SEARCH_ASSET") {
                    if (Array.isArray(value)) {
                      return value
                        .map((v: any) => v?.name)
                        .filter(Boolean)
                        .join(", ");
                    }
                    if (typeof value === "object" && value !== null) {
                      return value.name || "";
                    }
                    return "";
                  }
                  if (typeof value === "object" && value !== null) {
                    if (Array.isArray(value)) {
                      return value.join(", ");
                    }
                    return JSON.stringify(value);
                  }
                  return value;
                }),
              ];
            }
          );
          const exportData = [headers, ...rows];
          if (exportFormat === "csv") {
            const csv = exportData
              .map((row) =>
                row
                  .map(
                    (cell: unknown) =>
                      `"${String(cell ?? "").replace(/"/g, '""')}"`
                  )
                  .join(",")
              )
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const { saveAs } = await import("file-saver");
            saveAs(
              blob,
              `form_submissions_${new Date().toISOString().slice(0, 10)}.csv`
            );
          } else {
            const { utils, write } = await import("xlsx");
            const ws = utils.aoa_to_sheet(exportData);
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, "Form Submissions");
            const wbout = write(wb, { bookType: "xlsx", type: "array" });
            const blob = new Blob([wbout], {
              type: "application/octet-stream",
            });
            const { saveAs } = await import("file-saver");
            saveAs(
              blob,
              `form_submissions_${new Date().toISOString().slice(0, 10)}.xlsx`
            );
          }
        } catch (error) {
          // error handling can be done in the page
        } finally {
          setShowExportModal(false);
          setExportingFormId(null);
        }
      }
    },
    [exportingFormId, dateRange]
  );

  const closeExportModal = useCallback(() => {
    setShowExportModal(false);
    setExportingFormId(null);
  }, []);

  return {
    forms,
    filteredForms,
    loading,
    error,
    inputValue,
    setInputValue,
    formType,
    setFormType,
    formTypes,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    total,
    refetch: fetchForms,
    setForms,
    rerender,
    handleClearFilters,
    filters,
    setFilters,
    reFilterPage,
    // Dialog and helper exports
    showDeleteDialog,
    setShowDeleteDialog,
    pendingDeleteId,
    setPendingDeleteId,
    pendingArchiveId,
    setPendingArchiveId,
    showArchiveDialog,
    setShowArchiveDialog,
    showUnarchiveDialog,
    setShowUnarchiveDialog,
    pendingUnarchiveId,
    setPendingUnarchiveId,
    showExportModal,
    setShowExportModal,
    exportingFormId,
    setExportingFormId,
    dateRange,
    setDateRange,
    handleUnarchiveForm,
    confirmUnarchive,
    cancelUnarchive,
    handleArchiveForm,
    confirmArchive,
    cancelArchive,
    openHandleDelete,
    confirmDelete,
    cancelDelete,
    handleShowExportModal,
    handleExport,
    closeExportModal,
  };
}
