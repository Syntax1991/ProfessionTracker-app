export type ProfessionRecipeCapability = {
  id: string;
  key: string;
  name: string;
  type: string;
  slotKey: string | null;
  description: string | null;
  isPrimary: boolean;
};

export type ProfessionRecipeCrafter = {
  characterId: string;
  name: string;
  realm: string;
  className: string;
  level: number;
  skill: number;
  knowledgePoints: number;
  source: string;
  lastSyncedAt: string | null;
};

export type ProfessionRecipeCatalogItem = {
  id: string;
  gameRecipeId: number;
  name: string;
  expansion: string;
  categoryId: number | null;
  baseDifficulty: number | null;
  capabilities:
    ProfessionRecipeCapability[];
  crafters:
    ProfessionRecipeCrafter[];
};

export type ProfessionRecipeCatalog = {
  profession: {
    id: string;
    key: string;
    name: string;
  };

  summary: {
    catalogRecipeCount: number;
    craftableRecipeCount: number;
    missingRecipeCount: number;
  };

  items:
    ProfessionRecipeCatalogItem[];
};