"use client";
import { useState, useEffect } from "react";
import { deleteCrew } from "@/app/lib/actions/adminActions";
import { apiRequest } from "@/app/lib/utils/api-Utils";

export interface CrewData {
  id: string;
  name: string;
  leadId: string;
  crewType: "MECHANIC" | "TRUCK_DRIVER" | "LABOR" | "TASCO" | "";
  createdAt: Date;
  Users: {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    secondLastName: string | null;
    image: string | null;
  }[];
}

export const useCrewsData = () => {
  const [crew, setCrew] = useState<CrewData[]>([]);
  //   // State for modals
  const [editCrewModal, setEditCrewModal] = useState(false);
  const [createCrewModal, setCreateCrewModal] = useState(false);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);

  // State for delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // debounced value
  const [searchInput, setSearchInput] = useState<string>(""); // immediate input

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const rerender = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        let url = "";
        const encodedSearch = encodeURIComponent(searchTerm);
        if (showInactive) {
          url = `/api/v1/admins/personnel/getAllCrews?status=inactive${
            searchTerm ? `&search=${encodedSearch}` : ""
          }`;
        } else {
          url = `/api/v1/admins/personnel/getAllCrews?page=${page}&pageSize=${pageSize}${
            searchTerm ? `&search=${encodedSearch}` : ""
          }`;
        }
        const data = await apiRequest(url, "GET");
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
        setCrew(data.crews || data || []);
      } catch (error) {
        console.error("Failed to fetch crew details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [refreshKey, page, pageSize, showInactive, searchTerm]);

  const openHandleEdit = (id: string) => {
    setPendingEditId(id);
    setEditCrewModal(true);
  };

  const openHandleDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId) {
      await deleteCrew(pendingDeleteId);
      setShowDeleteDialog(false);
      setPendingDeleteId(null);
      rerender();
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setPendingDeleteId(null);
  };

  // Reset to page 1 if search or filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, showInactive]);

  return {
    loading,
    crew,
    total,
    totalPages,
    page,
    pageSize,
    setPage,
    setPageSize,
    showInactive,
    searchTerm: searchInput,
    setSearchTerm: setSearchInput,
    rerender,
    editCrewModal,
    setEditCrewModal,
    createCrewModal,
    setCreateCrewModal,
    pendingEditId,
    showDeleteDialog,
    setShowDeleteDialog,
    openHandleEdit,
    openHandleDelete,
    confirmDelete,
    cancelDelete,
  };
};
