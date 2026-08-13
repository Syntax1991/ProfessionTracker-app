import type { MainModuleDefinition } from "../moduleTypes";

export const professionsModule: MainModuleDefinition =
  {
    id: "professions",
    label: "Professions",
    description:
      "Crafting intelligence and crafter coverage.",
    status: "active",
    items: [
      {
        label: "Overview",
        path: "/professions",
        status: "available",
        end: true
      },
      {
        label: "Crafter Finder",
        path: "/professions/crafters",
        status: "available"
      },
      {
        label: "Recipes",
        path: "/professions/recipes",
        status: "available"
      },
      {
        label: "Knowledge",
        path: "/professions/knowledge",
        status: "available"
      },
      {
        label: "Specializations",
        path: "/professions/specializations",
        status: "available"
      },
      {
        label: "Material Quality",
        path: "/professions/material-quality",
        status: "available"
      },
      {
        label: "Concentration",
        path: "/professions/concentration",
        status: "available"
      },
      {
        label: "Craft Recommendations",
        path: "/professions/recommendations",
        status: "available"
      }
    ]
  };
