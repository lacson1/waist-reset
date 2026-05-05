import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Link } from "react-router-dom";
import type { FoodRow } from "../../domain/foods";
import {
  filterAndSortFoods,
  groupFoodsByKind,
  SLOT_FOOD_KIND_AFFINITY,
  type FoodBranchFilter,
  type FoodSortKey,
  type FoodKindGroup,
} from "../../domain/foodSearch";
import { inferFoodCat, slotAcceptedCats } from "../../domain/foodCategory";
import {
  type MealSlot,
  type MealTemplate,
  slotLabel,
} from "../../domain/plateMeal";
import { useRecentFoodsStore } from "../../store/recentFoodsStore";
import { useFoodSearchPrefsStore } from "../../store/foodSearchPrefsStore";
import {
  FoodTypeIcon,
  foodTypeKind,
  foodTypeLabel,
  type FoodTypeKind,
} from "./FoodTypeIcon";

const CATEGORY_ORDER: readonly FoodTypeKind[] = [
  "protein",
  "fibre",
  "leafy",
  "volume",
  "thermo",
  "fat",
  "ferment",
  "vat",
];

const BRANCH_TABS: readonly { id: FoodBranchFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "General", label: "General" },
  { id: "African", label: "African" },
];

const SORT_OPTIONS: readonly { id: FoodSortKey; label: string }[] = [
  { id: "relevance", label: "Best match" },
  { id: "name", label: "Name A–Z" },
  { id: "kcal-asc", label: "Kcal ↑" },
  { id: "protein-desc", label: "Protein ↓" },
];

const BROWSE_GROUP_DEFAULT_CAP = 6;

type Props = {
  foods: FoodRow[];
  loading: boolean;
  err: string | null;
  reload: () => void;
  template: MealTemplate;
  activeSlot: MealSlot;
  onAdd: (food: FoodRow) => void;
};

/**
 * Rich Food Database panel: search box, filter chips, sort, recent picks,
 * grouped browse mode with per-group expand, and keyboard navigation. Filter
 * state (categories / branch / fitsSlot / sort) persists across sessions; the
 * live query and per-group expand state stay local so the panel always opens
 * with a clean searchbox.
 */
