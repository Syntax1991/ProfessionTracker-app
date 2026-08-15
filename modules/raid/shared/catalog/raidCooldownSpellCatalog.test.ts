import { describe, expect, it } from "vitest";
import {
  getSpellById,
  getSpellsForClass,
  raidCooldownSpellCatalog
} from "./raidCooldownSpellCatalog.js";

describe("getSpellsForClass", () => {
  it("returns only spells for the given class", () => {
    const spells = getSpellsForClass("Paladin");

    expect(spells.length).toBeGreaterThan(0);
    expect(
      spells.every(
        (spell) => spell.className === "Paladin"
      )
    ).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(
      getSpellsForClass("paladin").length
    ).toBe(
      getSpellsForClass("Paladin").length
    );
  });

  it("returns an empty array for an unknown class", () => {
    expect(
      getSpellsForClass("Not A Class")
    ).toEqual([]);
  });
});

describe("getSpellById", () => {
  it("resolves a known spell", () => {
    const spell = getSpellById(31821);

    expect(spell?.name).toBe("Aura Mastery");
  });

  it("returns null for an unknown id", () => {
    expect(getSpellById(0)).toBeNull();
  });
});

describe("raidCooldownSpellCatalog", () => {
  it("has no fabricated base cooldown values", () => {
    expect(
      raidCooldownSpellCatalog.every(
        (spell) =>
          spell.baseCooldownSeconds === null
      )
    ).toBe(true);
  });

  it("has real icon URLs for every entry", () => {
    expect(
      raidCooldownSpellCatalog.every((spell) =>
        spell.icon.startsWith(
          "https://render.worldofwarcraft.com/"
        )
      )
    ).toBe(true);
  });

  it("covers all 13 WoW classes", () => {
    const classes = new Set(
      raidCooldownSpellCatalog.map(
        (spell) => spell.className
      )
    );

    expect(classes.size).toBe(13);
  });
});
