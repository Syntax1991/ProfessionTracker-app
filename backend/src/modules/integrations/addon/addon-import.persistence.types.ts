import type {
  Prisma
} from "../../../generated/prisma/client.js";

export type AddonImportTransaction =
  Prisma.TransactionClient;

export type ProfessionIdMap =
  Map<string, string>;

export type AddonNodeIdMap =
  Map<string, string>;

export type CatalogPersistenceResult = {
  catalogs: number;
  trees: number;
  nodes: number;
  nodeIds: AddonNodeIdMap;
};

export type CharacterPersistenceResult = {
  characters: number;
  professionAssignments: number;
  progressEntries: number;
};