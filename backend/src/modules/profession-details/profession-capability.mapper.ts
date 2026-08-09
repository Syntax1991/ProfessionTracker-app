import type { ProfessionDetailRepository } from "./profession-detail.repository.js";
import type {
  ProfessionCapabilityCoverage
} from "./profession-detail.types.js";

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

type AggregatedCapability =
  ProfessionCapabilityCoverage & {
    sortOrder: number;
  };

export function mapProfessionCapabilities(
  assignment: DetailAssignment
): ProfessionCapabilityCoverage[] {
  const capabilityById =
    new Map<
      string,
      AggregatedCapability
    >();

  for (
    const learnedRecipe of
    assignment.recipes
  ) {
    for (
      const relation of
      learnedRecipe
        .recipe
        .capabilities
    ) {
      const capability =
        relation.capability;

      const existing =
        capabilityById.get(
          capability.id
        );

      if (existing) {
        existing.recipeCount +=
          1;

        if (relation.isPrimary) {
          existing.primaryRecipeCount +=
            1;
        }

        continue;
      }

      capabilityById.set(
        capability.id,
        {
          id:
            capability.id,

          key:
            capability.key,

          name:
            capability.name,

          type:
            capability.type,

          slotKey:
            capability.slotKey,

          description:
            capability.description,

          expansion:
            capability.expansion,

          recipeCount:
            1,

          primaryRecipeCount:
            relation.isPrimary
              ? 1
              : 0,

          sortOrder:
            capability.sortOrder
        }
      );
    }
  }

  return [
    ...capabilityById.values()
  ]
    .sort(
      compareCapabilities
    )
    .map(
      toPublicCapability
    );
}

function compareCapabilities(
  left:
    AggregatedCapability,
  right:
    AggregatedCapability
): number {
  return (
    left.type.localeCompare(
      right.type,
      "de"
    ) ||
    left.expansion.localeCompare(
      right.expansion,
      "de"
    ) ||
    left.sortOrder -
      right.sortOrder ||
    left.name.localeCompare(
      right.name,
      "de"
    )
  );
}

function toPublicCapability(
  capability:
    AggregatedCapability
): ProfessionCapabilityCoverage {
  return {
    id:
      capability.id,

    key:
      capability.key,

    name:
      capability.name,

    type:
      capability.type,

    slotKey:
      capability.slotKey,

    description:
      capability.description,

    expansion:
      capability.expansion,

    recipeCount:
      capability.recipeCount,

    primaryRecipeCount:
      capability.primaryRecipeCount
  };
}