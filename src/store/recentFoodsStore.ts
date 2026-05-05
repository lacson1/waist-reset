import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { FoodRow } from '../domain/foods'

export const RECENT_FOODS_STORAGE_KEY = 'vat_recent_foods_v1'

const RECENT_FOODS_LIMIT = 5

export interface RecentFoodsStore {
  recent: FoodRow[]
  /** Most-recent first; identity is `name + qty`. Pushes to front, dedupes, caps. */
  pushRecent: (food: FoodRow) => void
  clearRecent: () => void
}

function recentKey(f: { n: string; qty: string }): string {
  return `${f.n}\u0000${f.qty}`
}

export const useRecentFoodsStore = create<RecentFoodsStore>()(
  persist(
    (set, get) => ({
      recent: [],
      pushRecent: (food) => {
        const key = recentKey(food)
        const next = [food, ...get().recent.filter((r) => recentKey(r) !== key)]
        set({ recent: next.slice(0, RECENT_FOODS_LIMIT) })
      },
      clearRecent: () => set({ recent: [] }),
    }),
    {
      name: RECENT_FOODS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ recent: s.recent }),
    },
  ),
)
