export type ProfessionOverviewItem = {
  id: string;
  key: string;
  name: string;
  category: string;
  characterCount: number;
  trackedCharacterCount: number;
  activeNodeCount: number;
  catalogRecipeCount: number;
  capabilityCount: number;
};

export type ProfessionOverview = {
  items: ProfessionOverviewItem[];
};

export type ProfessionCoverageEntry = {
  id: string;
  name: string;
  skillPoints: number;
  maxSkillPoints: number | null;
  unlocked: boolean;
  source: string;
};

export type ProfessionRecipeCoverage = {
  id: string;
  gameRecipeId: number;
  name: string;
  skillLineId: number | null;
  expansion: string;
  categoryId: number | null;
  source: string;
  lastSyncedAt: string | null;
};

export type ProfessionCapabilityCoverage = {
  id: string;
  key: string;
  name: string;
  type: string;
  slotKey: string | null;
  description: string | null;
  expansion: string;
  recipeCount: number;
  primaryRecipeCount: number;
};

export type ProfessionCharacterCoverage = {
  characterProfessionId: string;

  character: {
    id: string;
    name: string;
    realm: string;
    className: string;
    level: number;
  };

  skill: number;
  knowledgePoints: number;

  dataStatus:
    | "TRACKED"
    | "PARTIAL"
    | "UNTRACKED"
    | "NO_CATALOG";

  slots:
    ProfessionCoverageEntry[];

  recipes:
    ProfessionRecipeCoverage[];

  capabilities:
    ProfessionCapabilityCoverage[];
};

export type ProfessionDetail = {
  profession: {
    id: string;
    key: string;
    name: string;
    category: string;
  };

  summary: {
    characterCount: number;
    trackedCharacterCount: number;
    missingCharacterCount: number;
    slotCount: number;
    catalogRecipeCount: number;
    learnedRecipeCount: number;
    catalogCapabilityCount: number;
    coveredCapabilityCount: number;
  };

  characters:
    ProfessionCharacterCoverage[];
};