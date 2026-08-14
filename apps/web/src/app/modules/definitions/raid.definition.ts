import type { MainModuleDefinition } from "../moduleTypes";

export const raidModule: MainModuleDefinition =
  {
    id: "raid",
    label: "Raid",
    description:
      "Planning, assignments and raid analysis.",
    status: "active",
    items: [
      {
        label: "Raid Planner",
        path: "/raid/planner",
        status: "available"
      },
      {
        label: "Boss Rosters",
        path: "/raid/boss-rosters",
        status: "available"
      },
      {
        label: "Assignments",
        status: "planned"
      },
      {
        label: "Cooldowns",
        status: "planned"
      },
      {
        label: "Raid Notes",
        status: "planned"
      },
      {
        label: "Attendance",
        status: "planned"
      },
      {
        label: "WCL Analysis",
        status: "planned"
      }
    ]
  };
