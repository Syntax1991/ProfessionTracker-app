export type MainModuleStatus =
  | "active"
  | "planned";

export type MainModuleItemStatus =
  | "available"
  | "planned";

export type MainModuleItem = {
  label: string;
  path?: string;
  status: MainModuleItemStatus;
  end?: boolean;
};

export type MainModuleDefinition = {
  id:
    | "my-syntrack"
    | "guild"
    | "raid"
    | "loot"
    | "professions"
    | "recruitment"
    | "automation"
    | "data-platform";
  label: string;
  description: string;
  status: MainModuleStatus;
  items: MainModuleItem[];
};

export const mainModules:
  MainModuleDefinition[] = [
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
          status: "planned"
        },
        {
          label: "Raid Tasks",
          status: "planned"
        },
        {
          label: "Gear / Enchants / Gems",
          status: "planned"
        },
        {
          label: "Professions",
          status: "planned"
        }
      ]
    },
    {
      id: "guild",
      label: "Guild",
      description:
        "Guild organization, roster and progress.",
      status: "planned",
      items: [
        {
          label: "Dashboard",
          status: "planned"
        },
        {
          label: "Roster",
          status: "planned"
        },
        {
          label: "Teams",
          status: "planned"
        },
        {
          label: "Attendance",
          status: "planned"
        },
        {
          label: "Weekly Progress",
          status: "planned"
        },
        {
          label: "Requirements",
          status: "planned"
        },
        {
          label: "Officer Notes",
          status: "planned"
        }
      ]
    },
    {
      id: "raid",
      label: "Raid",
      description:
        "Planning, assignments and raid analysis.",
      status: "planned",
      items: [
        {
          label: "Raid Planner",
          status: "planned"
        },
        {
          label: "Boss Rosters",
          status: "planned"
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
    },
    {
      id: "loot",
      label: "Loot",
      description:
        "Loot planning, council and history.",
      status: "planned",
      items: [
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
    },
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
    },
    {
      id: "recruitment",
      label: "Recruitment",
      description:
        "Applications, trials and recruitment data.",
      status: "planned",
      items: [
        {
          label: "Applications",
          status: "planned"
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
          label: "Availability",
          status: "planned"
        },
        {
          label: "Trial Tracking",
          status: "planned"
        },
        {
          label: "Recruitment Board",
          status: "planned"
        }
      ]
    },
    {
      id: "automation",
      label: "Automation",
      description:
        "Alerts, reminders and Discord workflows.",
      status: "planned",
      items: [
        {
          label: "Discord Bot",
          status: "planned"
        },
        {
          label: "Reminders",
          status: "planned"
        },
        {
          label: "Missing Weeklies",
          status: "planned"
        },
        {
          label: "Raid Signup Alerts",
          status: "planned"
        },
        {
          label: "Officer Alerts",
          status: "planned"
        }
      ]
    },
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
    }
  ];

export function getAvailableModuleItems(
  module: MainModuleDefinition
) {
  return module.items.filter(
    (item) =>
      item.status === "available" &&
      typeof item.path === "string"
  );
}

export function getPlannedModuleItemCount(
  module: MainModuleDefinition
) {
  return module.items.filter(
    (item) =>
      item.status === "planned"
  ).length;
}
