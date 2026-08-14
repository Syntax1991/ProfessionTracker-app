import type { GuildMember } from "../types/roster.types";
import {
  ARMOR_TYPE_ORDER,
  ROLE_ORDER,
  resolveArmorType,
  resolveRoleKey,
  type ArmorType,
  type RoleKey
} from "./rosterRoles";

export type RosterSummary = {
  totalMembers: number;
  roleCounts: Record<RoleKey, number>;
  armorCounts: Record<ArmorType, number>;
  averageItemLevel: number | null;
  auditedMemberCount: number;
};

export function computeRosterSummary(
  members: GuildMember[]
): RosterSummary {
  const roleCounts = Object.fromEntries(
    ROLE_ORDER.map((role) => [role, 0])
  ) as Record<RoleKey, number>;

  const armorCounts = Object.fromEntries(
    ARMOR_TYPE_ORDER.map((armorType) => [
      armorType,
      0
    ])
  ) as Record<ArmorType, number>;

  let itemLevelSum = 0;
  let auditedMemberCount = 0;

  for (const member of members) {
    roleCounts[resolveRoleKey(member.role)] += 1;
    armorCounts[
      resolveArmorType(member.className)
    ] += 1;

    if (member.averageItemLevel !== null) {
      itemLevelSum += member.averageItemLevel;
      auditedMemberCount += 1;
    }
  }

  return {
    totalMembers: members.length,
    roleCounts,
    armorCounts,
    averageItemLevel:
      auditedMemberCount > 0
        ? itemLevelSum / auditedMemberCount
        : null,
    auditedMemberCount
  };
}
