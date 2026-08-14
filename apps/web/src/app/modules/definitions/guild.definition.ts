import type { MainModuleDefinition } from "../moduleTypes";

export const guildModule: MainModuleDefinition =
  {
    id: "guild",
    label: "Guild",
    description:
      "Guild organization, roster and leadership.",
    status: "active",
    items: [
      {
        label: "Dashboard",
        path: "/guild",
        status: "available"
      },
      {
        label: "Roster",
        path: "/guild/roster",
        status: "available"
      },
      {
        label: "Teams",
        path: "/guild/teams",
        status: "available"
      },
      {
        label: "Gear Audit",
        path: "/guild/audit",
        status: "available"
      },
      {
        label: "Raider Progress",
        path: "/guild/weekly-progress",
        status: "available"
      },
      {
        label: "Requirements",
        path: "/guild/requirements",
        status: "available"
      },
      {
        label: "Officer Notes",
        path: "/guild/officer-notes",
        status: "available"
      }
    ]
  };