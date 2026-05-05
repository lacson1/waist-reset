import { useCallback, useEffect, useMemo, useState } from "react";
import type { Baseline } from "../../types/progress";
import { useFoods } from "../../domain/foods";
import {
  type MealLineItem,
  type MealSlot,
  type MealTemplate,
  DEFAULT_ACTIVE_SLOT,
  compareToPhase,
  countItemsRemovedOnTemplateChange,
  mealFocusNarrative,
  slotLabel,
  slotsForTemplate,
  sumMacros,
} from "../../domain/plateMeal";
import { usePlateBuilderStore } from "../../store/plateBuilderStore";
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

const TEMPLATE_CHOICE_LABEL: Record<MealTemplate, string> = {
  rest: "Rest day",
  training: "Training day",
  soup: "Soup bowl",
};

const PLATE_COLLAPSIBLE_HINT_KEY = "vat_plate_collapsible_hint_v1";

/** Safari Private mode and some embedded webviews throw on storage access. */
function readHintDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(PLATE_COLLAPSIBLE_HINT_KEY) != null;
  } catch {
    return false;
  }
}

function persistHintDismissed(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PLATE_COLLAPSIBLE_HINT_KEY, "1");
  } catch {
    /* storage unavailable — hint just reappears next session */
  }
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

  const [templateDialog, setTemplateDialog] = useState<{
    next: MealTemplate;
    removed: number;
  } | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [templateSwitchBanner, setTemplateSwitchBanner] = useState<
    string | null
  >(null);
  const [savedMealBanner, setSavedMealBanner] = useState<string | null>(null);
  const [addedLineBanner, setAddedLineBanner] = useState<string | null>(null);
  const [showCollapsibleHint, setShowCollapsibleHint] = useState(
    () => !readHintDismissed(),
  );

  useEffect(() => {
    if (!templateSwitchBanner) return;
    const t = window.setTimeout(() => setTemplateSwitchBanner(null), 5200);
    return () => window.clearTimeout(t);
  }, [templateSwitchBanner]);

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

  const handleSaveToToday = useCallback(() => {
    if (items.length === 0) return;
    const entry = useMealLogStore.getState().saveMeal({
      date: todayIsoDate(),
      template,
      healthFocus,
      items,
    });
    setSavedMealBanner(`Saved to today — ${entry.label}.`);
  }, [healthFocus, items, template]);

  const handleTemplatePick = useCallback(
    (next: MealTemplate) => {
      if (next === template) return;
      const removed = countItemsRemovedOnTemplateChange(items, next);
      if (removed > 0) {
        setTemplateDialog({ next, removed });
        return;
      }
      setTemplate(next);
    },
    [items, setTemplate, template],
  );

  const confirmTemplateDialog = useCallback(() => {
    if (!templateDialog) return;
    const { next, removed } = templateDialog;
    setTemplate(next);
    setTemplateDialog(null);
    if (removed > 0) {
      setTemplateSwitchBanner(
        `${removed} line${removed === 1 ? "" : "s"} removed — slots don’t match the new template.`,
      );
    }
  }, [setTemplate, templateDialog]);

  const dismissCollapsibleHint = useCallback(() => {
    persistHintDismissed();
    setShowCollapsibleHint(false);
  }, []);

  const openResetDialog = useCallback(() => setResetDialogOpen(true), []);
  const confirmResetDialog = useCallback(() => {
    resetBuilder();
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
        showCollapsibleHint={showCollapsibleHint}
        onDismissHint={dismissCollapsibleHint}
        templateSwitchBanner={templateSwitchBanner}
        savedMealBanner={savedMealBanner}
        addedLineBanner={addedLineBanner}
      />

      <PlateTemplatePicker template={template} onPick={handleTemplatePick} />

      <PlateWedgeContext activeWedgeLabel={activeWedgeLabel} activeSlot={activeSlot} />

      <PlateVisual
        template={template}
        activeSlot={activeSlot}
        items={items}
        onSelectSlot={setActiveSlot}
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
          onClear={clearItems}
          onResetAll={openResetDialog}
          onSaveToToday={handleSaveToToday}
          onJumpToSlot={setActiveSlot}
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

      <PlateConfirmDialog
        open={templateDialog != null}
        titleId="plate-template-dialog-title"
        title="Change template?"
        body={
          templateDialog ? (
            <p>
              Switching to{" "}
              <strong>{TEMPLATE_CHOICE_LABEL[templateDialog.next]}</strong>{" "}
              removes <strong>{templateDialog.removed}</strong> line
              {templateDialog.removed === 1 ? "" : "s"} (slots that do not exist
              on the new plate).
            </p>
          ) : null
        }
        confirmLabel="Switch template"
        confirmTestId="meal-template-confirm"
        onCancel={() => setTemplateDialog(null)}
        onConfirm={confirmTemplateDialog}
      />

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
