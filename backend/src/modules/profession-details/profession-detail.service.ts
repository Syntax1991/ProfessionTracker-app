import { AppError } from "../../shared/errors/AppError.js";
import { mapProfessionDetail } from "./profession-detail.mapper.js";
import { ProfessionDetailRepository } from "./profession-detail.repository.js";
import { mapProfessionOverview } from "./profession-overview.mapper.js";
import { mapProfessionRecipeCatalog } from "./profession-recipe.mapper.js";
import { ProfessionRecipeRepository } from "./profession-recipe.repository.js";

export class ProfessionDetailService {
  constructor(
    private readonly repository:
      ProfessionDetailRepository,

    private readonly recipeRepository:
      ProfessionRecipeRepository
  ) {}

  async getOverview() {
    const professions =
      await this.repository.findOverview();

    return {
      items:
        mapProfessionOverview(
          professions
        )
    };
  }

  async getDetail(
    professionId: string
  ) {
    const profession =
      await this.repository.findById(
        professionId
      );

    if (!profession) {
      throw new AppError(
        404,
        "Beruf nicht gefunden."
      );
    }

    return mapProfessionDetail(
      profession
    );
  }

  async getRecipes(
    professionId: string
  ) {
    const profession =
      await this.recipeRepository
        .findByProfessionId(
          professionId
        );

    if (!profession) {
      throw new AppError(
        404,
        "Beruf nicht gefunden."
      );
    }

    return mapProfessionRecipeCatalog(
      profession
    );
  }
}