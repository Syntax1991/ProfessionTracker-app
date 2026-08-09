import type {
  AddonRecipeOperationMetrics
} from "./addon-import.types.js";

export function serializeRecipeOperationMetrics(
  metrics:
    AddonRecipeOperationMetrics
): string | null {
  const entries =
    Object.entries(
      metrics
    )
      .sort(
        (
          [leftKey],
          [rightKey]
        ) =>
          leftKey.localeCompare(
            rightKey
          )
      );

  if (
    entries.length ===
    0
  ) {
    return null;
  }

  return JSON.stringify(
    Object.fromEntries(
      entries
    )
  );
}