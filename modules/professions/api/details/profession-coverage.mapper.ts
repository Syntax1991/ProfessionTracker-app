import { mapProfessionCapabilities } from "./profession-capability.mapper.js";
import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type {
  ProfessionCharacterCoverage
} from "./profession-detail.types.js";
import { mapProfessionRecipeCoverage } from "./profession-recipe-coverage.mapper.js";
import { mapProfessionSlotCoverage } from "./profession-slot-coverage.mapper.js";

type DetailRecord =
  NonNullable<
    Awaited<
      ReturnType<
        ProfessionDetailRepository["findById"]
      >
    >
  >;

type DetailAssignment =
  DetailRecord["assignments"][number];

export function mapProfessionCharacterCoverage(
  assignment: DetailAssignment,
  hasSpecializationCatalog: boolean,
  hasRecipeCatalog: boolean,
  hasCapabilityCatalog: boolean
): ProfessionCharacterCoverage {
  const slotCoverage =
    mapProfessionSlotCoverage(
      assignment
    );

  const recipes =
    mapProfessionRecipeCoverage(
      assignment
    );

  const capabilities =
    mapProfessionCapabilities(
      assignment
    );

  return {
    characterProfessionId:
      assignment.id,

    character: {
      id:
        assignment.character.id,

      name:
        assignment.character.name,

      realm:
        assignment.character.realm,

      className:
        assignment.character.className,

      level:
        assignment.character.level
    },

    skill:
      assignment.skill,

    knowledgePoints:
      assignment.knowledgePoints,

    dataStatus:
      resolveDataStatus(
        hasSpecializationCatalog,
        hasRecipeCatalog,
        hasCapabilityCatalog,
        slotCoverage.hasNonSlotProgress,
        slotCoverage.slots.length,
        recipes.length,
        capabilities.length
      ),

    slots:
      slotCoverage.slots,

    recipes,
    capabilities
  };
}

function resolveDataStatus(
  hasSpecializationCatalog: boolean,
  hasRecipeCatalog: boolean,
  hasCapabilityCatalog: boolean,
  hasNonSlotProgress: boolean,
  slotCount: number,
  recipeCount: number,
  capabilityCount: number
): ProfessionCharacterCoverage["dataStatus"] {
  if (
    slotCount > 0 ||
    recipeCount > 0 ||
    capabilityCount > 0
  ) {
    return "TRACKED";
  }

  if (
    !hasSpecializationCatalog &&
    !hasRecipeCatalog &&
    !hasCapabilityCatalog
  ) {
    return "NO_CATALOG";
  }

  if (hasNonSlotProgress) {
    return "PARTIAL";
  }

  return "UNTRACKED";
}