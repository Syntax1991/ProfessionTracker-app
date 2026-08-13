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
  minimumItemLevel: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type GuildRequirementInput = {
  title: string;
  description: string | null;
  category: GuildRequirementCategory;
  minimumItemLevel: number | null;
  sortOrder: number;
};

export type GuildRequirementListResponse = {
  items: GuildRequirement[];
  total: number;
};
