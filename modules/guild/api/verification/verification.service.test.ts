import { describe, expect, it, vi } from "vitest";
import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { OfficerAuthorizationCache } from "./verification.officer-cache.js";
import { GuildVerificationService } from "./verification.service.js";

const guildHref =
  "https://eu.api.blizzard.com/data/wow/guild/test-realm/test-guild";

function createService(
  options: {
    rank?: number | null;
    hasGuild?: boolean;
    linkedMember?: {
      id: string;
      name: string;
      realm: string;
    } | null;
  } = {}
) {
  const calls: string[] = [];
  let now = 0;

  const repository = {
    find: vi.fn(async () => null),
    save: vi.fn(async () => {}),
    clear: vi.fn(async () => {})
  };

  const raiderAuth = {
    requireUsableAccessToken: vi.fn(
      async () => {
        calls.push("blizzard");
        return { accessToken: "token-abc" };
      }
    )
  };

  const battleNetClient = {
    getCharacterProfile: vi.fn(
      async () => {
        calls.push("blizzard");

        if (options.hasGuild === false) {
          return { guild: null };
        }

        return {
          guild: {
            name: "Test Guild",
            realm: { slug: "test-realm" },
            key: { href: guildHref }
          }
        };
      }
    ),
    getGuildRoster: vi.fn(async () => {
      calls.push("blizzard");

      return {
        members: [
          {
            character: {
              name: "Testchar",
              realm: { slug: "test-realm" }
            },
            rank: options.rank ?? 0
          }
        ]
      };
    })
  };

  const raiderLink = {
    getLinkedMember: vi.fn(async () =>
      options.linkedMember === undefined
        ? {
            id: "member-1",
            name: "Testchar",
            realm: "Test Realm"
          }
        : options.linkedMember
    )
  };

  const cache = new OfficerAuthorizationCache({
    now: () => now
  });

  const service = new GuildVerificationService(
    repository as never,
    raiderAuth as never,
    battleNetClient as never,
    raiderLink as never,
    cache
  );

  return {
    service,
    raiderAuth,
    battleNetClient,
    raiderLink,
    calls,
    advanceClock: (ms: number) => {
      now += ms;
    }
  };
}

describe("GuildVerificationService.requireCurrentOfficer", () => {
  it("rejects when the token has no linked member", async () => {
    const { service } = createService({
      linkedMember: null
    });

    await expect(
      service.requireCurrentOfficer(
        "token"
      )
    ).rejects.toThrow(AppError);
  });

  it("rejects a linked member whose live Blizzard rank is below leadership, without caching", async () => {
    const { service, battleNetClient } =
      createService({ rank: 5 });

    await expect(
      service.requireCurrentOfficer(
        "token"
      )
    ).rejects.toThrow(AppError);

    await expect(
      service.requireCurrentOfficer(
        "token"
      )
    ).rejects.toThrow(AppError);

    expect(
      battleNetClient.getCharacterProfile
    ).toHaveBeenCalledTimes(2);
  });

  it("rejects a linked member who is currently guildless", async () => {
    const { service } = createService({
      hasGuild: false
    });

    await expect(
      service.requireCurrentOfficer(
        "token"
      )
    ).rejects.toThrow(AppError);
  });

  it("allows a linked officer-rank member and caches the result", async () => {
    const {
      service,
      battleNetClient
    } = createService({ rank: 1 });

    const result =
      await service.requireCurrentOfficer(
        "token"
      );

    expect(result).toEqual({
      id: "member-1"
    });

    expect(
      battleNetClient.getCharacterProfile
    ).toHaveBeenCalledTimes(1);

    expect(
      battleNetClient.getGuildRoster
    ).toHaveBeenCalledTimes(1);
  });

  it("skips the live Blizzard check on a second call within the cache TTL", async () => {
    const {
      service,
      battleNetClient
    } = createService({ rank: 0 });

    await service.requireCurrentOfficer(
      "token"
    );

    await service.requireCurrentOfficer(
      "token"
    );

    expect(
      battleNetClient.getCharacterProfile
    ).toHaveBeenCalledTimes(1);
  });

  it("re-checks live after the cache TTL expires", async () => {
    const {
      service,
      battleNetClient,
      advanceClock
    } = createService({ rank: 0 });

    await service.requireCurrentOfficer(
      "token"
    );

    advanceClock(6 * 60 * 1000);

    await service.requireCurrentOfficer(
      "token"
    );

    expect(
      battleNetClient.getCharacterProfile
    ).toHaveBeenCalledTimes(2);
  });

  it("never caches session/link resolution, even for a cached officer", async () => {
    const {
      service,
      raiderLink
    } = createService({ rank: 0 });

    await service.requireCurrentOfficer(
      "token"
    );

    await service.requireCurrentOfficer(
      "token"
    );

    expect(
      raiderLink.getLinkedMember
    ).toHaveBeenCalledTimes(2);
  });
});
