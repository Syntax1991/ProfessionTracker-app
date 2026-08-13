import type {
  RequestHandler
} from "express";
import { AddonImportService } from "./addon-import.service.js";
import { addonSavedVariablesSchema } from "./addon-import.validation.js";

export class AddonImportController {
  constructor(
    private readonly service:
      AddonImportService
  ) {}

  preview: RequestHandler = async (
    request,
    response
  ) => {
    const source =
      addonSavedVariablesSchema.parse(
        request.body
      );

    response.json(
      this.service.preview(
        source
      )
    );
  };

  importSavedVariables:
    RequestHandler = async (
      request,
      response
    ) => {
      const source =
        addonSavedVariablesSchema.parse(
          request.body
        );

      const result =
        await this.service
          .importSavedVariables(
            source
          );

      response.json(
        result
      );
    };
}