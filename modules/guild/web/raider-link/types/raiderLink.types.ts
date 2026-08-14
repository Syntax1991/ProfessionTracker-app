import type { GuildMember } from "../../roster/types/roster.types";

export type RaiderLinkResolution =
  | {
      status: "linked";
      member: GuildMember;
    }
  | {
      status: "choose";
      candidates: GuildMember[];
    }
  | {
      status: "unmatched";
    };
