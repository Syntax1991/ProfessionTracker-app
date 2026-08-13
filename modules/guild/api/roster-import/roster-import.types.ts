export type AddonGuildMember = {
  name: string;
  className: string;
  level: number;
  rank: string;
  rankIndex: number;
  note: string | null;
  officerNote: string | null;
};

export type AddonGuildSnapshot = {
  addonVersion: string;
  schemaVersion: number;
  guildName: string;
  realm: string;
  region: string;
  capturedAt: string | null;
  members: AddonGuildMember[];
};

export type GuildRosterImportPreview = {
  addonVersion: string;
  schemaVersion: number;
  guildName: string;
  realm: string;
  region: string;
  capturedAt: string | null;
  totalMembers: number;
  members: AddonGuildMember[];
};

export type GuildRosterImportProcessed = {
  members: number;
  created: number;
  updated: number;
};

export type GuildRosterImportResult = {
  addonVersion: string;
  schemaVersion: number;
  importedAt: string;
  processed: GuildRosterImportProcessed;
};
