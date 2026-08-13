import {
  asNumber,
  asString,
  asTable,
  numericValues,
  unixTimestampToIso
} from "../../../data-platform/api/integrations/addon/addon-import.lua-utils.js";
import type {
  LuaTable,
  LuaValue
} from "../../../data-platform/api/integrations/addon/addon-import.types.js";
import type {
  AddonGuildMember,
  AddonGuildSnapshot
} from "./roster-import.types.js";

function normalizeMember(
  value: LuaValue
): AddonGuildMember | null {
  const member =
    asTable(value);

  if (!member) {
    return null;
  }

  const name =
    asString(member.name);

  if (!name) {
    return null;
  }

  return {
    name,

    className:
      asString(
        member.className
      ) ??
      "Unknown",

    level:
      asNumber(member.level) ??
      0,

    rank:
      asString(member.rank) ??
      "Member",

    rankIndex:
      asNumber(
        member.rankIndex
      ) ??
      0,

    note:
      asString(member.note),

    officerNote:
      asString(
        member.officerNote
      )
  };
}

export function normalizeGuildSnapshot(
  root: LuaTable
): AddonGuildSnapshot {
  const memberTable =
    asTable(root.members);

  const members =
    memberTable
      ? numericValues(memberTable)
          .map(normalizeMember)
          .filter(
            (
              member
            ): member is AddonGuildMember =>
              member !== null
          )
      : [];

  return {
    addonVersion:
      asString(
        root.addonVersion
      ) ??
      "unknown",

    schemaVersion:
      asNumber(
        root.schemaVersion
      ) ??
      0,

    guildName:
      asString(
        root.guildName
      ) ??
      "Unknown",

    realm:
      asString(root.realm) ??
      "Unknown",

    region:
      (
        asString(root.region) ??
        "EU"
      ).toLowerCase(),

    capturedAt:
      unixTimestampToIso(
        root.capturedAt
      ),

    members
  };
}
