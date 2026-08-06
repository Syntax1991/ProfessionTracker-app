import { ProfessionRepository } from "./profession.repository.js";

export class ProfessionService {
  constructor(
    private readonly repository:
      ProfessionRepository
  ) {}

  async list() {
    const professions =
      await this.repository.findAll();

    return professions.map(
      (profession) => ({
        id: profession.id,
        key: profession.key,
        name: profession.name,
        category:
          profession.category,
        order: profession.order,
        assignmentCount:
          profession
            ._count
            .assignments
      })
    );
  }
}