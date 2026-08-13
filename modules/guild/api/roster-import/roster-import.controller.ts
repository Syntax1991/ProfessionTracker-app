import type {
  RequestHandler
} from "express";
import { addonSavedVariablesSchema } from "../../../data-platform/api/integrations/addon/addon-import.validation.js";
import { GuildRosterImportService } from "./roster-import.service.js";

export class GuildRosterImportController {
  constructor(
    private readonly service:
      GuildRosterImportService
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
