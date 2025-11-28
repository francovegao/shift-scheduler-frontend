import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectedCompanyState {
  currentCompanyId: string | null;
  setCompany: (id: string | null) => void;
  clearCompany: () => void;
}

export const useSelectedCompany = create<SelectedCompanyState>()(
  persist(
    (set) => ({
      currentCompanyId: null,

      setCompany: (id) => set({ currentCompanyId: id }),

      clearCompany: () => set({ currentCompanyId: null }),
    }),
    {
      name: "selected-company",
    }
  )
);
