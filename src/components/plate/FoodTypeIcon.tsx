import type { CSSProperties } from "react";
import { foodTypeLabel, type FoodTypeKind } from "./foodTypeMeta";

/**
 * Raw SVG paths for a food-type glyph, sized to a 24×24 viewBox.
 * Exported so it can be embedded inside other SVGs (e.g. the plate wedges)
 * without dragging in the surrounding badge chrome.
 */
export function FoodTypeGlyph({ kind }: { kind: FoodTypeKind }) {
  switch (kind) {
    case "protein":
      return (
        <>
          <path
            d="M3.5 12c2-3.5 5.5-5 9.25-5 2.6 0 4.85 1.05 6.05 2.25v5.5c-1.2 1.2-3.45 2.25-6.05 2.25-3.75 0-7.25-1.5-9.25-5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M18.8 9.6l1.95-1.6v8l-1.95-1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <circle cx="6.5" cy="11.1" r="0.95" fill="currentColor" />
        </>
      );
    case "fibre":
      return (
        <>
          <path
            d="M12 4.25v15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 9.5c-1.85-1.85-3.7-2-5.6-1.1.05 2.4 1.85 4.05 4.6 4.05"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 9.5c1.85-1.85 3.7-2 5.6-1.1-.05 2.4-1.85 4.05-4.6 4.05"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14c-1.85-1.85-3.7-2-5.6-1.1.05 2.4 1.85 4.05 4.6 4.05"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14c1.85-1.85 3.7-2 5.6-1.1-.05 2.4-1.85 4.05-4.6 4.05"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    case "leafy":
      return (
        <>
          <path
            d="M5 19.5c0-7.5 4.75-13 14-13.5-.5 9.75-6 14.25-13 14.25-.85 0-1.35-.85-1-.75z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M6 18.5l6.5-6.5"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
          />
        </>
      );
    case "volume":
      return (
        <>
          <path
            d="M4.5 10.5h15a8 8 0 01-7.5 8.5h0a8 8 0 01-7.5-8.5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M12 3.5c1.65 1.85 1.65 3.4 0 5.05-1.65-1.65-1.65-3.2 0-5.05z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </>
      );
    case "thermo":
      return (
        <path
          d="M12 3.5c0 3-2.6 4.05-2.6 6.7 0 1.4.7 2.55 1.55 3.25-.55-2.05.5-3.55 1.5-4.2.4 1.7 2.5 2.4 2.5 5C15 16.7 13.5 18.5 12 18.5s-5-1.5-5-5.05c0-4.05 5-5.05 5-9.95z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      );
    case "fat":
      return (
        <path
          d="M12 3.75c2.85 4.1 5.05 6.85 5.05 9.6a5.05 5.05 0 11-10.1 0c0-2.75 2.2-5.5 5.05-9.6z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      );
    case "ferment":
      return (
        <>
          <rect
            x="6.5"
            y="6.5"
            width="11"
            height="13"
            rx="1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M7.5 4.25h9"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="10.1" cy="12.4" r="0.9" fill="currentColor" opacity="0.78" />
          <circle cx="13.7" cy="14.6" r="0.7" fill="currentColor" opacity="0.62" />
          <circle cx="11.5" cy="16" r="0.55" fill="currentColor" opacity="0.5" />
        </>
      );
    case "vat":
      return (
        <>
          <circle cx="12" cy="12" r="2.25" fill="currentColor" />
          <path
            d="M12 4v3M12 17v3M4 12h3M17 12h3M6.6 6.6l2 2M15.4 15.4l2 2M17.4 6.6l-2 2M8.6 15.4l-2 2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      );
    default:
      return (
        <circle
          cx="12"
          cy="12"
          r="6.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      );
  }
}

type Props = {
  kind: FoodTypeKind;
  /** "sm" 18px badge for compact rows, "md" 22px for cards. */
  size?: "sm" | "md";
  className?: string;
  style?: CSSProperties;
  /** When false, badge is decoration only (still gets a tooltip via title). */
  labelled?: boolean;
};

/**
 * Small tinted-pill badge that classifies a food at a glance.
 * Kind drives the SVG glyph; CSS picks the tint via [data-kind="…"].
 */
export function FoodTypeIcon({
  kind,
  size = "sm",
  className,
  style,
  labelled = true,
}: Props) {
  const inner = size === "md" ? 16 : 13;
  const label = foodTypeLabel(kind);
  const cls = ["food-type-icon", `food-type-icon--${size}`, className ?? ""]
    .filter(Boolean)
    .join(" ");
  const a11yProps = labelled
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };
  return (
    <span
      className={cls}
      data-kind={kind}
      style={style}
      title={label}
      {...a11yProps}
    >
      <svg
        viewBox="0 0 24 24"
        width={inner}
        height={inner}
        focusable="false"
        aria-hidden
      >
        <FoodTypeGlyph kind={kind} />
      </svg>
    </span>
  );
}
