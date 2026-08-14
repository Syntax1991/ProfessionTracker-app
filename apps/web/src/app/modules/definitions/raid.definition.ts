import type { MainModuleDefinition } from "../moduleTypes";

export const raidModule: MainModuleDefinition =
  {
    id: "raid",
    label: "Raid",
    description:
      "Raid events, attendance and analysis.",
    status: "active",
    items: [
      {
        label: "Events",
        path: "/raid/planner",
        status: "available"
      },
      {
        label: "Attendance",
        path: "/raid/attendance",
        status: "available"
      },
      {
        label: "Cooldowns",
        path: "/raid/cooldowns",
        status: "available"
      },
      {
        label: "WCL Analysis",
        status: "planned"
      }
    ]
  };