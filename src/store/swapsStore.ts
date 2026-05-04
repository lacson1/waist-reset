import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const SWAPS_STORAGE_KEY = 'wr_swaps_v1'

interface SwapsStore {
  adopted: string[]
  shoppingExtras: string[]
  toggleAdopted: (id: string) => void
  isAdopted: (id: string) => boolean
  addToShopping: (item: string) => void
  removeFromShopping: (item: string) => void
  clearShoppingExtras: () => void
}

export const useSwapsStore = create<SwapsStore>()(
  persist(
    (set, get) => ({
      adopted: [],
      shoppingExtras: [],

      toggleAdopted: (id) => {
        const cur = get().adopted
        const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
        set({ adopted: next })
      },

      isAdopted: (id) => get().adopted.includes(id),

      addToShopping: (item) => {
        const trimmed = item.trim()
        if (!trimmed) return
        const cur = get().shoppingExtras
        if (cur.includes(trimmed)) return
        set({ shoppingExtras: [...cur, trimmed] })
      },

      removeFromShopping: (item) => {
        set({ shoppingExtras: get().shoppingExtras.filter((x) => x !== item) })
      },

      clearShoppingExtras: () => set({ shoppingExtras: [] }),
    }),
    {
      name: SWAPS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ adopted: s.adopted, shoppingExtras: s.shoppingExtras }),
    },
  ),
)

export function swapId(categoryId: string, instead: string): string {
  return `cat:${categoryId}:${instead}`
}

export function topSwapId(rank: number): string {
  return `top:${rank}`
}
