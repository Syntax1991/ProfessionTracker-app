import { mapWithConcurrency } from "../../../../apps/api/src/shared/async/mapWithConcurrency.js";
import type { BattleNetClient } from "../../../data-platform/api/integrations/battlenet/battlenet.client.js";
import type { RaiderAccessTokenGuard } from "../../../data-platform/api/raider-auth/raider-auth.types.js";
import type { GuildVerificationGuard } from "../verification/verification.types.js";
import { slugifyRealmName } from "./audit.realm-slug.js";
import {
  computeAuditStats,
  computeGearSlots
} from "./audit.stats.js";
import { GuildAuditRepository } from "./audit.repository.js";
import type { GuildAuditRefreshResult } from "./audit.types.js";

const refreshConcurrency = 4;

export class GuildAuditService {
  constructor(
    private readonly repository:
      GuildAuditRepository,

    private readonly battleNetClient:
      BattleNetClient,

    private readonly verification:
      GuildVerificationGuard,

    private readonly raiderAuth:
      RaiderAccessTokenGuard
  ) {}

  async refreshAll(
    token: string
  ): Promise<GuildAuditRefreshResult> {
    await this.verification.ensureVerified();

    const { accessToken } =
      await this.raiderAuth.requireUsableAccessToken(
        token
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
                accessToken,
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

            await this.repository.replaceGearSlots(
              member.id,
              computeGearSlots(
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

  listGearSlots() {
    return this.repository.findAllGearSlots();
  }
}
