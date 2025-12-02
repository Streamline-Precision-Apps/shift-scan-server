"use client";
import { Button } from "@/app/v1/components/ui/button";
import { useFormsList } from "./_components/Table/hooks/useFormsList";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/v1/components/ui/dialog";
import { ExportModal } from "./_components/Table/exportModal";

import Spinner from "@/app/v1/components/(animations)/spinner";
import SearchBarPopover from "../_pages/searchBarPopover";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/app/v1/components/ui/tooltip";
import { PageHeaderContainer } from "../_pages/PageHeaderContainer";
import { FooterPagination } from "../_pages/FooterPagination";
import { FormsDataTable } from "./_components/Table/FormsDataTable";
import FormsFilters from "./_components/Table/FormsFilters";

export interface FormItem {
  id: string;
  name: string;
  description: string | null;
  formType: string;
  _count: {
    Submissions: number;
  };
  isActive: "ACTIVE" | "DRAFT" | "ARCHIVED" | string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function Forms() {
  const {
    inputValue,
    setInputValue,
    formType,
    setFormType,
    loading,
    page,
    pageSize,
    totalPages,
    total,
    setPage,
    setPageSize,
    filteredForms,
    refetch,
    setForms,
    rerender,
    handleClearFilters,
    filters,
    setFilters,
    reFilterPage,
    // Dialog and helpers
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
  } = useFormsList();

  // Helper to get enum values as array of { value, label }
  const formTemplateCategoryValues = [
    "MAINTENANCE",
    "GENERAL",
    "SAFETY",
    "INSPECTION",
    "INCIDENT",
    "FINANCE",
    "OTHER",
    "HR",
    "OPERATIONS",
    "COMPLIANCE",
    "CLIENTS",
    "IT",
  ].map((v) => ({ value: v, label: v }));

  // Main render
  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-5">
      <PageHeaderContainer
        loading={loading}
        headerText="Forms Management"
        descriptionText="Create, manage, and track form templates and submissions"
        refetch={() => {
          refetch();
        }}
      />

      <div className="h-10 w-full flex flex-row justify-between gap-4">
        <div className="flex flex-row w-full gap-2">
          <SearchBarPopover
            term={inputValue}
            handleSearchChange={(e) => setInputValue(e.target.value)}
            placeholder={"Search by form name..."}
            textSize="xs"
            imageSize="10"
          />
          <div className="relative flex items-center">
            <FormsFilters
              filters={filters}
              onFilterChange={setFilters}
              setFilters={setFilters}
              onUseFiltersChange={reFilterPage}
              handleClearFilters={handleClearFilters}
              formTemplateCategoryValues={formTemplateCategoryValues}
            />
          </div>
        </div>
        <div className="h-full flex flex-row gap-4 ">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/admins/forms/create`}>
                <Button size={"icon"} className="h-full min-w-12">
                  <img
                    src="/plus-white.svg"
                    alt="Create New Form"
                    className="h-4 w-4 "
                  />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Create Form Template</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="h-[85vh] rounded-lg w-full relative bg-white overflow-hidden">
        <div className="h-full w-full overflow-auto pb-10">
          <FormsDataTable
            data={filteredForms}
            loading={loading}
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            searchTerm={inputValue}
            setPage={setPage}
            setPageSize={setPageSize}
            openHandleDelete={openHandleDelete}
            handleShowExportModal={handleShowExportModal}
            openHandleArchive={handleArchiveForm}
            openHandleUnarchive={handleUnarchiveForm}
          />
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-row items-center gap-2 justify-center bg-white bg-opacity-70 rounded-lg">
              <Spinner size={20} />
              <span className="text-lg text-gray-500">Loading...</span>
            </div>
          )}
          <div className="flex items-center justify-end space-x-2 py-4 ">
            <FooterPagination
              page={loading ? 1 : page}
              totalPages={loading ? 1 : totalPages}
              total={loading ? 0 : total}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          </div>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form Template?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this form template? All form data
              will be permanently deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Archive Confirmation Dialog */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Form Template?</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this form template? All form data
              will be preserved, but the template will be hidden from the main
              view.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelArchive}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmArchive}>
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Unarchive Confirmation Dialog */}
      <Dialog open={showUnarchiveDialog} onOpenChange={setShowUnarchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unarchive Form Template?</DialogTitle>
            <DialogDescription>
              Are you sure you want to unarchive this form template? It will be
              restored to active status and visible in the main view.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelUnarchive}>
              Cancel
            </Button>
            <Button variant="default" onClick={confirmUnarchive}>
              Unarchive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          setDateRange={setDateRange}
          dateRange={dateRange}
          onClose={closeExportModal}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
