import type { RequestHandler } from "express";
import { ProfessionDetailService } from "./profession-detail.service.js";
import { professionDetailParamsSchema } from "./profession-detail.validation.js";

export class ProfessionDetailController {
  constructor(
    private readonly service:
      ProfessionDetailService
  ) {}

  getOverview:
    RequestHandler = async (
      _request,
      response
    ) => {
      response.json(
        await this.service.getOverview()
      );
    };

  getDetail:
    RequestHandler = async (
      request,
      response
    ) => {
      const params =
        professionDetailParamsSchema.parse(
          request.params
        );

      response.json(
        await this.service.getDetail(
          params.professionId
        )
      );
    };
}