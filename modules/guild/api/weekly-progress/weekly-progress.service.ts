import { getWeeklyPeriod } from "../../../my-syntrack/api/shared/weekly-period.js";
import { GuildWeeklyProgressRepository } from "./weekly-progress.repository.js";
import type {
  GuildWeeklyProgressEntry,
  GuildWeeklyProgressSummary
} from "./weekly-progress.types.js";

function identityKey(
  name: string,
  realm: string,
  region: string
): string {
  return [
    name.trim().toLowerCase(),
    realm.trim().toLowerCase(),
    region.trim().toLowerCase()
  ].join("|");
}

export class GuildWeeklyProgressService {
  constructor(
    private readonly repository:
      GuildWeeklyProgressRepository
  ) {}

  async getSummary(): Promise<GuildWeeklyProgressSummary> {
    const period =
      getWeeklyPeriod();

    const [
      members,
      characters,
      totalTaskCount
    ] = await Promise.all([
      this.repository.findAllMembers(),
      this.repository.findCharactersForPeriod(
        period.key
      ),
      this.repository.countEnabledTasks()
    ]);

    const characterByIdentity =
      new Map(
        characters.map(
          (character) => [
            identityKey(
              character.name,
              character.realm,
              character.region
            ),
            character
          ]
        )
      );

    const items: GuildWeeklyProgressEntry[] =
      members.map((member) => {
        const character =
          characterByIdentity.get(
            identityKey(
              member.name,
              member.realm,
              member.region
            )
          );

        const bestKeystoneLevel =
          character &&
          character.weeklyMythicRuns
            .length > 0
            ? Math.max(
                ...character.weeklyMythicRuns.map(
                  (run) =>
                    run.keyLevel
                )
              )
            : null;

        return {
          memberId: member.id,
          name: member.name,
          realm: member.realm,
          region: member.region,
          className:
            member.className,
          rank: member.rank,
          tracked:
            Boolean(character),
          completedTaskCount:
            character
              ?.weeklyCompletions
              .length ?? 0,
          totalTaskCount,
          mythicPlusRunCount:
            character
              ?.weeklyMythicRuns
              .length ?? 0,
          bestKeystoneLevel
        };
      });

    return {
      periodKey: period.key,
      totalTaskCount,
      items
    };
  }
}
