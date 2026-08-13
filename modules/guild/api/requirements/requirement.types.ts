export type GuildRequirementInput = {
  title: string;
  description: string | null;
  category: string;
  minimumItemLevel: number | null;
  sortOrder: number;
};
