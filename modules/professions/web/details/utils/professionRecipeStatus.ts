import type {
  ProfessionRecipeCraftStatus
} from "../types/professionRecipe.types";

export function getProfessionRecipeCraftStatusLabel(
  status:
    ProfessionRecipeCraftStatus
): string {
  return status ===
    "NOT_SAFE"
    ? "NOT SAFE"
    : status;
}

export function getProfessionRecipeCraftStatusClassName(
  status:
    ProfessionRecipeCraftStatus
): string {
  switch (status) {
    case "SAFE":
      return (
        "profession-craft-status safe"
      );

    case "CONCENTRATION":
      return (
        "profession-craft-status concentration"
      );

    case "NOT_SAFE":
      return (
        "profession-craft-status not-safe"
      );

    case "UNKNOWN":
      return (
        "profession-craft-status unknown"
      );
  }
}