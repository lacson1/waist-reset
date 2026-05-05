import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { FoodTypeKind } from '../components/plate/FoodTypeIcon'
import type { FoodBranchFilter, FoodSortKey } from '../domain/foodSearch'

export const FOOD_SEARCH_PREFS_STORAGE_KEY = 'vat_food_search_prefs_v1'

const VALID_KINDS: ReadonlySet<FoodTypeKind> = new Set([
  'protein',
  'fibre',
  'leafy',
  'volume',
  'thermo',
  'fat',
  'ferment',
  'vat',
  'default',
])

const VALID_BRANCH: ReadonlySet<FoodBranchFilter> = new Set([
  'all',
  'General',
  'African',
])

const VALID_SORT: ReadonlySet<FoodSortKey> = new Set([
  'relevance',
  'name',
  'kcal-asc',
  'protein-desc',
])

export interface FoodSearchPrefsStore {
  /** Persisted across navigation; not the live query string. */
  categories: FoodTypeKind[]
  branch: FoodBranchFilter
  fitsSlot: boolean
  sort: FoodSortKey
  setCategories: (kinds: FoodTypeKind[]) => void
  setBranch: (b: FoodBranchFilter) => void
  setFitsSlot: (v: boolean) => void
  setSort: (s: FoodSortKey) => void
  reset: () => void
}

const DEFAULTS = {
  categories: [] as FoodTypeKind[],
  branch: 'all' as FoodBranchFilter,
  fitsSlot: false,
  sort: 'relevance' as FoodSortKey,
}

export const useFoodSearchPrefsStore = create<FoodSearchPrefsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setCategories: (kinds) =>
        set({ categories: kinds.filter((k) => VALID_KINDS.has(k)) }),
      setBranch: (b) => set({ branch: VALID_BRANCH.has(b) ? b : 'all' }),
      setFitsSlot: (v) => set({ fitsSlot: !!v }),
      setSort: (s) => set({ sort: VALID_SORT.has(s) ? s : 'relevance' }),
      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name: FOOD_SEARCH_PREFS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        categories: s.categories,
        branch: s.branch,
        fitsSlot: s.fitsSlot,
        sort: s.sort,
      }),
    },
  ),
)
