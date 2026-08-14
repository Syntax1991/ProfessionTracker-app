import {
  getWarcraftLogsToken,
  queryWarcraftLogs
} from "./warcraftlogs.transport.js";
import type {
  WarcraftLogsFightCasts,
  WclActor,
  WclCastEvent,
  WclZone
} from "./warcraftlogs.types.js";

const midnightExpansionId = 7;

export class WarcraftLogsClient {
  async findEncounterId(
    bossName: string
  ): Promise<number | null> {
    const token =
      await getWarcraftLogsToken();

    const data = await queryWarcraftLogs<{
      worldData: {
        zones: WclZone[];
      };
    }>(
      token,
      `query {
        worldData {
          zones(expansion_id: ${midnightExpansionId}) {
            encounters { id name }
          }
        }
      }`
    );

    for (const zone of data.worldData
      .zones) {
      const match =
        zone.encounters.find(
          (encounter) =>
            encounter.name ===
            bossName
        );

      if (match) {
        return match.id;
      }
    }

    return null;
  }

  async getTopFight(
    encounterId: number
  ): Promise<{
    reportCode: string;
    fightId: number;
  } | null> {
    const token =
      await getWarcraftLogsToken();

    const data = await queryWarcraftLogs<{
      worldData: {
        encounter: {
          characterRankings: {
            rankings?: Array<{
              report: {
                code: string;
                fightID: number;
              };
            }>;
          } | null;
        };
      };
    }>(
      token,
      `query {
        worldData {
          encounter(id: ${encounterId}) {
            characterRankings(metric: hps)
          }
        }
      }`
    );

    const top =
      data.worldData.encounter
        .characterRankings
        ?.rankings?.[0];

    if (!top) {
      return null;
    }

    return {
      reportCode: top.report.code,
      fightId: top.report.fightID
    };
  }

  async getFightCasts(
    reportCode: string,
    fightId: number,
    bossName: string
  ): Promise<WarcraftLogsFightCasts | null> {
    const token =
      await getWarcraftLogsToken();

    const fightData = await queryWarcraftLogs<{
      reportData: {
        report: {
          fights: Array<{
            startTime: number;
            endTime: number;
          }>;
          masterData: {
            actors: WclActor[];
          };
        };
      };
    }>(
      token,
      `query {
        reportData {
          report(code: "${reportCode}") {
            fights(fightIDs: [${fightId}]) { startTime endTime }
            masterData { actors(type: "NPC") { id name subType } }
          }
        }
      }`
    );

    const fight =
      fightData.reportData.report
        .fights[0];

    if (!fight) {
      return null;
    }

    const bossActor =
      fightData.reportData.report.masterData.actors.find(
        (actor) =>
          actor.subType === "Boss" &&
          actor.name === bossName
      );

    if (!bossActor) {
      return null;
    }

    const events =
      await this.collectCastEvents(
        token,
        reportCode,
        fightId,
        bossActor.id,
        fight.startTime,
        fight.endTime
      );

    const abilityIds = Array.from(
      new Set(
        events.map(
          (event) =>
            event.abilityGameID
        )
      )
    );

    const abilityNames =
      await this.resolveAbilityNames(
        token,
        abilityIds
      );

    const casts = events
      .map((event) => {
        const abilityName =
          abilityNames.get(
            event.abilityGameID
          );

        if (!abilityName) {
          return null;
        }

        return {
          abilityName,
          timestampSeconds: Math.round(
            (event.timestamp -
              fight.startTime) /
              1000
          )
        };
      })
      .filter(
        (
          cast
        ): cast is {
          abilityName: string;
          timestampSeconds: number;
        } => cast !== null
      );

    return {
      fightDurationSeconds: Math.round(
        (fight.endTime -
          fight.startTime) /
          1000
      ),
      reportCode,
      fightId,
      casts
    };
  }

  private async collectCastEvents(
    token: string,
    reportCode: string,
    fightId: number,
    sourceId: number,
    fightStart: number,
    fightEnd: number
  ): Promise<WclCastEvent[]> {
    const events: WclCastEvent[] = [];
    let cursor = fightStart;

    while (cursor < fightEnd) {
      const data = await queryWarcraftLogs<{
        reportData: {
          report: {
            events: {
              data: WclCastEvent[];
              nextPageTimestamp: number | null;
            };
          };
        };
      }>(
        token,
        `query {
          reportData {
            report(code: "${reportCode}") {
              events(
                fightIDs: [${fightId}]
                dataType: Casts
                hostilityType: Enemies
                sourceID: ${sourceId}
                startTime: ${cursor}
                endTime: ${fightEnd}
                limit: 300
              ) {
                data
                nextPageTimestamp
              }
            }
          }
        }`
      );

      const page =
        data.reportData.report.events;

      events.push(
        ...page.data.filter(
          (event) =>
            event.type === "cast"
        )
      );

      if (!page.nextPageTimestamp) {
        break;
      }

      cursor = page.nextPageTimestamp;
    }

    return events;
  }

  private async resolveAbilityNames(
    token: string,
    abilityIds: number[]
  ): Promise<Map<number, string>> {
    if (abilityIds.length === 0) {
      return new Map();
    }

    const aliasedFields = abilityIds
      .map(
        (id) =>
          `a${id}: ability(id: ${id}) { name }`
      )
      .join(" ");

    const data = await queryWarcraftLogs<{
      gameData: Record<
        string,
        { name: string } | null
      >;
    }>(
      token,
      `query { gameData { ${aliasedFields} } }`
    );

    const names = new Map<
      number,
      string
    >();

    for (const id of abilityIds) {
      const ability =
        data.gameData[`a${id}`];

      if (ability) {
        names.set(id, ability.name);
      }
    }

    return names;
  }
}
