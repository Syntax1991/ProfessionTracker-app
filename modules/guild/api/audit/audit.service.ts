import { mapWithConcurrency } from "../../../../apps/api/src/shared/async/mapWithConcurrency.js";
import { getUsableBattleNetConnection } from "../../../data-platform/api/integrations/battlenet/battlenet-connection.guard.js";
import type { BattleNetClient } from "../../../data-platform/api/integrations/battlenet/battlenet.client.js";
import type { BattleNetRepository } from "../../../data-platform/api/integrations/battlenet/battlenet.repository.js";
import type { GuildVerificationGuard } from "../verification/verification.types.js";
import { slugifyRealmName } from "./audit.realm-slug.js";
import { computeAuditStats } from "./audit.stats.js";
import { GuildAuditRepository } from "./audit.repository.js";
import type { GuildAuditRefreshResult } from "./audit.types.js";

const refreshConcurrency = 4;

export class GuildAuditService {
  constructor(
    private readonly repository:
      GuildAuditRepository,

    private readonly battleNetRepository:
      BattleNetRepository,

    private readonly battleNetClient:
      BattleNetClient,

    private readonly verification:
      GuildVerificationGuard
  ) {}

  async refreshAll(): Promise<GuildAuditRefreshResult> {
    await this.verification.ensureVerified();

    const connection =
      await getUsableBattleNetConnection(
        this.battleNetRepository
      );

    const members =
      await this.repository.findAllMembers();

    const outcomes =
      await mapWithConcurrency(
        members,
        refreshConcurrency,
        async (member) => {
          try {
            const equipment =
              await this.battleNetClient.getCharacterEquipment(
                connection.accessToken,
                slugifyRealmName(
                  member.realm
                ),
                member.name
              );

            if (!equipment) {
              return false;
            }

            await this.repository.updateAudit(
              member.id,
              computeAuditStats(
                equipment
              )
            );

            return true;
          }
          catch {
            return false;
          }
        }
      );

    const auditedMembers =
      outcomes.filter(
        (outcome) => outcome
      ).length;

    return {
      totalMembers:
        members.length,
      auditedMembers,
      skippedMembers:
        members.length -
        auditedMembers
    };
  }
}
