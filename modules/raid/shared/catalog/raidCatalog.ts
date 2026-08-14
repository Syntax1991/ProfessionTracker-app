export type RaidCatalogBoss = {
  name: string;
  sortOrder: number;
};

export type RaidCatalogEntry = {
  key: string;
  expansion: "MIDNIGHT";
  season: 1 | 2;
  name: string;
  bossCount: number;
  availableFrom: string;
  bosses: RaidCatalogBoss[];
};

export type RaidSeasonCatalog = {
  expansion: "MIDNIGHT";
  season: 1 | 2;
  label: string;
  startsAt: string;
  raids: RaidCatalogEntry[];
};

const midnightSeasonOne: RaidSeasonCatalog = {
  expansion: "MIDNIGHT",
  season: 1,
  label: "Midnight Season 1",
  startsAt: "2026-03-17",
  raids: [
    {
      key: "MIDNIGHT_S1_VOIDSPIRE",
      expansion: "MIDNIGHT",
      season: 1,
      name: "The Voidspire",
      bossCount: 6,
      availableFrom: "2026-03-17",
      bosses: [
        {
          name: "Imperator Averzian",
          sortOrder: 0
        },
        {
          name: "Vorasius",
          sortOrder: 1
        },
        {
          name: "Fallen-King Salhadaar",
          sortOrder: 2
        },
        {
          name: "Vaelgor & Ezzorak",
          sortOrder: 3
        },
        {
          name: "Lightblinded Vanguard",
          sortOrder: 4
        },
        {
          name: "Crown of the Cosmos",
          sortOrder: 5
        }
      ]
    },
    {
      key: "MIDNIGHT_S1_DREAMRIFT",
      expansion: "MIDNIGHT",
      season: 1,
      name: "The Dreamrift",
      bossCount: 1,
      availableFrom: "2026-03-17",
      bosses: [
        {
          name: "Chimaerus the Undreamt God",
          sortOrder: 0
        }
      ]
    },
    {
      key: "MIDNIGHT_S1_QUELDANAS",
      expansion: "MIDNIGHT",
      season: 1,
      name: "March on Quel'Danas",
      bossCount: 2,
      availableFrom: "2026-03-31",
      bosses: [
        {
          name: "Belo'ren, Child of Al'ar",
          sortOrder: 0
        },
        {
          name: "Midnight Falls",
          sortOrder: 1
        }
      ]
    }
  ]
};

const midnightSeasonTwo: RaidSeasonCatalog = {
  expansion: "MIDNIGHT",
  season: 2,
  label: "Midnight Season 2",
  startsAt: "2026-08-19",
  raids: [
    {
      key: "MIDNIGHT_S2_VENOMOUS_ABYSS",
      expansion: "MIDNIGHT",
      season: 2,
      name: "The Venomous Abyss",
      bossCount: 8,
      availableFrom: "2026-08-19",
      bosses: [
        {
          name: "Nek'zali the Soulcoiler",
          sortOrder: 0
        },
        {
          name: "Entombed Sentinels",
          sortOrder: 1
        },
        {
          name: "The Lost Explorers",
          sortOrder: 2
        },
        {
          name: "Vashnik the Malignant",
          sortOrder: 3
        },
        {
          name: "Sszorak",
          sortOrder: 4
        },
        {
          name: "The Twin Fangs",
          sortOrder: 5
        },
        {
          name: "The Coiled Altar",
          sortOrder: 6
        },
        {
          name: "Ula'tek",
          sortOrder: 7
        }
      ]
    }
  ]
};

export const raidSeasons: RaidSeasonCatalog[] = [
  midnightSeasonOne,
  midnightSeasonTwo
];

export const raidCatalog: RaidCatalogEntry[] =
  raidSeasons.flatMap(
    (season) => season.raids
  );

function getDateKey(
  scheduledAt: string
): string | null {
  if (!scheduledAt) {
    return null;
  }

  return scheduledAt.slice(0, 10);
}

export function getRaidSeasonForScheduledAt(
  scheduledAt: string
): RaidSeasonCatalog {
  const dateKey =
    getDateKey(scheduledAt);

  if (
    !dateKey ||
    dateKey >=
      midnightSeasonTwo.startsAt
  ) {
    return midnightSeasonTwo;
  }

  return midnightSeasonOne;
}

export function getRaidsForScheduledAt(
  scheduledAt: string
): RaidCatalogEntry[] {
  const season =
    getRaidSeasonForScheduledAt(
      scheduledAt
    );

  const dateKey =
    getDateKey(scheduledAt);

  if (!dateKey) {
    return season.raids;
  }

  return season.raids.filter(
    (raid) =>
      raid.availableFrom <= dateKey
  );
}

export function findRaidByKey(
  raidKey: string
): RaidCatalogEntry | null {
  return (
    raidCatalog.find(
      (raid) => raid.key === raidKey
    ) ?? null
  );
}

export function findRaidByName(
  raidName: string
): RaidCatalogEntry | null {
  return (
    raidCatalog.find(
      (raid) => raid.name === raidName
    ) ?? null
  );
}