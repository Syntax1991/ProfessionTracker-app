import { AppError } from "../../../shared/errors/AppError.js";
import { inferProfessionKeyFromRecipeCatalog } from "./addon-import.normalizer.js";
import {
  createExpansionKey,
  getSyncDate
} from "./addon-import.persistence-utils.js";
import { AddonRecipeCapabilityPersistence } from "./addon-import.recipe.capability.persistence.js";
import { createRecipeMapKey } from "./addon-import.recipe.persistence-utils.js";
import type {
  AddonImportTransaction,
  ProfessionIdMap,
  RecipePersistenceResult
} from "./addon-import.persistence.types.js";
import type {
  AddonRecipeCatalog,
  AddonSnapshot
} from "./addon-import.types.js";

export class AddonRecipeCatalogPersistence {
  private readonly capabilityPersistence =
    new AddonRecipeCapabilityPersistence();

  async persist(
    transaction: AddonImportTransaction,
    snapshot: AddonSnapshot,
    professionIds: ProfessionIdMap,
    recipeIds: Map<string, string>,
    result: RecipePersistenceResult
  ): Promise<void> {
    for (
      const catalog of
      snapshot.recipeCatalogs
    ) {
      await this.persistCatalog(
        transaction,
        snapshot,
        catalog,
        professionIds,
        recipeIds,
        result
      );
    }
  }

  private async persistCatalog(
    transaction: AddonImportTransaction,
    snapshot: AddonSnapshot,
    catalog: AddonRecipeCatalog,
    professionIds: ProfessionIdMap,
    recipeIds: Map<string, string>,
    result: RecipePersistenceResult
  ): Promise<void> {
    const professionKey =
      inferProfessionKeyFromRecipeCatalog(
        catalog,
        snapshot
      );

    if (!professionKey) {
      throw new AppError(
        400,
        `Beruf für Rezept-Skill-Line ${catalog.skillLineId} konnte nicht bestimmt werden.`
      );
    }

    const professionId =
      professionIds.get(
        professionKey
      );

    if (!professionId) {
      throw new AppError(
        400,
        `Beruf "${professionKey}" fehlt in der Datenbank.`
      );
    }

    const expansion =
      createExpansionKey(
        catalog.expansionName,
        catalog.skillLineId
      );

    const syncDate =
      getSyncDate(
        catalog.capturedAt
      );

    for (
      const recipe of
      catalog.recipes
    ) {
      const storedRecipe =
        await transaction
          .craftRecipe
          .upsert({
            where: {
              professionId_gameRecipeId: {
                professionId,

                gameRecipeId:
                  recipe.gameRecipeId
              }
            },

            create: {
              professionId,

              gameRecipeId:
                recipe.gameRecipeId,

              skillLineId:
                catalog.skillLineId,

              expansion,

              name:
                recipe.name,

              categoryId:
                recipe.categoryId,

              baseDifficulty:
                recipe.baseDifficulty,

              source:
                "ADDON",

              lastSyncedAt:
                syncDate
            },

            update: {
              skillLineId:
                catalog.skillLineId,

              expansion,

              name:
                recipe.name,

              categoryId:
                recipe.categoryId,

              baseDifficulty:
                recipe.baseDifficulty,

              source:
                "ADDON",

              lastSyncedAt:
                syncDate
            }
          });

      recipeIds.set(
        createRecipeMapKey(
          catalog.skillLineId,
          recipe.gameRecipeId
        ),
        storedRecipe.id
      );

      await this.capabilityPersistence.persist(
        transaction,
        professionId,
        expansion,
        catalog.skillLineId,
        recipe,
        storedRecipe.id
      );

      result.recipes +=
        1;
    }

    result.catalogs +=
      1;
  }
}