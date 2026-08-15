import { describe, expect, it, vi } from "vitest";
import type { GuildVerificationGuard } from "../../../guild/api/verification/verification.types.js";
import { bossAbilityCatalog } from "../../shared/catalog/bossAbilityCatalog.js";
import type { RaidCooldownRepository } from "./cooldown.repository.js";
import { RaidCooldownService } from "./cooldown.service.js";
import type { WarcraftLogsClient } from "./warcraftlogs.client.js";

function requireFirst<T>(items: T[]): T {
  const [item] = items;

  if (item === undefined) {
    throw new Error(
      "Expected at least one item"
    );
  }

  return item;
}

const catalogBoss = requireFirst(
  bossAbilityCatalog
);

const catalogAbility = requireFirst(
  catalogBoss.abilities
);

function createService() {
  const calls: string[] = [];

  const repository = {
    findBossById: vi.fn(async () => {
      calls.push("repository");
      return {
        id: "boss-1",
        name: catalogBoss.bossName,
        fightDurationSeconds: null,
        wclReportCode: null,
        wclFightId: null,
        wclSyncedAt: null
      };
    }),
    findAssignmentById: vi.fn(async () => {
      calls.push("repository");
      return { id: "assignment-1" };
    }),
    findMemberById: vi.fn(async () => {
      calls.push("repository");
      return { id: "member-1" };
    }),
    createAssignment: vi.fn(async () => {
      calls.push("repository");
      return { id: "assignment-1" };
    }),
    updateAssignment: vi.fn(async () => {
      calls.push("repository");
      return { id: "assignment-1" };
    }),
    deleteAssignment: vi.fn(async () => {
      calls.push("repository");
    }),
    updateFightDuration: vi.fn(async () => {
      calls.push("repository");
      return { id: "boss-1" };
    }),
    findPhaseMarkersForBoss: vi.fn(async () => {
      calls.push("repository");
      return [];
    }),
    findPhaseMarkerById: vi.fn(async () => {
      calls.push("repository");
      return { id: "marker-1" };
    }),
    createPhaseMarker: vi.fn(async () => {
      calls.push("repository");
      return { id: "marker-1" };
    }),
    deletePhaseMarker: vi.fn(async () => {
      calls.push("repository");
    }),
    findAbilityCastsForBoss: vi.fn(async () => {
      calls.push("repository");
      return [];
    }),
    findForEvent: vi.fn(async () => {
      calls.push("repository");
      return [];
    }),
    replaceAbilityCastsFromSync: vi.fn(async () => {
      calls.push("repository");
    })
  } as unknown as RaidCooldownRepository;

  const verification: GuildVerificationGuard = {
    ensureVerified: vi.fn(async () => {
      calls.push("verification");
    })
  };

  const warcraftLogs = {
    findEncounterId: vi.fn(async () => {
      calls.push("warcraftLogs");
      return 42;
    }),
    getTopFight: vi.fn(async () => {
      calls.push("warcraftLogs");
      return { reportCode: "R1", fightId: 1 };
    }),
    getFightCasts: vi.fn(async () => {
      calls.push("warcraftLogs");
      return {
        fightDurationSeconds: 120,
        reportCode: "R1",
        fightId: 1,
        casts: [
          {
            abilityName:
              catalogAbility.name,
            abilityIcon: null,
            timestampSeconds: 5
          }
        ]
      };
    })
  } as unknown as WarcraftLogsClient;

  const service = new RaidCooldownService(
    repository,
    verification,
    warcraftLogs
  );

  return { service, repository, verification, calls };
}

const assignmentInput = {
  memberId: "member-1",
  abilityName: "Aura Mastery",
  spellId: null,
  abilityIcon: null,
  phaseLabel: null,
  timestampSeconds: 10,
  sortOrder: 0
};

describe("RaidCooldownService mutating methods", () => {
  it("createAssignment verifies before touching the repository", async () => {
    const { service, verification, calls } =
      createService();

    await service.createAssignment(
      "boss-1",
      assignmentInput
    );

    expect(
      verification.ensureVerified
    ).toHaveBeenCalledTimes(1);
    expect(calls[0]).toBe("verification");
  });

  it("updateAssignment verifies before touching the repository", async () => {
    const { service, verification, calls } =
      createService();

    await service.updateAssignment(
      "assignment-1",
      assignmentInput
    );

    expect(
      verification.ensureVerified
    ).toHaveBeenCalledTimes(1);
    expect(calls[0]).toBe("verification");
  });

  it("deleteAssignment verifies before touching the repository", async () => {
    const { service, verification, calls } =
      createService();

    await service.deleteAssignment(
      "assignment-1"
    );

    expect(
      verification.ensureVerified
    ).toHaveBeenCalledTimes(1);
    expect(calls[0]).toBe("verification");
  });

  it("updateFightDuration verifies before touching the repository", async () => {
    const { service, verification, calls } =
      createService();

    await service.updateFightDuration(
      "boss-1",
      { fightDurationSeconds: 300 }
    );

    expect(
      verification.ensureVerified
    ).toHaveBeenCalledTimes(1);
    expect(calls[0]).toBe("verification");
  });

  it("createPhaseMarker verifies before touching the repository", async () => {
    const { service, verification, calls } =
      createService();

    await service.createPhaseMarker(
      "boss-1",
      { label: "Pull", startSeconds: 0, sortOrder: 0 }
    );

    expect(
      verification.ensureVerified
    ).toHaveBeenCalledTimes(1);
    expect(calls[0]).toBe("verification");
  });

  it("deletePhaseMarker verifies before touching the repository", async () => {
    const { service, verification, calls } =
      createService();

    await service.deletePhaseMarker(
      "marker-1"
    );

    expect(
      verification.ensureVerified
    ).toHaveBeenCalledTimes(1);
    expect(calls[0]).toBe("verification");
  });

  it("syncBossFromWarcraftLogs verifies before touching the repository or Warcraft Logs", async () => {
    const { service, verification, calls } =
      createService();

    await service.syncBossFromWarcraftLogs(
      "boss-1"
    );

    expect(
      verification.ensureVerified
    ).toHaveBeenCalledTimes(1);
    expect(calls[0]).toBe("verification");
  });
});

describe("RaidCooldownService read methods", () => {
  it("listForEvent does not require verification", async () => {
    const { service, verification } =
      createService();

    await service.listForEvent("event-1");

    expect(
      verification.ensureVerified
    ).not.toHaveBeenCalled();
  });

  it("listPhaseMarkers does not require verification", async () => {
    const { service, verification } =
      createService();

    await service.listPhaseMarkers("boss-1");

    expect(
      verification.ensureVerified
    ).not.toHaveBeenCalled();
  });

  it("listAbilityCasts does not require verification", async () => {
    const { service, verification } =
      createService();

    await service.listAbilityCasts("boss-1");

    expect(
      verification.ensureVerified
    ).not.toHaveBeenCalled();
  });
});
