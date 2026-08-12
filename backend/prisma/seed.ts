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
    name: "Alchemy",
    category: "CRAFTING",
    order: 10
  },
  {
    key: "blacksmithing",
    name: "Blacksmithing",
    category: "CRAFTING",
    order: 20
  },
  {
    key: "enchanting",
    name: "Enchanting",
    category: "CRAFTING",
    order: 30
  },
  {
    key: "engineering",
    name: "Engineering",
    category: "CRAFTING",
    order: 40
  },
  {
    key: "inscription",
    name: "Inscription",
    category: "CRAFTING",
    order: 50
  },
  {
    key: "jewelcrafting",
    name: "Jewelcrafting",
    category: "CRAFTING",
    order: 60
  },
  {
    key: "leatherworking",
    name: "Leatherworking",
    category: "CRAFTING",
    order: 70
  },
  {
    key: "tailoring",
    name: "Tailoring",
    category: "CRAFTING",
    order: 80
  },
  {
    key: "herbalism",
    name: "Herbalism",
    category: "GATHERING",
    order: 90
  },
  {
    key: "mining",
    name: "Mining",
    category: "GATHERING",
    order: 100
  },
  {
    key: "skinning",
    name: "Skinning",
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
        name: "Armor",
        description:
          "Specialization in crafting armor pieces.",
        sortOrder: 10
      },
      update: {
        name: "Armor",
        description:
          "Specialization in crafting armor pieces.",
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
        name: "Armor",
        description:
          "Core armor specialization path.",
        sortOrder: 10
      },
      update: {
        parentNodeId: null,
        name: "Armor",
        description:
          "Core armor specialization path.",
        maxRank: null,
        sortOrder: 10
      }
    });

  const armorNodes: SeedNode[] = [
    {
      key: "helm",
      name: "Helms",
      description:
        "Specialization in crafted helms.",
      sortOrder: 10
    },
    {
      key: "shoulders",
      name: "Shoulders",
      description:
        "Specialization in crafted shoulder pieces.",
      sortOrder: 20
    },
    {
      key: "chest",
      name: "Chest",
      description:
        "Specialization in crafted chest pieces.",
      sortOrder: 30
    },
    {
      key: "bracers",
      name: "Bracers",
      description:
        "Specialization in crafted bracers.",
      sortOrder: 40
    },
    {
      key: "gloves",
      name: "Gloves",
      description:
        "Specialization in crafted gloves.",
      sortOrder: 50
    },
    {
      key: "belt",
      name: "Belts",
      description:
        "Specialization in crafted belts.",
      sortOrder: 60
    },
    {
      key: "legs",
      name: "Legs",
      description:
        "Specialization in crafted leg armor.",
      sortOrder: 70
    },
    {
      key: "boots",
      name: "Boots",
      description:
        "Specialization in crafted boots.",
      sortOrder: 80
    },
    {
      key: "shield",
      name: "Shields",
      description:
        "Specialization in crafted shields.",
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