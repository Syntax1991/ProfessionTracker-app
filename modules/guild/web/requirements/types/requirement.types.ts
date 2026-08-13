export type GuildRequirementCategory =
  | "GEAR"
  | "KEYSTONE"
  | "ATTENDANCE"
  | "PROFESSION"
  | "OTHER";

export type GuildRequirement = {
  id: string;
  title: string;
  description: string | null;
  category: GuildRequirementCategory;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type GuildRequirementInput = {
  title: string;
  description: string | null;
  category: GuildRequirementCategory;
  sortOrder: number;
};

export type GuildRequirementListResponse = {
  items: GuildRequirement[];
  total: number;
};
