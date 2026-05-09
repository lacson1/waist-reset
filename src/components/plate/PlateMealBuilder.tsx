import { useCallback, useEffect, useMemo, useState } from "react";
import type { Baseline } from "../../types/progress";
import { useFoods } from "../../domain/foods";
import {
  type MealLineItem,
  type MealSlot,
  type MealTemplate,
  DEFAULT_ACTIVE_SLOT,
  compareToPhase,
  mealFocusNarrative,
  slotLabel,
  slotsForTemplate,
  sumMacros,
} from "../../domain/plateMeal";
import { usePlateBuilderStore } from "../../store/plateBuilderStore";
import type { HealthFocus } from "../../domain/plateMeal";
import { todayIsoDate, useMealLogStore } from "../../store/mealLogStore";
import { PlateConfirmDialog } from "./builder/PlateConfirmDialog";
import { PlateMealBuilderIntro } from "./builder/PlateMealBuilderIntro";
import { PlateMealLines } from "./builder/PlateMealLines";
import { PlateMealPhotoAi } from "./builder/PlateMealPhotoAi";
import { PlateMealSources } from "./builder/PlateMealSources";
import { PlateMealTotals } from "./builder/PlateMealTotals";
import { PlateTemplatePicker } from "./builder/PlateTemplatePicker";
import { PlateVisual } from "./builder/PlateVisual";
import { PlateWedgeContext } from "./builder/PlateWedgeContext";

type BuilderSnapshot = Pick<
  ReturnType<typeof usePlateBuilderStore.getState>,
  "template" | "healthFocus" | "activeSlot" | "items"
>;

function captureBuilderSnapshot(): BuilderSnapshot {
  const st = usePlateBuilderStore.getState();
  return {
    template: st.template,
    healthFocus: st.healthFocus,
    activeSlot: st.activeSlot,
    items: st.items,
  };
}

function restoreBuilderSnapshot(snapshot: BuilderSnapshot): void {
  usePlateBuilderStore.setState(snapshot);
}

function builderSignature(
  template: MealTemplate,
  healthFocus: HealthFocus,
  activeSlot: MealSlot,
  items: MealLineItem[],
): string {
  return JSON.stringify({
    template,
    healthFocus,
    activeSlot,
    items: items.map((it) => ({
      id: it.id,
      slot: it.slot,
      source: it.source,
      portion: it.portion,
      food: it.foodSnapshot ? { n: it.foodSnapshot.n } : null,
      custom: it.custom,
    })),
  });
}

function sanitizeBuilderState() {
  const st = usePlateBuilderStore.getState();
  const { template, activeSlot, items } = st;
  const valid = new Set(slotsForTemplate(template) as string[]);
  const patch: Partial<{ activeSlot: MealSlot; items: MealLineItem[] }> = {};
  if (!valid.has(activeSlot)) patch.activeSlot = DEFAULT_ACTIVE_SLOT[template];
  const filtered = items.filter((it) => valid.has(it.slot));
  if (filtered.length !== items.length) patch.items = filtered;
  if (Object.keys(patch).length > 0) usePlateBuilderStore.setState(patch);
}

type Props = {
  phaseKcal: number | null;
  phaseKcalNote: string;
  targetProtein: number | null;
  baseline: Baseline | null;
};

