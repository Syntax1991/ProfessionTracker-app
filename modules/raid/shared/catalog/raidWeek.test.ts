import { describe, expect, it } from "vitest";
import { resolveRaidWeek } from "./raidWeek.js";

describe("resolveRaidWeek", () => {
  it("maps a Wednesday reset day onto itself at midnight", () => {
    const { startsAt, endsAt } = resolveRaidWeek(
      new Date(2026, 7, 19, 22, 0, 0)
    );

    expect(startsAt).toEqual(
      new Date(2026, 7, 19, 0, 0, 0, 0)
    );

    expect(endsAt).toEqual(
      new Date(2026, 7, 25, 23, 59, 59, 999)
    );
  });

  it("maps a Sunday mid-week onto the preceding Wednesday", () => {
    const { startsAt, endsAt } = resolveRaidWeek(
      new Date(2026, 7, 23, 14, 30, 0)
    );

    expect(startsAt).toEqual(
      new Date(2026, 7, 19, 0, 0, 0, 0)
    );

    expect(endsAt).toEqual(
      new Date(2026, 7, 25, 23, 59, 59, 999)
    );
  });

  it("maps a Tuesday onto the Wednesday that started that same week, not the next one", () => {
    const { startsAt, endsAt } = resolveRaidWeek(
      new Date(2026, 7, 25, 9, 0, 0)
    );

    expect(startsAt).toEqual(
      new Date(2026, 7, 19, 0, 0, 0, 0)
    );

    expect(endsAt).toEqual(
      new Date(2026, 7, 25, 23, 59, 59, 999)
    );
  });

  it("maps a Tuesday belonging to the prior week correctly", () => {
    const { startsAt } = resolveRaidWeek(
      new Date(2026, 7, 18, 9, 0, 0)
    );

    expect(startsAt).toEqual(
      new Date(2026, 7, 12, 0, 0, 0, 0)
    );
  });
});
