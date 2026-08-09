import {
  calculateProfessionRecipeReadiness
} from "./profession-recipe-readiness.js";
import type {
  ProfessionRecipeRepository
} from "./profession-recipe.repository.js";
import type {
  ProfessionRecipeCapability,
  ProfessionRecipeCatalog,
  ProfessionRecipeCatalogItem,
  ProfessionRecipeCrafter
} from "./profession-recipe.types.js";

type RecipeCatalogRecord =
  NonNullable<
    Awaited<
      ReturnType<
        ProfessionRecipeRepository["findByProfessionId"]
      >
    >
  >;

type RecipeRecord =
  RecipeCatalogRecord["recipes"][number];

export function mapProfessionRecipeCatalog(
  record: RecipeCatalogRecord
): ProfessionRecipeCatalog {
  const items =
    record.recipes.map(
      mapRecipe
    );

  const craftableRecipeCount =
    items.filter(
      (recipe) =>
        recipe.crafters.length >
        0
    ).length;

  return {
    profession: {
      id:
        record.id,

      key:
        record.key,

      name:
        record.name
    },

    summary: {
      catalogRecipeCount:
        items.length,

      craftableRecipeCount,

      missingRecipeCount:
        items.length -
        craftableRecipeCount
    },

    items
  };
}

function mapRecipe(
  recipe: RecipeRecord
): ProfessionRecipeCatalogItem {
  const capabilities =
    recipe.capabilities
      .map(
        mapCapability
      )
      .sort(
        compareCapabilities
      );

  const crafters =
    recipe.characters
      .map(
        (relation) =>
          mapCrafter(
            recipe.baseDifficulty,
            relation
          )
      )
      .sort(
        compareCrafters
      );

  return {
    id:
      recipe.id,

    gameRecipeId:
      recipe.gameRecipeId,

    name:
      recipe.name,

    expansion:
      recipe.expansion,

    categoryId:
      recipe.categoryId,

    baseDifficulty:
      recipe.baseDifficulty,

    capabilities,
    crafters
  };
}

function mapCapability(
  relation:
    RecipeRecord["capabilities"][number]
): ProfessionRecipeCapability {
  return {
    id:
      relation.capability.id,

    key:
      relation.capability.key,

    name:
      relation.capability.name,

    type:
      relation.capability.type,

    slotKey:
      relation.capability.slotKey,

    description:
      relation.capability.description,

    isPrimary:
      relation.isPrimary
  };
}

function mapCrafter(
  baseDifficulty: number | null,
  relation:
    RecipeRecord["characters"][number]
): ProfessionRecipeCrafter {
  const assignment =
    relation.characterProfession;

  const effectiveSkill =
    assignment.skill +
    assignment.skillModifier;

  const readiness =
    calculateProfessionRecipeReadiness(
      baseDifficulty,
      effectiveSkill
    );

  return {
    characterId:
      assignment.character.id,

    name:
      assignment.character.name,

    realm:
      assignment.character.realm,

    className:
      assignment.character.className,

    level:
      assignment.character.level,

    skill:
      assignment.skill,

    skillModifier:
      assignment.skillModifier,

    effectiveSkill,

    knowledgePoints:
      assignment.knowledgePoints,

    baselineStatus:
      readiness.baselineStatus,

    baselineSkillGap:
      readiness.baselineSkillGap,

    baselineSkillSurplus:
      readiness.baselineSkillSurplus,

    source:
      relation.source,

    lastSyncedAt:
      relation.lastSyncedAt
        ?.toISOString() ??
      null
  };
}

function compareCapabilities(
  left:
    ProfessionRecipeCapability,
  right:
    ProfessionRecipeCapability
): number {
  if (
    left.isPrimary !==
    right.isPrimary
  ) {
    return left.isPrimary
      ? -1
      : 1;
  }

  return left.name.localeCompare(
    right.name,
    "de"
  );
}

function compareCrafters(
  left:
    ProfessionRecipeCrafter,
  right:
    ProfessionRecipeCrafter
): number {
  const statusDifference =
    getStatusPriority(
      left.baselineStatus
    ) -
    getStatusPriority(
      right.baselineStatus
    );

  return (
    statusDifference ||
    right.effectiveSkill -
      left.effectiveSkill ||
    left.name.localeCompare(
      right.name,
      "de"
    ) ||
    left.realm.localeCompare(
      right.realm,
      "de"
    )
  );
}

function getStatusPriority(
  status:
    ProfessionRecipeCrafter["baselineStatus"]
): number {
  switch (status) {
    case "BASE_SKILL_SUFFICIENT":
      return 0;

    case "RECIPE_BONUS_REQUIRED":
      return 1;

    case "UNKNOWN":
      return 2;
  }
}