import { describe, expect, it, vi } from "vitest";
import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import type { GuildVerificationGuard } from "../../../guild/api/verification/verification.types.js";
import { RaidSetupRepository } from "./setup.repository.js";
import { RaidSetupService } from "./setup.service.js";
import type { RaiderLinkGuard } from "./setup.types.js";

const emptySetup = {
  id: "setup-1",
  raidPlanId: "plan-1",
  raidEventId: "event-1",
  key: "main",
  name: "Main Setup",
  members: []
};

function createService(
  options: {
    linkedMember?: { id: string } | null;
    teamId?: string | null;
  } = {}
) {
  const repository = {
    findEventById: vi.fn(async () => ({
      id: "event-1",
      teamId:
        options.teamId === undefined
          ? "team-1"
          : options.teamId
    })),
    findMemberById: vi.fn(async () => ({
      id: "member-1"
    })),
    findSetupById: vi.fn(
      async () => emptySetup
    ),
    getOrCreateForEvent: vi.fn(
      async () => emptySetup
    ),
    addMembers: vi.fn(async () => []),
    removeMember: vi.fn(async () => ({
      count: 1
    })),
    isSetupMember: vi.fn(async () => true)
  } as unknown as RaidSetupRepository;

  const rosterRepository = {
    findAll: vi.fn(async () => [])
  };

  const teamRepository = {
    findById: vi.fn(async () => ({
      id: "team-1",
      members: [
        { memberId: "member-1" },
        { memberId: "member-2" }
      ]
    }))
  };

  const verification: GuildVerificationGuard = {
    ensureVerified: vi.fn(async () => {}),
    requireCurrentOfficer: vi.fn(
      async () => ({ id: "member-1" })
    )
  };

  const raiderLink: RaiderLinkGuard = {
    getLinkedMember: vi.fn(async () =>
      options.linkedMember === undefined
        ? { id: "member-1" }
        : options.linkedMember
    )
  };

  const service = new RaidSetupService(
    repository,
    rosterRepository as never,
    teamRepository as never,
    verification,
    raiderLink
  );

  return {
    service,
    repository,
    teamRepository,
    verification,
    raiderLink
  };
}

describe("RaidSetupService.getForEvent", () => {
  it("rejects an unlinked requester", async () => {
    const { service } = createService({
      linkedMember: null
    });

    await expect(
      service.getForEvent(
        "token",
        "event-1"
      )
    ).rejects.toThrow(AppError);
  });

  it("does not require officer authorization to read", async () => {
    const { service, verification } =
      createService();

    await service.getForEvent(
      "token",
      "event-1"
    );

    expect(
      verification.requireCurrentOfficer
    ).not.toHaveBeenCalled();
  });

  it("404s when the event does not exist", async () => {
    const { service, repository } =
      createService();

    (
      repository.getOrCreateForEvent as ReturnType<
        typeof vi.fn
      >
    ).mockResolvedValueOnce(null);

    await expect(
      service.getForEvent(
        "token",
        "missing-event"
      )
    ).rejects.toThrow(AppError);
  });
});

describe("RaidSetupService.addMembers", () => {
  it("requires officer authorization", async () => {
    const { service, verification } =
      createService();

    await service.addMembers(
      "token",
      "setup-1",
      ["member-1"]
    );

    expect(
      verification.requireCurrentOfficer
    ).toHaveBeenCalledTimes(1);
  });

  it("rejects a memberId that isn't a real guild member", async () => {
    const { service, repository } =
      createService();

    (
      repository.findMemberById as ReturnType<
        typeof vi.fn
      >
    ).mockResolvedValueOnce(null);

    await expect(
      service.addMembers(
        "token",
        "setup-1",
        ["not-a-member"]
      )
    ).rejects.toThrow(AppError);
  });

  it("dedupes memberIds before persisting", async () => {
    const { service, repository } =
      createService();

    await service.addMembers(
      "token",
      "setup-1",
      ["member-1", "member-1"]
    );

    expect(
      repository.addMembers
    ).toHaveBeenCalledWith(
      "setup-1",
      ["member-1"]
    );
  });
});

describe("RaidSetupService.removeMember", () => {
  it("requires officer authorization", async () => {
    const { service, verification } =
      createService();

    await service.removeMember(
      "token",
      "setup-1",
      "member-1"
    );

    expect(
      verification.requireCurrentOfficer
    ).toHaveBeenCalledTimes(1);
  });
});

describe("RaidSetupService.updateRosterFromTeam", () => {
  it("requires officer authorization", async () => {
    const { service, verification } =
      createService();

    await service.updateRosterFromTeam(
      "token",
      "setup-1"
    );

    expect(
      verification.requireCurrentOfficer
    ).toHaveBeenCalledTimes(1);
  });

  it("rejects when the event has no linked team", async () => {
    const { service } = createService({
      teamId: null
    });

    await expect(
      service.updateRosterFromTeam(
        "token",
        "setup-1"
      )
    ).rejects.toThrow(AppError);
  });

  it("is additive: syncs every current team member into the pool", async () => {
    const { service, repository } =
      createService();

    await service.updateRosterFromTeam(
      "token",
      "setup-1"
    );

    expect(
      repository.addMembers
    ).toHaveBeenCalledWith("setup-1", [
      "member-1",
      "member-2"
    ]);

    expect(
      repository.removeMember
    ).not.toHaveBeenCalled();
  });
});
