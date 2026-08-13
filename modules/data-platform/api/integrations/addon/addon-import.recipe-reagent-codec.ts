import type {
  LuaTable,
  LuaValue
} from "./addon-import.types.js";

const STORAGE_FORMAT = "R1";

function asLegacyTable(
  value: LuaValue | undefined
): LuaTable | null {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
    ? value as LuaTable
    : null;
}

function numberToken(
  value: string | undefined
): number | null {
  if (
    !value ||
    value === "x"
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function setNumber(
  target: LuaTable,
  key: string,
  value: string | undefined
): void {
  const parsed = numberToken(value);

  if (parsed !== null) {
    target[key] = parsed;
  }
}

function setTrue(
  target: LuaTable,
  key: string,
  value: string | undefined
): void {
  if (value === "1") {
    target[key] = true;
  }
}

function decodeCandidate(
  value: string
): LuaTable | null {
  const fields = value.split(",");
  const candidateIndex =
    numberToken(fields[0]);
  const itemId =
    numberToken(fields[1]);
  const currencyId =
    numberToken(fields[2]);

  if (
    candidateIndex === null ||
    (
      itemId === null &&
      currencyId === null
    )
  ) {
    return null;
  }

  const candidate: LuaTable = {
    candidateIndex
  };

  setNumber(
    candidate,
    "itemID",
    fields[1]
  );

  setNumber(
    candidate,
    "currencyID",
    fields[2]
  );

  setNumber(
    candidate,
    "quality",
    fields[3]
  );

  return candidate;
}

function decodeCandidates(
  value: string
): LuaTable {
  const result: LuaTable = {};

  if (!value) {
    return result;
  }

  let index = 1;

  for (
    const candidateValue of
    value.split("/")
  ) {
    const candidate =
      decodeCandidate(
        candidateValue
      );

    if (candidate) {
      result[
        String(index)
      ] = candidate;

      index += 1;
    }
  }

  return result;
}

function decodeSlot(
  value: string
): LuaTable | null {
  const separator =
    value.indexOf(":");

  const headerText =
    separator >= 0
      ? value.slice(0, separator)
      : value;

  const candidateText =
    separator >= 0
      ? value.slice(separator + 1)
      : "";

  const fields =
    headerText.split(",");

  const slotIndex =
    numberToken(fields[0]);

  const dataSlotIndex =
    numberToken(fields[1]);

  if (
    slotIndex === null ||
    dataSlotIndex === null
  ) {
    return null;
  }

  const slot: LuaTable = {
    slotIndex,
    dataSlotIndex,
    reagents:
      decodeCandidates(
        candidateText
      )
  };

  setNumber(
    slot,
    "dataSlotType",
    fields[2]
  );

  setNumber(
    slot,
    "reagentType",
    fields[3]
  );

  setNumber(
    slot,
    "quantityRequired",
    fields[4]
  );

  setTrue(
    slot,
    "required",
    fields[5]
  );

  setNumber(
    slot,
    "orderSource",
    fields[6]
  );

  setTrue(
    slot,
    "hiddenInCraftingForm",
    fields[7]
  );

  return slot;
}

function decodeCompactSchema(
  value: string
): LuaTable | null {
  const parts = value.split("|");

  if (
    parts[0] !== STORAGE_FORMAT ||
    !parts[1]
  ) {
    return null;
  }

  const fields =
    parts[1].split(",");

  const recipeId =
    numberToken(fields[0]);

  if (recipeId === null) {
    return null;
  }

  const reagentSlots: LuaTable = {};
  let slotIndex = 1;

  for (
    const slotValue of
    parts.slice(2)
  ) {
    const slot =
      decodeSlot(slotValue);

    if (slot) {
      reagentSlots[
        String(slotIndex)
      ] = slot;

      slotIndex += 1;
    }
  }

  const schema: LuaTable = {
    recipeID: recipeId,
    reagentSlots
  };

  setNumber(
    schema,
    "recipeType",
    fields[1]
  );

  setNumber(
    schema,
    "outputItemID",
    fields[2]
  );

  setNumber(
    schema,
    "quantityMin",
    fields[3]
  );

  setNumber(
    schema,
    "quantityMax",
    fields[4]
  );

  setTrue(
    schema,
    "hasCraftingOperationInfo",
    fields[5]
  );

  setTrue(
    schema,
    "isRecraft",
    fields[6]
  );

  return schema;
}

export function decodeRecipeReagentSchemaValue(
  value: LuaValue | undefined
): LuaTable | null {
  const legacy =
    asLegacyTable(value);

  if (legacy) {
    return legacy;
  }

  if (
    typeof value !== "string"
  ) {
    return null;
  }

  return decodeCompactSchema(value);
}