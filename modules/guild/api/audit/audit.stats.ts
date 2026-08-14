import type { BattleNetCharacterEquipment } from "../../../data-platform/api/integrations/battlenet/battlenet.types.js";
import type {
  GuildMemberAuditStats,
  GuildMemberGearSlotStats
} from "./audit.types.js";

/**
 * Slots that reliably carry an enchant across current WoW content.
 * Head/shoulder enchants exist only through expansion-specific systems
 * (renown, crests, ...) that come and go, so they're deliberately left
 * out to avoid false "missing enchant" flags.
 */
const enchantableSlotTypes =
  new Set([
    "BACK",
    "CHEST",
    "WRIST",
    "LEGS",
    "FEET",
    "FINGER_1",
    "FINGER_2",
    "MAIN_HAND",
    "OFF_HAND"
  ]);

export function computeAuditStats(
  equipment: BattleNetCharacterEquipment
): GuildMemberAuditStats {
  const items =
    equipment.equipped_items ??
    [];

  let itemLevelSum = 0;
  let itemLevelCount = 0;
  let missingEnchantSlots = 0;
  let totalSocketCount = 0;
  let filledSocketCount = 0;

  for (const item of items) {
    const level =
      item.level?.value;

    if (typeof level === "number") {
      itemLevelSum += level;
      itemLevelCount += 1;
    }

    const slotType =
      item.slot?.type;

    if (
      slotType &&
      enchantableSlotTypes.has(
        slotType
      )
    ) {
      const hasEnchant =
        Array.isArray(
          item.enchantments
        ) &&
        item.enchantments.length >
          0;

      if (!hasEnchant) {
        missingEnchantSlots += 1;
      }
    }

    for (const socket of item.sockets ??
      []) {
      totalSocketCount += 1;

      if (socket.item) {
        filledSocketCount += 1;
      }
    }
  }

  return {
    averageItemLevel:
      itemLevelCount > 0
        ? itemLevelSum /
          itemLevelCount
        : null,
    missingEnchantSlots,
    totalSocketCount,
    filledSocketCount
  };
}

export function computeGearSlots(
  equipment: BattleNetCharacterEquipment
): GuildMemberGearSlotStats[] {
  const items =
    equipment.equipped_items ??
    [];

  const slots: GuildMemberGearSlotStats[] =
    [];

  for (const item of items) {
    const slotType =
      item.slot?.type;

    if (!slotType) {
      continue;
    }

    const isEnchantable =
      enchantableSlotTypes.has(
        slotType
      );

    const hasEnchant =
      Array.isArray(
        item.enchantments
      ) &&
      item.enchantments.length >
        0;

    let socketCount = 0;
    let filledSocketCount = 0;

    for (const socket of item.sockets ??
      []) {
      socketCount += 1;

      if (socket.item) {
        filledSocketCount += 1;
      }
    }

    slots.push({
      slotKey: slotType,
      itemName:
        item.name ?? null,
      itemLevel:
        item.level?.value ??
        null,
      quality:
        item.quality?.type ??
        null,
      enchantStatus:
        !isEnchantable
          ? "NOT_APPLICABLE"
          : hasEnchant
            ? "READY"
            : "MISSING",
      socketCount,
      filledSocketCount,
      upgradeCurrent:
        item.upgrades?.value ??
        null,
      upgradeMax:
        item.upgrades
          ?.max_value ?? null
    });
  }

  return slots;
}
