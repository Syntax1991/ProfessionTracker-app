import type {
  AddonImportTransaction
} from "./addon-import.persistence.types.js";
import type {
  AddonRecipe
} from "./addon-import.types.js";

function createCapabilityKey(
  skillLineId: number,
  categoryId: number
): string {
  return (
    `addon-category:${skillLineId}:${categoryId}`
  );
}

function createDescription(
  recipe: AddonRecipe
): string | null {
  if (
    recipe.parentCategoryName &&
    recipe.parentCategoryName !==
      recipe.categoryName
  ) {
    return (
      `${recipe.parentCategoryName} → ${recipe.categoryName}`
    );
  }

  return recipe.categoryName;
}

export class AddonRecipeCapabilityPersistence {
  async persist(
    transaction:
      AddonImportTransaction,
    professionId: string,
    expansion: string,
    skillLineId: number,
    recipe:
      AddonRecipe,
    craftRecipeId: string
  ): Promise<void> {
    if (
      recipe.categoryId ===
        null ||
      !recipe.categoryName
    ) {
      return;
    }

    const capability =
      await transaction
        .craftCapability
        .upsert({
          where: {
            professionId_expansion_key: {
              professionId,
              expansion,

              key:
                createCapabilityKey(
                  skillLineId,
                  recipe.categoryId
                )
            }
          },

          create: {
            professionId,
            expansion,

            key:
              createCapabilityKey(
                skillLineId,
                recipe.categoryId
              ),

            name:
              recipe.categoryName,

            type:
              "RECIPE_GROUP",

            slotKey:
              null,

            description:
              createDescription(
                recipe
              ),

            sortOrder:
              recipe.categoryId
          },

          update: {
            name:
              recipe.categoryName,

            type:
              "RECIPE_GROUP",

            slotKey:
              null,

            description:
              createDescription(
                recipe
              ),

            sortOrder:
              recipe.categoryId
          }
        });

    await transaction
      .craftRecipeCapability
      .upsert({
        where: {
          craftRecipeId_capabilityId: {
            craftRecipeId,

            capabilityId:
              capability.id
          }
        },

        create: {
          craftRecipeId,

          capabilityId:
            capability.id,

          isPrimary:
            false
        },

        update: {
          isPrimary:
            false
        }
      });
  }
}