export type AddonGuildMemberPreview = {
  name: string;
  className: string;
  level: number;
  rank: string;
  rankIndex: number;
  note: string | null;
  officerNote: string | null;
};

export type GuildRosterImportPreview = {
  addonVersion: string;
  schemaVersion: number;
  guildName: string;
  realm: string;
  region: string;
  capturedAt: string | null;
  totalMembers: number;
  members: AddonGuildMemberPreview[];
};

export type GuildRosterImportResult = {
  addonVersion: string;
  schemaVersion: number;
  importedAt: string;
  processed: {
    members: number;
    created: number;
    updated: number;
  };
};
