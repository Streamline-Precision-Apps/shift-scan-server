import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CookieStoreState {
  currentPageView: string;
  workRole: string;
  laborType: string;
  setCurrentPageView: (view: string) => void;
  setWorkRole: (role: string) => void;
  setLaborType: (labor: string) => void;
  reset: () => void;
}

export const useCookieStore = create<CookieStoreState>()(
  persist(
    (set) => ({
      currentPageView: "",
      workRole: "",
      laborType: "",
      setCurrentPageView: (view) => set({ currentPageView: view }),
      setWorkRole: (role) => set({ workRole: role }),
      setLaborType: (labor) => set({ laborType: labor }),
      reset: () =>
        set({
          currentPageView: "",
          workRole: "",
          laborType: "",
        }),
    }),
    {
      name: "cookie-store", // localStorage key
    }
  )
);
