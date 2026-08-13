import {
  asTable
} from "./addon-import.lua-utils.js";
import type {
  AddonRecipeOperationMetrics,
  LuaValue
} from "./addon-import.types.js";

export function normalizeOperationMetrics(
  value: LuaValue | undefined
): AddonRecipeOperationMetrics {
  const table =
    asTable(
      value
    );

  if (!table) {
    return {};
  }

  const metrics:
    AddonRecipeOperationMetrics = {};

  for (
    const [
      key,
      metric
    ] of Object.entries(
      table
    )
  ) {
    if (
      typeof metric === "number" ||
      typeof metric === "string" ||
      typeof metric === "boolean"
    ) {
      metrics[key] =
        metric;
    }
  }

  return metrics;
}