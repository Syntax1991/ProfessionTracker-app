export type LuaValue =
  | string
  | number
  | boolean
  | null
  | LuaTable;

export type LuaTable = {
  [key: string]: LuaValue;
};

export type AddonRecipeOperationMetric =
  | string
  | number
  | boolean;

export type AddonRecipeOperationMetrics =
  Record<
    string,
    AddonRecipeOperationMetric
  >;

export type AddonClientInfo = {
  version: string | null;
  build: string | null;
  interfaceVersion: number | null;
};

export type AddonSpecializationNode = {
  externalNodeId: number;
  name: string;
  description: string | null;
  maxRank: number | null;
  knowledgeEntryId: number | null;
  knowledgeMaxRank: number | null;
  sortOrder: number;
  isRoot: boolean;
};

export type AddonSpecializationTree = {
  externalTreeId: number;
  name: string;
  description: string | null;
  rootNodeExternalId: number | null;
  sortOrder: number;
  nodes: AddonSpecializationNode[];
};

export type AddonProfessionCatalog = {
  skillLineId: number;
  displayName: string;
  expansionName: string | null;
  trees: AddonSpecializationTree[];
};

export type AddonRecipe = {
  gameRecipeId: number;
  name: string;
  categoryId: number | null;
  categoryName: string | null;
  parentCategoryId: number | null;
  parentCategoryName: string | null;
  baseDifficulty: number | null;
  operationMetrics:
    AddonRecipeOperationMetrics;
};

export type AddonRecipeCatalog = {
  skillLineId: number;
  displayName: string;
  expansionName: string | null;
  recipes: AddonRecipe[];
  capturedAt: string | null;
};

export type AddonNodeProgress = {
  externalTreeId: number;
  externalNodeId: number;
  rank: number;
  knowledgeRank: number;
  unlockRank: number;
};

export type AddonExpansion = {
  skillLineId: number;
  displayName: string;
  expansionName: string | null;
  knowledgeAvailable: number;
  investedKnowledge: number;
  progress: AddonNodeProgress[];
  recipeIds: number[] | null;
  recipeCapturedAt: string | null;
  capturedAt: string | null;
};

export type AddonProfession = {
  name: string;
  professionKey: string | null;
  skillLineId: number | null;
  skillLevel: number;
  maxSkillLevel: number;
  skillModifier: number;
  activeExpansionSkillLineId: number | null;
  expansions: AddonExpansion[];
};

export type AddonCharacter = {
  key: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  snapshotReason: string | null;
  lastUpdatedAt: string | null;
  professions: AddonProfession[];
};

export type AddonSnapshot = {
  addonVersion: string;
  schemaVersion: number;
  client: AddonClientInfo;
  catalogs: AddonProfessionCatalog[];
  recipeCatalogs: AddonRecipeCatalog[];
  characters: AddonCharacter[];
};

export type AddonCatalogPreview = {
  skillLineId: number;
  displayName: string;
  expansionName: string | null;
  trees: number;
  specializationNodes: number;
};

export type AddonProfessionPreview = {
  name: string;
  professionKey: string | null;
  skillLevel: number;
  maxSkillLevel: number;
  expansions: number;
  investedKnowledge: number;
};

export type AddonCharacterPreview = {
  key: string;
  name: string;
  realm: string;
  region: string;
  className: string;
  level: number;
  professions: AddonProfessionPreview[];
};

export type AddonImportPreview = {
  addonVersion: string;
  schemaVersion: number;
  client: AddonClientInfo;
  catalogs: AddonCatalogPreview[];
  characters: AddonCharacterPreview[];
  totals: {
    characters: number;
    professionAssignments: number;
    expansions: number;
    trees: number;
    specializationNodes: number;
    investedNodes: number;
    investedKnowledge: number;
  };
};

export type AddonImportResult = {
  addonVersion: string;
  schemaVersion: number;
  importedAt: string;
  processed: {
    catalogs: number;
    trees: number;
    specializationNodes: number;
    characters: number;
    professionAssignments: number;
    progressEntries: number;
  };
};