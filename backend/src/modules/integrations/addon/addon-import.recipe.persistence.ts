import { AddonRecipeCatalogPersistence } from "./addon-import.recipe.catalog.persistence.js";
import { AddonCharacterRecipePersistence } from "./addon-import.recipe.character.persistence.js";
import type {
  AddonImportTransaction,
  ProfessionIdMap,
  RecipePersistenceResult
} from "./addon-import.persistence.types.js";
import type {
  AddonSnapshot
} from "./addon-import.types.js";

export class AddonRecipePersistence {
  private readonly catalogPersistence =
    new AddonRecipeCatalogPersistence();

  private readonly characterPersistence =
    new AddonCharacterRecipePersistence();

  async persist(
    transaction: AddonImportTransaction,
    snapshot: AddonSnapshot,
    professionIds: ProfessionIdMap
  ): Promise<RecipePersistenceResult> {
    const result:
      RecipePersistenceResult = {
        catalogs: 0,
        recipes: 0,
        learnedRecipes: 0
      };

    const recipeIds =
      new Map<
        string,
        string
      >();

    await this.catalogPersistence.persist(
      transaction,
      snapshot,
      professionIds,
      recipeIds,
      result
    );

    await this.characterPersistence.persist(
      transaction,
      snapshot,
      professionIds,
      recipeIds,
      result
    );

    return result;
  }
}