import { create } from "zustand"

export type TabId =
  | "strategy"
  | "calendar"
  | "production"
  | "publish"
  | "analytics"
  | "advertising"
  | "ad-performance"

type NavigationStore = {
  activeTab: TabId
  unlockedTabs: TabId[]
  setActiveTab: (tab: TabId) => void
  unlockTab: (tab: TabId) => void
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  activeTab: "strategy",
  unlockedTabs: ["strategy"],

  setActiveTab: (tab) => {
    set({ activeTab: tab })
  },

  unlockTab: (tab) => {
    set((state) => {
      if (state.unlockedTabs.includes(tab)) return state
      return { unlockedTabs: [...state.unlockedTabs, tab] }
    })
  },
}))
