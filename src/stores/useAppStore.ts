import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface ViewerPrefs {
  showPageNum: boolean
}

interface UIState {
  sidebarOpen: boolean
}

interface AppState {
  viewer: ViewerPrefs
  ui: UIState
}

interface AppActions {
  togglePageNum: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState & AppActions>()(
  immer((set) => ({
    viewer: {
      showPageNum: true,
    },
    ui: {
      sidebarOpen: true,
    },

    togglePageNum: () =>
      set((state) => {
        state.viewer.showPageNum = !state.viewer.showPageNum
      }),

    setSidebarOpen: (open) =>
      set((state) => {
        state.ui.sidebarOpen = open
      }),

    toggleSidebar: () =>
      set((state) => {
        state.ui.sidebarOpen = !state.ui.sidebarOpen
      }),
  })),
)
