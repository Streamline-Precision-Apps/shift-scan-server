import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FormAndDocumentUiStateManagement {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedFilterTeamSubmissions: string;
  selectedFilterMyForms: string;
  setSelectedFilterTeamSubmissions: (filter: string) => void;
  setSelectedFilterMyForms: (filter: string) => void;
  // Add more UI state as needed
}

export const useFormAndDocumentUiStateManagement =
  create<FormAndDocumentUiStateManagement>()(
    persist(
      (set) => ({
        selectedTab: "received", // default tab
        setSelectedTab: (tab) => set({ selectedTab: tab }),
        selectedFilterMyForms: "all", // default filter
        selectedFilterTeamSubmissions: "all", // default filter
        setSelectedFilterTeamSubmissions: (filter) =>
          set({ selectedFilterTeamSubmissions: filter }),
        setSelectedFilterMyForms: (filter) =>
          set({ selectedFilterMyForms: filter }),
      }),
      {
        name: "form-and-document-ui-state", // storage key
      }
    )
  );