export function FoodSearchPanel({
  foods,
  loading,
  err,
  reload,
  template,
  activeSlot,
  onAdd,
}: Props) {
  const persistedCategories = useFoodSearchPrefsStore((s) => s.categories);
  const branch = useFoodSearchPrefsStore((s) => s.branch);
  const fitsSlot = useFoodSearchPrefsStore((s) => s.fitsSlot);
  const sort = useFoodSearchPrefsStore((s) => s.sort);
  const setCategoriesPersisted = useFoodSearchPrefsStore((s) => s.setCategories);
  const setBranch = useFoodSearchPrefsStore((s) => s.setBranch);
  const setFitsSlot = useFoodSearchPrefsStore((s) => s.setFitsSlot);
  const setSort = useFoodSearchPrefsStore((s) => s.setSort);
  const resetPrefs = useFoodSearchPrefsStore((s) => s.reset);

  const categories = useMemo(
    () => new Set(persistedCategories),
    [persistedCategories],
  );

  const [query, setQuery] = useState("");
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [expandedKinds, setExpandedKinds] = useState<Set<FoodTypeKind>>(
    () => new Set(),
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const listboxId = `${reactId}-foodlist`;

  useEffect(() => {
    /** Don't pop a soft keyboard over the plate context on touch. */
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    inputRef.current?.focus();
  }, []);

  const recent = useRecentFoodsStore((s) => s.recent);
  const pushRecent = useRecentFoodsStore((s) => s.pushRecent);
  const clearRecent = useRecentFoodsStore((s) => s.clearRecent);

  const slotHasAffinity = SLOT_FOOD_KIND_AFFINITY[activeSlot].length > 0;
  const trimmedQuery = query.trim();
  /** Grouped browse whenever the query is empty — filters still apply to `matches`. */
  const isBrowse = !trimmedQuery;

  const filters = useMemo(
    () => ({
      query: trimmedQuery,
      categories,
      branch,
      fitsSlot: fitsSlot && slotHasAffinity,
      activeSlot,
      sort,
    }),
    [
      trimmedQuery,
      categories,
      branch,
      fitsSlot,
      slotHasAffinity,
      activeSlot,
      sort,
    ],
  );

  /** Tighter cap with active query, generous cap in browse to feed the groups. */
  const matches = useMemo(
    () => filterAndSortFoods(foods, filters, trimmedQuery ? 30 : 240),
    [foods, filters, trimmedQuery],
  );

  const allGroups = useMemo<FoodKindGroup[]>(
    () => (isBrowse ? groupFoodsByKind(matches) : []),
    [isBrowse, matches],
  );

  /** Capped groups: show 6 per kind unless the user expanded that section. */
  const visibleGroups = useMemo<FoodKindGroup[]>(
    () =>
      allGroups.map((g) =>
        expandedKinds.has(g.kind)
          ? g
          : { kind: g.kind, rows: g.rows.slice(0, BROWSE_GROUP_DEFAULT_CAP) },
      ),
    [allGroups, expandedKinds],
  );

  /**
   * Search-mode soft filter: split matches into "fits the active wedge" and
   * "other foods" using the fine-grained FoodCat taxonomy. Without this,
   * searching "catfish" while the Vegetables wedge is active would happily
   * show African catfish on top — which then gets parked under Vegetables
   * when the user taps +.
   *
   * Skipped when the user has the hard "Fits {wedge}" toggle on (already
   * filtered) or the slot has no opinion (e.g. soup "optional").
   */
  const acceptedSlotCats = useMemo(
    () => slotAcceptedCats(template, activeSlot),
    [template, activeSlot],
  );

  const slotPartition = useMemo(() => {
    if (!trimmedQuery || fitsSlot || acceptedSlotCats === null) return null;
    const accepted = new Set(acceptedSlotCats);
    const onSlot: FoodRow[] = [];
    const offSlot: FoodRow[] = [];
    for (const f of matches) {
      if (accepted.has(inferFoodCat(f))) onSlot.push(f);
      else offSlot.push(f);
    }
    if (offSlot.length === 0) return null;
    return { onSlot, offSlot };
  }, [trimmedQuery, fitsSlot, acceptedSlotCats, matches]);

  /**
   * Off-slot reveal is keyed by the partition context so a new search /
   * different wedge auto-collapses the section without firing an effect to
   * reset boolean state. `null` means "collapsed for the current context".
   */
  const partitionKey = useMemo(
    () =>
      slotPartition
        ? `${template}|${activeSlot}|${trimmedQuery}|${fitsSlot ? 1 : 0}`
        : "",
    [slotPartition, template, activeSlot, trimmedQuery, fitsSlot],
  );
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const showOffSlot = revealedKey !== null && revealedKey === partitionKey;
  const toggleOffSlot = useCallback(() => {
    setRevealedKey((prev) =>
      prev === partitionKey ? null : partitionKey,
    );
  }, [partitionKey]);

  /** Flat ordered list mirroring what's actually rendered, used for keyboard nav. */
  const flatVisible = useMemo<FoodRow[]>(() => {
    if (isBrowse) {
      const ordered: FoodRow[] = [];
      if (recent.length > 0) ordered.push(...recent);
      for (const g of visibleGroups) ordered.push(...g.rows);
      return ordered;
    }
    if (slotPartition) {
      return showOffSlot
        ? [...slotPartition.onSlot, ...slotPartition.offSlot]
        : slotPartition.onSlot;
    }
    return matches;
  }, [
    isBrowse,
    recent,
    visibleGroups,
    matches,
    slotPartition,
    showOffSlot,
  ]);

  /** Reset highlight whenever the visible list shape changes. */
  useEffect(() => {
    setHighlightedIdx(-1);
  }, [
    trimmedQuery,
    persistedCategories,
    branch,
    fitsSlot,
    sort,
    expandedKinds,
    showOffSlot,
  ]);

  useEffect(() => {
    if (highlightedIdx < 0) return;
    const root = listRef.current;
    if (!root) return;
    const el = root.querySelector<HTMLElement>(
      `[data-rowindex="${highlightedIdx}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIdx]);

  const slotText = slotLabel(template, activeSlot);

  const toggleCategory = useCallback(
    (k: FoodTypeKind) => {
      const next = new Set(persistedCategories);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      setCategoriesPersisted([...next]);
    },
    [persistedCategories, setCategoriesPersisted],
  );

  const clearFilters = useCallback(() => {
    resetPrefs();
    setExpandedKinds(new Set());
  }, [resetPrefs]);

  const toggleExpandedKind = useCallback((k: FoodTypeKind) => {
    setExpandedKinds((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }, []);

  const handleAdd = useCallback(
    (f: FoodRow) => {
      onAdd(f);
      pushRecent(f);
    },
    [onAdd, pushRecent],
  );

  const navigateList = useCallback(
    (e: ReactKeyboardEvent | KeyboardEvent, key: string) => {
      if (flatVisible.length === 0) return false;
      if (key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIdx((i) =>
          i < 0 ? 0 : Math.min(i + 1, flatVisible.length - 1),
        );
        return true;
      }
      if (key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIdx((i) => (i <= 0 ? -1 : i - 1));
        return true;
      }
      if (key === "Enter") {
        if (highlightedIdx >= 0 && flatVisible[highlightedIdx]) {
          e.preventDefault();
          e.stopPropagation();
          handleAdd(flatVisible[highlightedIdx]);
          return true;
        }
      }
      return false;
    },
    [flatVisible, highlightedIdx, handleAdd],
  );

  const onInputKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (navigateList(e, e.key)) return;
      if (e.key === "Escape" && query) {
        e.preventDefault();
        setQuery("");
      }
    },
    [navigateList, query],
  );

  /**
   * Arrow / Enter on list when focus is on chips, sort, or wedge toggle — capture
   * so we run before button default (Enter on a chip would otherwise toggle only).
   */
  useEffect(() => {
    const root = panelRef.current;
    if (!root) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (!root.contains(e.target as Node)) return;
      const t = e.target;
      if (t instanceof HTMLInputElement && t.type === "text") return;
      if (t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement)
        return;
      navigateList(e, e.key);
    };
    root.addEventListener("keydown", onKeyDown, true);
    return () => root.removeEventListener("keydown", onKeyDown, true);
  }, [navigateList]);

  const filterCount =
    categories.size + (branch !== "all" ? 1 : 0) + (fitsSlot ? 1 : 0);

  if (loading) {
    return <p className="muted plate-meal-builder__fine">Loading foods…</p>;
  }
  if (err) {
    return (
      <div className="plate-meal-builder__foods-err">
        <p className="plate-meal-builder__err">{err}</p>
        <button type="button" className="btn btn-sm" onClick={() => reload()}>
          Retry
        </button>
      </div>
    );
  }

  /* eslint-disable jsx-a11y/role-has-required-aria-props */
  return (
    <div
      ref={panelRef}
      className="food-search plate-meal-builder__food-search"
      tabIndex={-1}
    >
      <div className="food-search__sticky">
        <div className="food-search__searchbar" role="search">
          <span className="food-search__searchbar-icon" aria-hidden>
            <SearchGlyph />
          </span>
          <input
            ref={inputRef}
            type="text"
            className="food-search__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder={`Search foods for ${slotText.toLowerCase()}…`}
            autoComplete="off"
            spellCheck={false}
            aria-label="Search"
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              highlightedIdx >= 0
                ? `${listboxId}-opt-${highlightedIdx}`
                : undefined
            }
          />
          {query ? (
            <button
              type="button"
              className="food-search__searchbar-clear"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              title="Clear (Esc)"
            >
              ×
            </button>
          ) : null}
        </div>

        <div className="food-search__controls">
          <div
            className="food-search__seg food-search__seg--branch"
            role="tablist"
            aria-label="Branch"
          >
            {BRANCH_TABS.map((b) => (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={branch === b.id}
                className={`food-search__seg-btn${branch === b.id ? " is-active" : ""}`}
                onClick={() => setBranch(b.id)}
              >
                {b.label}
              </button>
            ))}
          </div>

          {slotHasAffinity ? (
            <button
              type="button"
              className={`food-search__toggle${fitsSlot ? " is-active" : ""}`}
              onClick={() => setFitsSlot(!fitsSlot)}
              aria-pressed={fitsSlot}
              title={`Show only foods that fit ${slotText}`}
            >
              <span className="food-search__toggle-dot" aria-hidden />
              Fits {slotText.toLowerCase()}
            </button>
          ) : null}

          <label className="food-search__sort">
            <span className="food-search__sort-label">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as FoodSortKey)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          className="food-search__chips"
          role="group"
          aria-label="Filter by category"
        >
          {CATEGORY_ORDER.map((k) => {
            const on = categories.has(k);
            return (
              <button
                key={k}
                type="button"
                className={`food-search__chip${on ? " is-active" : ""}`}
                data-kind={k}
                aria-pressed={on}
                onClick={() => toggleCategory(k)}
              >
                <FoodTypeIcon kind={k} size="sm" labelled={false} />
                <span>{foodTypeLabel(k)}</span>
              </button>
            );
          })}
          {filterCount > 0 ? (
            <button
              type="button"
              className="food-search__chip-clear"
              onClick={clearFilters}
              aria-label="Clear all filters"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        <div className="food-search__statusbar" aria-live="polite">
          <span className="food-search__count">
            {trimmedQuery ? (
              slotPartition ? (
                <>
                  {slotPartition.onSlot.length} for {slotText}
                  <span className="muted">
                    {" "}
                    · {slotPartition.offSlot.length} other
                  </span>
                </>
              ) : (
                <>
                  {matches.length} match{matches.length === 1 ? "" : "es"}
                </>
              )
            ) : (
              <>
                {matches.length} food{matches.length === 1 ? "" : "s"}
              </>
            )}
          </span>
          <Link to="/foods" className="food-search__more">
            Open full database →
          </Link>
        </div>
      </div>

      {matches.length === 0 ? (
        <p className="muted plate-meal-builder__fine plate-meal-builder__fine--tight">
          {trimmedQuery
            ? "No matches. Try fewer words or clear filters."
            : "Nothing here with current filters."}
        </p>
      ) : (
        <div ref={listRef} id={listboxId} role="listbox" aria-label="Foods">
          {isBrowse && recent.length > 0 ? (
            <FoodGroup
              kind="recent"
              title="Recent"
              rows={recent}
              total={recent.length}
              startIndex={0}
              highlightedIdx={highlightedIdx}
              listboxId={listboxId}
              onAdd={handleAdd}
              onHover={setHighlightedIdx}
              onClearAll={clearRecent}
              addLabel={slotText}
              showBranchTag={branch === "all"}
            />
          ) : null}
          {isBrowse ? (
            (() => {
              let cursor = recent.length;
              return visibleGroups.map((g, gi) => {
                const start = cursor;
                cursor += g.rows.length;
                const fullCount = allGroups[gi]?.rows.length ?? g.rows.length;
                const expanded = expandedKinds.has(g.kind);
                const moreCount = Math.max(0, fullCount - g.rows.length);
                return (
                  <FoodGroup
                    key={g.kind}
                    kind={g.kind}
                    title={foodTypeLabel(g.kind)}
                    rows={g.rows}
                    total={fullCount}
                    startIndex={start}
                    highlightedIdx={highlightedIdx}
                    listboxId={listboxId}
                    onAdd={handleAdd}
                    onHover={setHighlightedIdx}
                    addLabel={slotText}
                    showBranchTag={branch === "all"}
                    expandable={
                      expanded || moreCount > 0
                        ? {
                            expanded,
                            moreCount,
                            onToggle: () => toggleExpandedKind(g.kind),
                          }
                        : undefined
                    }
                  />
                );
              });
            })()
          ) : slotPartition ? (
            <>
              {slotPartition.onSlot.length === 0 ? (
                <p className="muted plate-meal-builder__fine plate-meal-builder__fine--tight food-search__off-slot-empty">
                  Nothing here fits the {slotText.toLowerCase()} wedge. Browse
                  other foods below or pick a different wedge.
                </p>
              ) : (
                <FoodGroup
                  kind="results"
                  title={`Matches for ${slotText}`}
                  rows={slotPartition.onSlot}
                  total={slotPartition.onSlot.length}
                  startIndex={0}
                  highlightedIdx={highlightedIdx}
                  listboxId={listboxId}
                  onAdd={handleAdd}
                  onHover={setHighlightedIdx}
                  compact
                  addLabel={slotText}
                  showBranchTag={branch === "all"}
                />
              )}
              <button
                type="button"
                className={`food-search__off-slot-toggle${
                  showOffSlot ? " is-open" : ""
                }`}
                aria-expanded={showOffSlot ? "true" : "false"}
                aria-controls={`${listboxId}-off-slot`}
                onClick={toggleOffSlot}
              >
                <span
                  className="food-search__off-slot-chevron"
                  aria-hidden
                />
                {showOffSlot ? "Hide" : "Show"}{" "}
                {slotPartition.offSlot.length} other food
                {slotPartition.offSlot.length === 1 ? "" : "s"}{" "}
                <span className="muted food-search__off-slot-hint">
                  — these don&apos;t usually fit {slotText.toLowerCase()}
                </span>
              </button>
              {showOffSlot ? (
                <div id={`${listboxId}-off-slot`}>
                  <FoodGroup
                    kind="results-off"
                    title="Other foods"
                    rows={slotPartition.offSlot}
                    total={slotPartition.offSlot.length}
                    startIndex={slotPartition.onSlot.length}
                    highlightedIdx={highlightedIdx}
                    listboxId={listboxId}
                    onAdd={handleAdd}
                    onHover={setHighlightedIdx}
                    compact
                    addLabel={slotText}
                    showBranchTag={branch === "all"}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <FoodGroup
              kind="results"
              title=""
              rows={matches}
              total={matches.length}
              startIndex={0}
              highlightedIdx={highlightedIdx}
              listboxId={listboxId}
              onAdd={handleAdd}
              onHover={setHighlightedIdx}
              compact
              addLabel={slotText}
              showBranchTag={branch === "all"}
            />
          )}
        </div>
      )}

      <p className="food-search__kbhint" aria-hidden>
        <kbd>↑</kbd>
        <kbd>↓</kbd>
        <span>to browse</span>
        <kbd>Enter</kbd>
        <span>to add</span>
        <kbd>Esc</kbd>
        <span>to clear</span>
      </p>
    </div>
  );
  /* eslint-enable jsx-a11y/role-has-required-aria-props */
}

function FoodGroup({
  kind,
  title,
  rows,
  total,
  startIndex,
  highlightedIdx,
  listboxId,
  onAdd,
  onHover,
  onClearAll,
  compact,
  addLabel,
  showBranchTag,
  expandable,
}: {
  kind: string;
  title: string;
  rows: FoodRow[];
  total: number;
  startIndex: number;
  highlightedIdx: number;
  listboxId: string;
  onAdd: (f: FoodRow) => void;
  onHover: (i: number) => void;
  onClearAll?: () => void;
  compact?: boolean;
  addLabel: string;
  showBranchTag: boolean;
  expandable?: { expanded: boolean; moreCount: number; onToggle: () => void };
}) {
  if (rows.length === 0) return null;
  return (
    <section
      className={`food-search__group${compact ? " food-search__group--compact" : ""}`}
      data-kind={kind}
    >
      {title ? (
        <header className="food-search__group-head">
          <span className="food-search__group-title">
            {title}{" "}
            <span className="food-search__group-count">{total}</span>
          </span>
          {onClearAll ? (
            <button
              type="button"
              className="food-search__group-clear"
              onClick={onClearAll}
            >
              Clear
            </button>
          ) : null}
        </header>
      ) : null}
      <ul className="food-search__rows">
        {rows.map((f, i) => {
          const idx = startIndex + i;
          const optionId = `${listboxId}-opt-${idx}`;
          const highlighted = idx === highlightedIdx;
          return (
            <li
              key={`${f.n}-${f.qty}-${idx}`}
              data-rowindex={idx}
              role="option"
              aria-selected={highlighted}
              id={optionId}
            >
              <button
                type="button"
                className={`food-search__row${highlighted ? " is-highlighted" : ""}`}
                onClick={() => onAdd(f)}
                onMouseMove={() => onHover(idx)}
                aria-label={`Add ${f.n} to ${addLabel}`}
              >
                <FoodTypeIcon
                  kind={foodTypeKind(f.t)}
                  size="sm"
                  labelled={false}
                  className="food-search__row-icon"
                />
                <span className="food-search__row-main">
                  <span className="food-search__row-name">
                    <strong>{f.n}</strong>
                    {showBranchTag ? (
                      <span
                        className="food-search__row-branch"
                        data-branch={f.b === "African" ? "afr" : "gen"}
                        title={f.b}
                      >
                        {f.b === "African" ? "Afr" : "Gen"}
                      </span>
                    ) : null}
                    {f.g ? (
                      <span
                        className="food-search__row-grade"
                        data-grade={f.g.charAt(0)}
                        title={`Grade ${f.g}`}
                      >
                        {f.g}
                      </span>
                    ) : null}
                    <span className="food-search__row-type muted" title={f.t}>
                      {f.t}
                    </span>
                  </span>
                  <span className="food-search__row-meta muted">
                    <span className="food-search__row-qty">{f.qty}</span>
                    <span className="food-search__row-kcal">{f.kcal} kcal</span>
                    <span className="food-search__macros" aria-hidden>
                      <span className="food-search__macro food-search__macro--p">
                        P{f.p}
                      </span>
                      <span className="food-search__macro food-search__macro--f">
                        F{f.f}
                      </span>
                      <span className="food-search__macro food-search__macro--c">
                        C{f.c}
                      </span>
                    </span>
                  </span>
                </span>
                <span className="food-search__row-add" aria-hidden>
                  +
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {expandable ? (
        <button
          type="button"
          className="food-search__group-more"
          onClick={expandable.onToggle}
          aria-expanded={expandable.expanded}
        >
          {expandable.expanded
            ? `Show less ${title}`
            : `Show ${expandable.moreCount} more ${title.toLowerCase()}`}
        </button>
      ) : null}
    </section>
  );
}

function SearchGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="10.75" cy="10.75" r="5.75" />
      <path d="M15.5 15.5L19 19" />
    </svg>
  );
}