export function PlateMealBuilder({
  phaseKcal,
  phaseKcalNote,
  targetProtein,
  baseline,
}: Props) {
  const {
    raw: foods,
    err: foodsErr,
    loading: foodsLoading,
    reload: reloadFoods,
  } = useFoods();
  const template = usePlateBuilderStore((s) => s.template);
  const healthFocus = usePlateBuilderStore((s) => s.healthFocus);
  const activeSlot = usePlateBuilderStore((s) => s.activeSlot);
  const items = usePlateBuilderStore((s) => s.items);
  const setTemplate = usePlateBuilderStore((s) => s.setTemplate);
  const setHealthFocus = usePlateBuilderStore((s) => s.setHealthFocus);
  const setActiveSlot = usePlateBuilderStore((s) => s.setActiveSlot);
  const addFoodItem = usePlateBuilderStore((s) => s.addFoodItem);
  const addCustomItem = usePlateBuilderStore((s) => s.addCustomItem);
  const removeItem = usePlateBuilderStore((s) => s.removeItem);
  const setPortion = usePlateBuilderStore((s) => s.setPortion);
  const clearItems = usePlateBuilderStore((s) => s.clearItems);
  const resetBuilder = usePlateBuilderStore((s) => s.resetBuilder);

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [savedMealBanner, setSavedMealBanner] = useState<string | null>(null);
  const [addedLineBanner, setAddedLineBanner] = useState<string | null>(null);
  const [undoBanner, setUndoBanner] = useState<{
    message: string;
    snapshot: BuilderSnapshot;
  } | null>(null);
  const [lastSavedSignature, setLastSavedSignature] = useState<string>(() =>
    builderSignature(
      usePlateBuilderStore.getState().template,
      usePlateBuilderStore.getState().healthFocus,
      usePlateBuilderStore.getState().activeSlot,
      usePlateBuilderStore.getState().items,
    ),
  );

  useEffect(() => {
    if (!savedMealBanner) return;
    const t = window.setTimeout(() => setSavedMealBanner(null), 5200);
    return () => window.clearTimeout(t);
  }, [savedMealBanner]);

  useEffect(() => {
    if (!addedLineBanner) return;
    const t = window.setTimeout(() => setAddedLineBanner(null), 2800);
    return () => window.clearTimeout(t);
  }, [addedLineBanner]);

  useEffect(() => {
    if (!undoBanner) return;
    const t = window.setTimeout(() => setUndoBanner(null), 6000);
    return () => window.clearTimeout(t);
  }, [undoBanner]);

  const handleSaveToToday = useCallback(() => {
    if (items.length === 0) return;
    const entry = useMealLogStore.getState().saveMeal({
      date: todayIsoDate(),
      template,
      healthFocus,
      items,
    });
    setLastSavedSignature(
      builderSignature(template, healthFocus, activeSlot, items),
    );
    setSavedMealBanner(`Saved to today — ${entry.label}.`);
  }, [activeSlot, healthFocus, items, template]);

  const handleTemplatePick = useCallback(
    (next: MealTemplate) => {
      if (next === template) return;
      setTemplate(next);
    },
    [setTemplate, template],
  );

  const openResetDialog = useCallback(() => setResetDialogOpen(true), []);
  const confirmResetDialog = useCallback(() => {
    const snapshot = captureBuilderSnapshot();
    resetBuilder();
    setUndoBanner({
      message: "Builder reset. Undo?",
      snapshot,
    });
    setResetDialogOpen(false);
  }, [resetBuilder]);

  const onPortionSlider = useCallback(
    (id: string, raw: string) => {
      const n = Number(raw);
      if (!Number.isFinite(n)) return;
      setPortion(id, Math.round(n * 10) / 10);
    },
    [setPortion],
  );

  useEffect(() => {
    sanitizeBuilderState();
    const unsub = usePlateBuilderStore.persist.onFinishHydration(() =>
      sanitizeBuilderState(),
    );
    return unsub;
  }, []);

  const totals = useMemo(() => sumMacros(items), [items]);
  const compare = useMemo(
    () => compareToPhase(totals, phaseKcal, targetProtein),
    [totals, phaseKcal, targetProtein],
  );
  const focusLines = useMemo(
    () => mealFocusNarrative(healthFocus, totals, compare, baseline),
    [healthFocus, totals, compare, baseline],
  );

  const activeWedgeLabel = useMemo(
    () => slotLabel(template, activeSlot),
    [template, activeSlot],
  );

  const currentSignature = useMemo(
    () => builderSignature(template, healthFocus, activeSlot, items),
    [activeSlot, healthFocus, items, template],
  );

  const isDirty = currentSignature !== lastSavedSignature;

  const handleClearWithUndo = useCallback(() => {
    if (items.length === 0) return;
    const snapshot = captureBuilderSnapshot();
    clearItems();
    setUndoBanner({
      message: "Meal lines cleared. Undo?",
      snapshot,
    });
  }, [clearItems, items.length]);

  const handleUndo = useCallback(() => {
    if (!undoBanner) return;
    restoreBuilderSnapshot(undoBanner.snapshot);
    setUndoBanner(null);
  }, [undoBanner]);

  const saveStateLabel =
    items.length === 0
      ? "No meal lines yet"
      : isDirty
      ? "Unsaved changes"
      : "Saved";
  const saveStateTone: "saved" | "unsaved" | "idle" =
    items.length === 0 ? "idle" : isDirty ? "unsaved" : "saved";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const inEditable =
        !!target &&
        (target.closest("input, textarea, select, [contenteditable='true']") != null ||
          target.isContentEditable);
      if (inEditable || event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.toLowerCase();
      if (key === "s") {
        event.preventDefault();
        if (items.length > 0) handleSaveToToday();
        return;
      }
      if (key === "c") {
        event.preventDefault();
        handleClearWithUndo();
        return;
      }
      if (event.key === "/") {
        event.preventDefault();
        const foodsToggle = document.querySelector<HTMLButtonElement>(
          '[data-testid="meal-db-toggle"]',
        );
        foodsToggle?.focus();
        foodsToggle?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClearWithUndo, handleSaveToToday, items.length]);

  const handleSelectSlot = useCallback(
    (slot: MealSlot) => {
      setActiveSlot(slot);
    },
    [setActiveSlot],
  );

  const handleAddFoodLine = useCallback(
    (slot: MealSlot, food: Parameters<typeof addFoodItem>[1], portion?: number) => {
      addFoodItem(slot, food, portion);
      setAddedLineBanner(`Added ${food.n} to ${slotLabel(template, slot)}.`);
    },
    [addFoodItem, template],
  );

  const handleAddCustomLine = useCallback(
    (
      slot: MealSlot,
      custom: { label: string; kcal: number; p: number; f: number; c: number },
      portion?: number,
    ) => {
      addCustomItem(slot, custom, portion);
      setAddedLineBanner(`Added ${custom.label} to ${slotLabel(template, slot)}.`);
    },
    [addCustomItem, template],
  );

  return (
    <div className="card plate-meal-builder" data-testid="plate-meal-builder">
      <PlateMealBuilderIntro
        savedMealBanner={savedMealBanner}
        addedLineBanner={addedLineBanner}
        saveStateLabel={saveStateLabel}
        saveStateTone={saveStateTone}
      />

      <PlateTemplatePicker template={template} onPick={handleTemplatePick} />

      <PlateWedgeContext activeWedgeLabel={activeWedgeLabel} activeSlot={activeSlot} />

      <PlateVisual
        template={template}
        activeSlot={activeSlot}
        items={items}
        onSelectSlot={handleSelectSlot}
      />

      <h3
        className="plate-meal-builder__block-title"
        id="plate-builder-worksheet-heading"
      >
        Lines and totals
      </h3>
      <div
        className="plate-meal-builder__tools"
        data-testid="meal-tools"
        aria-labelledby="plate-builder-worksheet-heading"
      >
        <PlateMealSources
          template={template}
          activeSlot={activeSlot}
          foods={foods}
          foodsLoading={foodsLoading}
          foodsErr={foodsErr}
          reloadFoods={reloadFoods}
          onAddFood={handleAddFoodLine}
          onAddCustom={handleAddCustomLine}
        />

        <PlateMealLines
          template={template}
          activeSlot={activeSlot}
          items={items}
          onSetPortion={onPortionSlider}
          onRemove={removeItem}
          onClear={handleClearWithUndo}
          onResetAll={openResetDialog}
          onSaveToToday={handleSaveToToday}
          onJumpToSlot={handleSelectSlot}
        />

        <PlateMealTotals
          totals={totals}
          phaseKcal={phaseKcal}
          phaseKcalNote={phaseKcalNote}
          targetProtein={targetProtein}
          healthFocus={healthFocus}
          onFocusChange={setHealthFocus}
          focusLines={focusLines}
        />
      </div>

      <PlateMealPhotoAi
        activeSlot={activeSlot}
        healthFocus={healthFocus}
        phaseKcal={phaseKcal}
        targetProtein={targetProtein}
        onAddCustomItem={addCustomItem}
      />

      {undoBanner && (
        <div className="plate-meal-builder__undo-bar" role="status">
          <span>{undoBanner.message}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleUndo}>
            Undo
          </button>
        </div>
      )}

      {items.length > 0 ? (
        <div className="plate-meal-builder__global-mobile-savebar" aria-label="Sticky meal actions">
          <button
            type="button"
            className="btn"
            data-testid="meal-save-to-today-global-mobile"
            onClick={handleSaveToToday}
          >
            Save
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleClearWithUndo}>
            Clear
          </button>
        </div>
      ) : null}

      <PlateConfirmDialog
        open={resetDialogOpen}
        titleId="plate-reset-dialog-title"
        title="Reset the plate builder?"
        body={
          <p>
            This clears <strong>template</strong>, <strong>focus lens</strong>,
            <strong> active wedge</strong>, and{" "}
            <strong>all meal lines</strong> back to defaults. This can’t be
            undone.
          </p>
        }
        confirmLabel="Reset"
        confirmTestId="meal-reset-confirm"
        onCancel={() => setResetDialogOpen(false)}
        onConfirm={confirmResetDialog}
      />
    </div>
  );
}
