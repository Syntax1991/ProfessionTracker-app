import type {
  LuaTable,
  LuaValue
} from "./addon-import.types.js";

export const CHARACTER_RECIPE_METRIC_KEYS = [
  "guaranteedCraftingQualityID",
  "baseDifficulty",
  "upperSkillTreshold",
  "upperSkillThreshold",
  "lowerSkillThreshold",
  "baseSkill",
  "concentrationCost",
  "bonusDifficulty",
  "craftingQualityID",
  "ingenuityRefund",
  "craftingQuality",
  "isQualityCraft",
  "concentrationCurrencyID",
  "bonusSkill",
  "quality"
] as const;

export function decodeCompactText(
  value: string
): string {
  return value.replace(
    /%([0-9A-Fa-f]{2})/g,
    (
      _match,
      hexadecimal: string
    ) =>
      String.fromCharCode(
        Number.parseInt(
          hexadecimal,
          16
        )
      )
  );
}

export function decodeCompactScalar(
  value: string | undefined
): LuaValue | undefined {
  if (
    !value ||
    value === "x"
  ) {
    return undefined;
  }

  if (value[0] === "n") {
    const number =
      Number(
        value.slice(1)
      );

    return Number.isFinite(number)
      ? number
      : undefined;
  }

  if (value === "b1") {
    return true;
  }

  if (value === "b0") {
    return false;
  }

  if (value[0] === "s") {
    return decodeCompactText(
      value.slice(1)
    );
  }

  return undefined;
}

export function assignCompactScalar(
  target: LuaTable,
  key: string,
  token: string | undefined
): void {
  const value =
    decodeCompactScalar(token);

  if (value !== undefined) {
    target[key] = value;
  }
}

export function decodeCompactGenericMap(
  value: string
): LuaTable {
  const result: LuaTable = {};

  if (
    !value ||
    value === "-"
  ) {
    return result;
  }

  for (
    const entry of
    value.split("&")
  ) {
    const separator =
      entry.indexOf("=");

    if (separator < 1) {
      continue;
    }

    assignCompactScalar(
      result,
      decodeCompactText(
        entry.slice(0, separator)
      ),
      entry.slice(separator + 1)
    );
  }

  return result;
}

export function decodeCompactMetricMap(
  value: string | undefined
): LuaTable {
  const result: LuaTable = {};

  if (
    !value ||
    value === "-"
  ) {
    return result;
  }

  const separator =
    value.indexOf(";");

  const fixedText =
    separator >= 0
      ? value.slice(0, separator)
      : value;

  const extrasText =
    separator >= 0
      ? value.slice(separator + 1)
      : "";

  const fixed =
    fixedText.split(",");

  CHARACTER_RECIPE_METRIC_KEYS.forEach(
    (
      key,
      index
    ) =>
      assignCompactScalar(
        result,
        key,
        fixed[index]
      )
  );

  if (!extrasText) {
    return result;
  }

  for (
    const entry of
    extrasText.split(",")
  ) {
    const equals =
      entry.indexOf("=");

    if (equals < 1) {
      continue;
    }

    assignCompactScalar(
      result,
      decodeCompactText(
        entry.slice(0, equals)
      ),
      entry.slice(equals + 1)
    );
  }

  return result;
}