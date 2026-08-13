import type { MainModuleDefinition } from "../moduleTypes";

export const dataPlatformModule: MainModuleDefinition =
  {
    id: "data-platform",
    label: "Data Platform",
    description:
      "External data, imports and synchronization.",
    status: "active",
    items: [
      {
        label: "SynTrack Addon",
        path: "/addon",
        status: "available"
      },
      {
        label: "Battle.net",
        path: "/battlenet",
        status: "available"
      },
      {
        label: "Raider.io",
        status: "planned"
      },
      {
        label: "Warcraft Logs",
        status: "planned"
      },
      {
        label: "SynTrack Companion",
        status: "planned"
      }
    ]
  };
