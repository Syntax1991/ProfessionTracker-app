import type { MainModuleDefinition } from "../moduleTypes";

export const lootModule: MainModuleDefinition =
  {
    id: "loot",
    label: "Loot",
    description:
      "Loot planning, council and history.",
    status: "active",
    items: [
      {
        label: "Loot Table",
        path: "/loot",
        status: "available"
      },
      {
        label: "Wishlist",
        status: "planned"
      },
      {
        label: "Droptimizer",
        status: "planned"
      },
      {
        label: "Loot Council",
        status: "planned"
      },
      {
        label: "Loot History",
        status: "planned"
      },
      {
        label: "Tier / Token Planning",
        status: "planned"
      },
      {
        label: "Split Planning",
        status: "planned"
      }
    ]
  };
