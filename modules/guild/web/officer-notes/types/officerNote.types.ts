export type GuildOfficerNote = {
  id: string;
  memberId: string;
  authorCharacter: string;
  body: string;
  createdAt: string;
};

export type GuildOfficerNoteInput = {
  memberId: string;
  body: string;
};

export type GuildOfficerNoteListResponse = {
  items: GuildOfficerNote[];
  total: number;
};
