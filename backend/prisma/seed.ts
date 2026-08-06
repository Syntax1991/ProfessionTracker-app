import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaBetterSqlite3({
  url:
    process.env.DATABASE_URL ??
    "file:./prisma/dev.db"
});

const prisma = new PrismaClient({
  adapter
});

const professions = [
  {
    key: "alchemy",
    name: "Alchemie",
    category: "CRAFTING",
    order: 10
  },
  {
    key: "blacksmithing",
    name: "Schmiedekunst",
    category: "CRAFTING",
    order: 20
  },
  {
    key: "enchanting",
    name: "Verzauberkunst",
    category: "CRAFTING",
    order: 30
  },
  {
    key: "engineering",
    name: "Ingenieurskunst",
    category: "CRAFTING",
    order: 40
  },
  {
    key: "inscription",
    name: "Inschriftenkunde",
    category: "CRAFTING",
    order: 50
  },
  {
    key: "jewelcrafting",
    name: "Juwelierskunst",
    category: "CRAFTING",
    order: 60
  },
  {
    key: "leatherworking",
    name: "Lederverarbeitung",
    category: "CRAFTING",
    order: 70
  },
  {
    key: "tailoring",
    name: "Schneiderei",
    category: "CRAFTING",
    order: 80
  },
  {
    key: "herbalism",
    name: "Kräuterkunde",
    category: "GATHERING",
    order: 90
  },
  {
    key: "mining",
    name: "Bergbau",
    category: "GATHERING",
    order: 100
  },
  {
    key: "skinning",
    name: "Kürschnerei",
    category: "GATHERING",
    order: 110
  }
];

type SeedNode = {
  key: string;
  name: string;
  description?: string;
  maxRank?: number;
  sortOrder: number;
};

async function seedProfessions() {
  for (const profession of professions) {
    await prisma.profession.upsert({
      where: {
        key: profession.key
      },
      create: profession,
      update: {
        name: profession.name,
        category: profession.category,
        order: profession.order
      }
    });
  }
}

async function seedBlacksmithingArmorTree() {
  const blacksmithing =
    await prisma.profession.findUnique({
      where: {
        key: "blacksmithing"
      }
    });

  if (!blacksmithing) {
    throw new Error(
      "Blacksmithing profession was not found."
    );
  }

  const tree =
    await prisma.professionSpecializationTree.upsert({
      where: {
        professionId_expansion_key: {
          professionId: blacksmithing.id,
          expansion: "MIDNIGHT",
          key: "armor"
        }
      },
      create: {
        professionId: blacksmithing.id,
        expansion: "MIDNIGHT",
        key: "armor",
        name: "Rüstung",
        description:
          "Spezialisierung auf die Herstellung von Rüstungsteilen.",
        sortOrder: 10
      },
      update: {
        name: "Rüstung",
        description:
          "Spezialisierung auf die Herstellung von Rüstungsteilen.",
        sortOrder: 10
      }
    });

  const armorRoot =
    await prisma.professionSpecializationNode.upsert({
      where: {
        treeId_key: {
          treeId: tree.id,
          key: "armor"
        }
      },
      create: {
        treeId: tree.id,
        key: "armor",
        name: "Rüstung",
        description:
          "Grundlegender Rüstungspfad.",
        sortOrder: 10
      },
      update: {
        parentNodeId: null,
        name: "Rüstung",
        description:
          "Grundlegender Rüstungspfad.",
        maxRank: null,
        sortOrder: 10
      }
    });

  const armorNodes: SeedNode[] = [
    {
      key: "helm",
      name: "Helme",
      description:
        "Spezialisierung auf geschmiedete Helme.",
      sortOrder: 10
    },
    {
      key: "shoulders",
      name: "Schultern",
      description:
        "Spezialisierung auf geschmiedete Schulterstücke.",
      sortOrder: 20
    },
    {
      key: "chest",
      name: "Brust",
      description:
        "Spezialisierung auf geschmiedete Brustplatten.",
      sortOrder: 30
    },
    {
      key: "bracers",
      name: "Armschienen",
      description:
        "Spezialisierung auf geschmiedete Armschienen.",
      sortOrder: 40
    },
    {
      key: "gloves",
      name: "Handschuhe",
      description:
        "Spezialisierung auf geschmiedete Handschuhe.",
      sortOrder: 50
    },
    {
      key: "belt",
      name: "Gürtel",
      description:
        "Spezialisierung auf geschmiedete Gürtel.",
      sortOrder: 60
    },
    {
      key: "legs",
      name: "Beine",
      description:
        "Spezialisierung auf geschmiedete Beinplatten.",
      sortOrder: 70
    },
    {
      key: "boots",
      name: "Stiefel",
      description:
        "Spezialisierung auf geschmiedete Stiefel.",
      sortOrder: 80
    },
    {
      key: "shield",
      name: "Schilde",
      description:
        "Spezialisierung auf geschmiedete Schilde.",
      sortOrder: 90
    }
  ];

  for (const node of armorNodes) {
    await prisma.professionSpecializationNode.upsert({
      where: {
        treeId_key: {
          treeId: tree.id,
          key: node.key
        }
      },
      create: {
        treeId: tree.id,
        parentNodeId: armorRoot.id,
        key: node.key,
        name: node.name,
        description:
          node.description ?? null,
        maxRank:
          node.maxRank ?? null,
        sortOrder: node.sortOrder
      },
      update: {
        parentNodeId: armorRoot.id,
        name: node.name,
        description:
          node.description ?? null,
        maxRank:
          node.maxRank ?? null,
        sortOrder: node.sortOrder
      }
    });
  }
}

async function seed() {
  await seedProfessions();
  await seedBlacksmithingArmorTree();
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });