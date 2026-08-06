import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter =
  new PrismaBetterSqlite3({
    url:
      process.env.DATABASE_URL ??
      "file:./prisma/dev.db"
  });

const prisma =
  new PrismaClient({
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

async function seed() {
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

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });