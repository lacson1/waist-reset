import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { FoodRow } from '../domain/foods'
import {
  type HealthFocus,
  type MealLineItem,
  type MealSlot,
  type MealTemplate,
  DEFAULT_ACTIVE_SLOT,
  isHealthFocus,
  isValidSlotForTemplate,
  newLineId,
  slotsForTemplate,
} from '../domain/plateMeal'

export const PLATE_BUILDER_STORAGE_KEY = 'vat_plate_builder_v1'

interface PlateBuilderStore {
  template: MealTemplate
  healthFocus: HealthFocus
  activeSlot: MealSlot
  items: MealLineItem[]
  setTemplate: (t: MealTemplate) => void
  setHealthFocus: (h: HealthFocus) => void
  setActiveSlot: (s: MealSlot) => void
  addFoodItem: (slot: MealSlot, food: FoodRow, portion?: number) => void
  addCustomItem: (
    slot: MealSlot,
    custom: { label: string; kcal: number; p: number; f: number; c: number },
    portion?: number,
  ) => void
  removeItem: (id: string) => void
  setPortion: (id: string, portion: number) => void
  clearItems: () => void
  /** Template rest, focus weight, default wedge, empty lines (persisted). */
  resetBuilder: () => void
  /**
   * Replace worksheet with a scenario preset: template + custom lines per wedge.
   * Skips any line whose slot is not valid for the preset template.
   */
  applyPlatePreset: (input: {
    template: MealTemplate
    lines: Array<{
      slot: MealSlot
      label: string
      kcal: number
      p: number
      f: number
      c: number
      portion?: number
    }>
  }) => void
}

function coerceSlotForTemplate(t: MealTemplate, slot: MealSlot): MealSlot {
  return isValidSlotForTemplate(t, slot) ? slot : DEFAULT_ACTIVE_SLOT[t]
}

export const usePlateBuilderStore = create<PlateBuilderStore>()(
  persist(
    (set, get) => ({
      template: 'rest',
      healthFocus: 'weight',
      activeSlot: DEFAULT_ACTIVE_SLOT.rest,
      items: [],

      setTemplate: (t) => {
        const prev = get().template
        if (prev === t) return
        const active = coerceSlotForTemplate(t, get().activeSlot)
        const valid = new Set(slotsForTemplate(t) as string[])
        set({
          template: t,
          activeSlot: active,
          items: get().items.filter((it) => valid.has(it.slot)),
        })
      },

      setHealthFocus: (h) => set({ healthFocus: h }),

      setActiveSlot: (s) => {
        const t = get().template
        if (isValidSlotForTemplate(t, s)) set({ activeSlot: s })
      },

      addFoodItem: (slot, food, portion = 1) => {
        const t = get().template
        if (!isValidSlotForTemplate(t, slot)) return
        const item: MealLineItem = {
          id: newLineId(),
          slot,
          source: 'food',
          foodSnapshot: { ...food },
          portion,
        }
        set({ items: [...get().items, item] })
      },

      addCustomItem: (slot, custom, portion = 1) => {
        const t = get().template
        if (!isValidSlotForTemplate(t, slot)) return
        const item: MealLineItem = {
          id: newLineId(),
          slot,
          source: 'custom',
          custom: { ...custom },
          portion,
        }
        set({ items: [...get().items, item] })
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      setPortion: (id, portion) => {
        const p = Math.max(0.1, Math.min(10, portion))
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, portion: p } : i)),
        })
      },

      clearItems: () => set({ items: [] }),

      resetBuilder: () =>
        set({
          template: 'rest',
          healthFocus: 'weight',
          activeSlot: DEFAULT_ACTIVE_SLOT.rest,
          items: [],
        }),

      applyPlatePreset: ({ template: t, lines }) => {
        const valid = new Set(slotsForTemplate(t) as string[])
        const items: MealLineItem[] = []
        for (const line of lines) {
          if (!valid.has(line.slot as string)) continue
          items.push({
            id: newLineId(),
            slot: line.slot,
            source: 'custom',
            custom: {
              label: line.label,
              kcal: line.kcal,
              p: line.p,
              f: line.f,
              c: line.c,
            },
            portion: line.portion ?? 1,
          })
        }
        const firstSlot = items[0]?.slot
        const active =
          firstSlot != null && valid.has(firstSlot as string)
            ? firstSlot
            : DEFAULT_ACTIVE_SLOT[t]
        set({ template: t, items, activeSlot: active })
      },
    }),
    {
      name: PLATE_BUILDER_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        template: s.template,
        healthFocus: s.healthFocus,
        activeSlot: s.activeSlot,
        items: s.items,
      }),
      merge: (persistedState, currentState) => {
        const merged = {
          ...currentState,
          ...(persistedState as object),
        } as PlateBuilderStore
        if (!isHealthFocus(merged.healthFocus)) merged.healthFocus = 'weight'
        return merged
      },
    },
  ),
)
