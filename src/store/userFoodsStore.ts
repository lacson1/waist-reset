import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { FoodRow } from '../domain/foods'

export const USER_FOODS_STORAGE_KEY = 'vat_user_foods_v1'

export interface UserFoodEntry {
  id: string
  row: FoodRow
}

interface UserFoodsStore {
  entries: UserFoodEntry[]
  addEntry: (row: FoodRow) => UserFoodEntry
  removeEntry: (id: string) => void
  clearAll: () => void
}

export const useUserFoodsStore = create<UserFoodsStore>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (row) => {
        const id =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `uf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
        const entry: UserFoodEntry = { id, row: { ...row } }
        set({ entries: [...get().entries, entry] })
        return entry
      },

      removeEntry: (id) => {
        set({ entries: get().entries.filter((e) => e.id !== id) })
      },

      clearAll: () => set({ entries: [] }),
    }),
    {
      name: USER_FOODS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ entries: s.entries }),
    },
  ),
)
