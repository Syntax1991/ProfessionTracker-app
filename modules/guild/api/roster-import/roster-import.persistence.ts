import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";
import type {
  AddonGuildSnapshot,
  GuildRosterImportProcessed
} from "./roster-import.types.js";

export class GuildRosterImportPersistence {
  async persist(
    snapshot: AddonGuildSnapshot
  ): Promise<GuildRosterImportProcessed> {
    let created = 0;
    let updated = 0;

    const syncDate =
      new Date();

    await prisma.$transaction(
      async (transaction) => {
        for (
          const member of
          snapshot.members
        ) {
          const existing =
            await transaction.guildMember.findUnique({
              where: {
                name_realm_region: {
                  name:
                    member.name,
                  realm:
                    snapshot.realm,
                  region:
                    snapshot.region
                }
              }
            });

          if (existing) {
            await transaction.guildMember.update({
              where: {
                id: existing.id
              },
              data: {
                className:
                  member.className,
                level:
                  member.level,
                rank:
                  member.rank,
                rankIndex:
                  member.rankIndex,
                note:
                  member.note,
                officerNote:
                  member.officerNote,
                source:
                  "ADDON",
                lastSyncedAt:
                  syncDate
              }
            });

            updated += 1;
          }
          else {
            await transaction.guildMember.create({
              data: {
                name:
                  member.name,
                realm:
                  snapshot.realm,
                region:
                  snapshot.region,
                className:
                  member.className,
                level:
                  member.level,
                rank:
                  member.rank,
                rankIndex:
                  member.rankIndex,
                note:
                  member.note,
                officerNote:
                  member.officerNote,
                source:
                  "ADDON",
                lastSyncedAt:
                  syncDate
              }
            });

            created += 1;
          }
        }
      }
    );

    return {
      members:
        snapshot.members.length,
      created,
      updated
    };
  }
}
