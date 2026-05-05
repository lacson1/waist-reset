export type FoodTypeKind =
  | "protein"
  | "fibre"
  | "leafy"
  | "volume"
  | "thermo"
  | "fat"
  | "ferment"
  | "vat"
  | "default";

/**
 * Maps the `t` (type) field on a FoodRow to a small set of icon kinds.
 * Categories come from the foods.json data. Unknowns fall back to "default".
 */
export function foodTypeKind(t: string | undefined): FoodTypeKind {
  if (!t) return "default";
  const k = t.toLowerCase();
  if (k.includes("vat")) return "vat";
  if (k.includes("ferment") || k.includes("gut")) return "ferment";
  if (k.includes("leafy")) return "leafy";
  if (k.includes("fibre") || k.includes("fiber") || k.includes("rs")) return "fibre";
  if (k.includes("protein")) return "protein";
  if (k.includes("thermo")) return "thermo";
  if (k.includes("fat")) return "fat";
  if (k.includes("volume")) return "volume";
  return "default";
}

export function foodTypeLabel(kind: FoodTypeKind): string {
  switch (kind) {
    case "protein":
      return "Protein";
    case "fibre":
      return "Fibre";
    case "leafy":
      return "Leafy";
    case "volume":
      return "Volume";
    case "thermo":
      return "Thermogenic";
    case "fat":
      return "Fat quality";
    case "ferment":
      return "Fermented";
    case "vat":
      return "VAT power";
    default:
      return "Food";
  }
}
