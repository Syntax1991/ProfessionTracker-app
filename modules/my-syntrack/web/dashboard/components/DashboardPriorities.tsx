import { Link } from "react-router-dom";
import type { DashboardSummary } from "../types/dashboard.types";

type DashboardPrioritiesProps = {
  summary: DashboardSummary;
};

type Priority = {
  label: string;
  detail: string;
  path: string;
  tone: "success" | "warning" | "primary";
};

function getPriorities(
  summary: DashboardSummary
): Priority[] {
  const priorities: Priority[] = [];
  const missingCoverage =
    summary.professionCoverage.filter(
      (profession) =>
        profession.assignmentCount === 0
    );
  const charactersBelowLevel =
    summary.characterCount -
    summary.craftingReadyCharacterCount;
  const unsyncedCharacters =
    summary.characterCount -
    summary.syncedCharacterCount;

  if (summary.characterCount === 0) {
    priorities.push({
      label: "Build your roster",
      detail:
        "Add your first character to unlock personal tracking.",
      path: "/characters",
      tone: "primary"
    });
  }

  if (charactersBelowLevel > 0) {
    priorities.push({
      label: "Review character readiness",
      detail:
        `${charactersBelowLevel} ${charactersBelowLevel === 1 ? "character is" : "characters are"} below level ${summary.minimumCraftingLevel}.`,
      path: "/characters",
      tone: "warning"
    });
  }

  if (missingCoverage.length > 0) {
    const preview = missingCoverage
      .slice(0, 3)
      .map((profession) => profession.name)
      .join(", ");

    priorities.push({
      label: "Close profession gaps",
      detail:
        `${missingCoverage.length} uncovered: ${preview}${missingCoverage.length > 3 ? "…" : ""}`,
      path: "/professions",
      tone: "primary"
    });
  }

  if (unsyncedCharacters > 0) {
    priorities.push({
      label: "Refresh character data",
      detail:
        `${unsyncedCharacters} ${unsyncedCharacters === 1 ? "character uses" : "characters use"} manual data only.`,
      path: "/battlenet",
      tone: "warning"
    });
  }

  if (priorities.length === 0) {
    priorities.push({
      label: "Roster ready",
      detail:
        "Your current character and profession setup has no open gaps.",
      path: "/professions",
      tone: "success"
    });
  }

  return priorities.slice(0, 4);
}

export function DashboardPriorities({
  summary
}: DashboardPrioritiesProps) {
  const priorities =
    getPriorities(summary);

  return (
    <section className="panel my-priorities-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            NEXT ACTIONS
          </p>

          <h2>What needs attention</h2>
        </div>

        <span className="my-action-count">
          {priorities.length}
        </span>
      </div>

      <div className="my-priority-list">
        {priorities.map((priority) => (
          <Link
            className="my-priority-item"
            key={priority.label}
            to={priority.path}
          >
            <span
              className={
                `my-priority-marker ${priority.tone}`
              }
            />

            <span>
              <strong>{priority.label}</strong>
              <small>{priority.detail}</small>
            </span>

            <span
              aria-hidden="true"
              className="my-priority-arrow"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
