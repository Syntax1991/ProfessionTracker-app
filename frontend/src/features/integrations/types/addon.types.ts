export type AddonClientInfo = {
  version: string | null;
  build: string | null;
  interfaceVersion: number | null;
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