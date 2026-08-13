import { Router } from "express";
import {
  asyncHandler
} from "../../../../apps/api/src/shared/http/asyncHandler.js";
import {
  ProfessionDetailController
} from "./profession-detail.controller.js";
import {
  ProfessionDetailRepository
} from "./profession-detail.repository.js";
import {
  ProfessionDetailService
} from "./profession-detail.service.js";
import {
  ProfessionRecipeRepository
} from "./profession-recipe.repository.js";

const repository =
  new ProfessionDetailRepository();

const recipeRepository =
  new ProfessionRecipeRepository();

const service =
  new ProfessionDetailService(
    repository,
    recipeRepository
  );

const controller =
  new ProfessionDetailController(
    service
  );

export const professionDetailRouter =
  Router();

professionDetailRouter.get(
  "/",
  asyncHandler(
    controller.getOverview
  )
);

professionDetailRouter.get(
  "/:professionId/recipes",
  asyncHandler(
    controller.getRecipes
  )
);

professionDetailRouter.get(
  "/:professionId",
  asyncHandler(
    controller.getDetail
  )
);