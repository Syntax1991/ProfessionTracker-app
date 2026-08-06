import { AppError } from "../../shared/errors/AppError.js";
import { mapProfessionDetail } from "./profession-detail.mapper.js";
import { ProfessionDetailRepository } from "./profession-detail.repository.js";
import { mapProfessionOverview } from "./profession-overview.mapper.js";

export class ProfessionDetailService {
  constructor(
    private readonly repository:
      ProfessionDetailRepository
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
}