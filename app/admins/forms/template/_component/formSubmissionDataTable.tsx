"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/v1/components/ui/table";

import React, { Dispatch, SetStateAction, useMemo, Suspense } from "react";
import { getFormSubmissionTableColumns } from "./formSubmissionTableColumns";
import LoadingFormSubmissionTableState from "./loadingFormSubmissionTableState";
import { FormTemplate } from "@/app/lib/types/forms";
import { FormIndividualTemplate, Submission } from "./hooks/types";

interface FormsDataTableProps {
  formTemplate?: FormTemplate;
  formSubmissions?: FormIndividualTemplate;
  loading: boolean;
  page: number;
  pageSize: number;
  inputValue?: string;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  isSignatureRequired?: boolean;
  setShowFormSubmission: Dispatch<SetStateAction<boolean>>;
  setSelectedSubmissionId: Dispatch<SetStateAction<number | null>>;
  openHandleDeleteSubmission: (id: number) => void;
  searchTerm?: string;
  showPendingOnly: boolean;
  onApprovalAction: (id: number, action: "APPROVED" | "REJECTED") => void;
}

export function FormSubmissionDataTable({
  formTemplate,
  formSubmissions,
  loading,
  page,
  pageSize,
  inputValue,
  setPage,
  setPageSize,
  isSignatureRequired,
  setShowFormSubmission,
  setSelectedSubmissionId,
  openHandleDeleteSubmission,
  searchTerm = "",
  showPendingOnly,
  onApprovalAction,
}: FormsDataTableProps) {
  // Flatten all fields from all groupings, ordered
  type Field = {
    id: string;
    label: string;
    type: string;
    order: number;
  };
  const fields = useMemo(() => {
    if (!formSubmissions?.FormGrouping) return [] as Field[];
    return formSubmissions.FormGrouping.flatMap(
      (g: { Fields: Field[] }) => g.Fields
    ).sort((a: Field, b: Field) => a.order - b.order);
  }, [formSubmissions]);

  // Use the DRY column generator
  const columns = useMemo(
    () =>
      getFormSubmissionTableColumns({
        fields,
        isSignatureRequired,
        searchTerm,
        setShowFormSubmission,
        setSelectedSubmissionId,
        openHandleDeleteSubmission,
        showPendingOnly,
        onApprovalAction,
      }),
    [
      fields,
      isSignatureRequired,
      searchTerm,
      setShowFormSubmission,
      setSelectedSubmissionId,
      openHandleDeleteSubmission,
      showPendingOnly,
      onApprovalAction,
    ]
  );

  const table = useReactTable({
    data: formSubmissions?.Submissions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1, // TanStack Table uses 0-indexed pages
        pageSize,
      },
    },
    manualPagination: true, // Tell TanStack Table we're handling pagination manually
    pageCount: formSubmissions?.totalPages || 1, // Important for proper page count display
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize })
          : updater;

      setPage(newState.pageIndex + 1);
      if (newState.pageSize !== pageSize) {
        setPageSize(newState.pageSize);
      }
    },
  });

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="flex-1 overflow-visible pb-[50px]">
        <div className="rounded-md w-full h-full relative">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="whitespace-nowrap font-semibold text-gray-700 text-center border-r bg-gray-100 border-gray-200 last:border-r-0 text-xs sticky top-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="h-full divide-y divide-gray-200 bg-white">
              <Suspense
                fallback={
                  <LoadingFormSubmissionTableState
                    columnsCount={columns.length}
                  />
                }
              >
                {loading ? (
                  <LoadingFormSubmissionTableState
                    columnsCount={columns.length}
                  />
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="odd:bg-white even:bg-gray-100 border-r border-gray-200 text-xs text-center py-2"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="whitespace-nowrap border-r border-gray-200 text-xs text-center px-3 py-2"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[74vh] text-center"
                    ></TableCell>
                  </TableRow>
                )}
              </Suspense>
            </TableBody>
          </Table>
          {!loading &&
            ((Array.isArray(formSubmissions) && formSubmissions.length === 0) ||
              (formSubmissions &&
                Array.isArray(formSubmissions.Submissions) &&
                formSubmissions.Submissions.length === 0)) && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-row items-center gap-2 justify-center rounded-lg">
                <span className="text-lg text-gray-500">
                  No submissions found.
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
