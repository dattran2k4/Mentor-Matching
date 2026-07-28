import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
const useAuthStore = create()(
  persist(
    (set) => ({
      accessToken: null,
      hasHydrated: false,
      setAccessToken: (token) => set({ accessToken: token }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      logout: () => set({ accessToken: null })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (state) => ({
        accessToken: state.accessToken
      })
    }
  )
)
export { useAuthStore }
