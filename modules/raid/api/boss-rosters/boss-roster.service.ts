import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { GuildRosterRepository } from "../../../guild/api/roster/roster.repository.js";
import type { GuildVerificationGuard } from "../../../guild/api/verification/verification.types.js";
import { RaidBossRosterRepository } from "./boss-roster.repository.js";
import type { RaidBossInput } from "./boss-roster.types.js";

export class RaidBossRosterService {
  constructor(
    private readonly repository:
      RaidBossRosterRepository,

    private readonly rosterRepository:
      GuildRosterRepository,

    private readonly verification:
      GuildVerificationGuard
  ) {}

  async listForEvent(
    eventId: string
  ) {
    const event =
      await this.repository.findEventById(
        eventId
      );

    if (!event) {
      throw new AppError(
        404,
        "Raid-Termin nicht gefunden."
      );
    }

    const [bosses, members] =
      await Promise.all([
        this.repository.findBossesForEvent(
          eventId
        ),
        this.rosterRepository.findAll()
      ]);

    return this.enrichBosses(
      bosses,
      members
    );
  }

  async createBoss(
    eventId: string,
    input: RaidBossInput
  ) {
    await this.verification.ensureVerified();

    const event =
      await this.repository.findEventById(
        eventId
      );

    if (!event) {
      throw new AppError(
        404,
        "Raid-Termin nicht gefunden."
      );
    }

    return this.repository.createBoss(
      eventId,
      this.normalize(input)
    );
  }

  async updateBoss(
    bossId: string,
    input: RaidBossInput
  ) {
    await this.verification.ensureVerified();

    const boss =
      await this.repository.findBossById(
        bossId
      );

    if (!boss) {
      throw new AppError(
        404,
        "Boss nicht gefunden."
      );
    }

    return this.repository.updateBoss(
      bossId,
      this.normalize(input)
    );
  }

  async deleteBoss(
    bossId: string
  ) {
    await this.verification.ensureVerified();

    const boss =
      await this.repository.findBossById(
        bossId
      );

    if (!boss) {
      throw new AppError(
        404,
        "Boss nicht gefunden."
      );
    }

    await this.repository.deleteBoss(
      bossId
    );
  }

  async setEntry(
    bossId: string,
    memberId: string,
    status: string
  ) {
    await this.verification.ensureVerified();

    const boss =
      await this.repository.findBossById(
        bossId
      );

    if (!boss) {
      throw new AppError(
        404,
        "Boss nicht gefunden."
      );
    }

    const member =
      await this.repository.findMemberById(
        memberId
      );

    if (!member) {
      throw new AppError(
        404,
        "Gildenmitglied nicht gefunden."
      );
    }

    await this.repository.upsertEntry(
      bossId,
      memberId,
      status
    );

    return this.enrichBoss(bossId);
  }

  async clearEntry(
    bossId: string,
    memberId: string
  ) {
    await this.verification.ensureVerified();

    const boss =
      await this.repository.findBossById(
        bossId
      );

    if (!boss) {
      throw new AppError(
        404,
        "Boss nicht gefunden."
      );
    }

    await this.repository.deleteEntry(
      bossId,
      memberId
    );

    return this.enrichBoss(bossId);
  }

  private async enrichBoss(
    bossId: string
  ) {
    const boss =
      await this.repository.findBossById(
        bossId
      );

    if (!boss) {
      throw new AppError(
        404,
        "Boss nicht gefunden."
      );
    }

    const members =
      await this.rosterRepository.findAll();

    return this.enrichBosses(
      [boss],
      members
    )[0];
  }

  private enrichBosses(
    bosses: Awaited<
      ReturnType<
        RaidBossRosterRepository["findBossesForEvent"]
      >
    >,
    members: Awaited<
      ReturnType<
        GuildRosterRepository["findAll"]
      >
    >
  ) {
    const memberById = new Map(
      members.map((member) => [
        member.id,
        member
      ])
    );

    return bosses.map((boss) => ({
      ...boss,
      rosterEntries:
        boss.rosterEntries.map(
          (entry) => ({
            ...entry,
            member:
              memberById.get(
                entry.memberId
              ) ?? null
          })
        )
    }));
  }

  private normalize(
    input: RaidBossInput
  ): RaidBossInput {
    return {
      ...input,
      name: input.name.trim()
    };
  }
}
