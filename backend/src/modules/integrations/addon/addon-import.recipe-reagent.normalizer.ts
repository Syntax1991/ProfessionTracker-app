import {
  asNumber,
  asTable,
  numericValues
} from "./addon-import.lua-utils.js";
import type {
  AddonRecipeReagentCandidate,
  AddonRecipeReagentSchema,
  AddonRecipeReagentSlot,
  LuaTable,
  LuaValue
} from "./addon-import.types.js";

function asBoolean(
  value:
    LuaValue | undefined
): boolean | null {
  return typeof value === "boolean"
    ? value
    : null;
}

function optionalNumber(
  value:
    LuaValue | undefined
): number | null {
  return asNumber(
    value
  );
}

function nonNegativeNumber(
  value:
    LuaValue | undefined,
  fallback = 0
): number {
  const number =
    asNumber(
      value
    );

  return (
    number !== null &&
    number >= 0
  )
    ? number
    : fallback;
}

function positiveIndex(
  value:
    LuaValue | undefined
): number | null {
  const number =
    asNumber(
      value
    );

  return (
    number !== null &&
    number > 0
  )
    ? number
    : null;
}

function normalizeCandidate(
  value: LuaValue,
  fallbackIndex: number
): AddonRecipeReagentCandidate | null {
  const reagent =
    asTable(
      value
    );

  if (!reagent) {
    return null;
  }

  const itemId =
    optionalNumber(
      reagent.itemID
    );

  const currencyId =
    optionalNumber(
      reagent.currencyID
    );

  if (
    itemId === null &&
    currencyId === null
  ) {
    return null;
  }

  return {
    candidateIndex:
      positiveIndex(
        reagent.candidateIndex
      ) ??
      fallbackIndex,

    itemId,

    currencyId,

    quality:
      optionalNumber(
        reagent.quality
      )
  };
}

function normalizeCandidates(
  table: LuaTable | null
): AddonRecipeReagentCandidate[] {
  return numericValues(
    table
  )
    .map(
      (
        value,
        index
      ) =>
        normalizeCandidate(
          value,
          index + 1
        )
    )
    .filter(
      (
        candidate
      ): candidate is AddonRecipeReagentCandidate =>
        candidate !== null
    );
}

function normalizeSlot(
  value: LuaValue
): AddonRecipeReagentSlot | null {
  const slot =
    asTable(
      value
    );

  if (!slot) {
    return null;
  }

  const slotIndex =
    positiveIndex(
      slot.slotIndex
    );

  const dataSlotIndex =
    positiveIndex(
      slot.dataSlotIndex
    );

  if (
    slotIndex === null ||
    dataSlotIndex === null
  ) {
    return null;
  }

  return {
    slotIndex,

    dataSlotIndex,

    dataSlotType:
      nonNegativeNumber(
        slot.dataSlotType
      ),

    reagentType:
      nonNegativeNumber(
        slot.reagentType
      ),

    quantityRequired:
      nonNegativeNumber(
        slot.quantityRequired
      ),

    required:
      asBoolean(
        slot.required
      ) ??
      false,

    orderSource:
      optionalNumber(
        slot.orderSource
      ),

    hiddenInCraftingForm:
      asBoolean(
        slot.hiddenInCraftingForm
      ) ??
      false,

    reagents:
      normalizeCandidates(
        asTable(
          slot.reagents
        )
      )
  };
}

export function normalizeRecipeReagentSchema(
  value:
    LuaValue | undefined
): AddonRecipeReagentSchema | null {
  const schema =
    asTable(
      value
    );

  if (!schema) {
    return null;
  }

  const recipeId =
    positiveIndex(
      schema.recipeID
    );

  if (recipeId === null) {
    return null;
  }

  const reagentSlots =
    numericValues(
      asTable(
        schema.reagentSlots
      )
    )
      .map(
        normalizeSlot
      )
      .filter(
        (
          slot
        ): slot is AddonRecipeReagentSlot =>
          slot !== null
      );

  return {
    recipeId,

    recipeType:
      optionalNumber(
        schema.recipeType
      ),

    outputItemId:
      optionalNumber(
        schema.outputItemID
      ),

    quantityMin:
      nonNegativeNumber(
        schema.quantityMin
      ),

    quantityMax:
      nonNegativeNumber(
        schema.quantityMax
      ),

    hasCraftingOperationInfo:
      asBoolean(
        schema.hasCraftingOperationInfo
      ) ??
      false,

    isRecraft:
      asBoolean(
        schema.isRecraft
      ) ??
      false,

    reagentSlots
  };
}