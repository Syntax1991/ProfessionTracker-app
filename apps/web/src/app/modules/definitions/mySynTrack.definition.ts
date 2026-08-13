import type { MainModuleDefinition } from "../moduleTypes";

export const mySynTrackModule: MainModuleDefinition =
  {
    id: "my-syntrack",
    label: "My SynTrack",
    description:
      "Your characters and personal weekly progress.",
    status: "active",
    items: [
      {
        label: "Overview",
        path: "/",
        status: "available",
        end: true
      },
      {
        label: "My Characters",
        path: "/characters",
        status: "available"
      },
      {
        label: "Weekly Checklist",
        path: "/weekly-checklist",
        status: "available"
      },
      {
        label: "Vault / M+",
        path: "/vault-mythic-plus",
        status: "available"
      },
      {
        label: "Raid Tasks",
        path: "/raid-tasks",
        status: "available"
      },
      {
        label: "Gear / Enchants / Gems",
        path: "/gear-readiness",
        status: "available"
      },
      {
        label: "Professions",
        status: "planned"
      }
    ]
  };
