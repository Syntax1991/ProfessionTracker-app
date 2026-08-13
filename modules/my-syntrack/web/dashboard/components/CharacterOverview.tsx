import { Link } from "react-router-dom";
import type { DashboardCharacter } from "../types/dashboard.types";

type CharacterOverviewProps = {
  characters: DashboardCharacter[];
  minimumCraftingLevel: number;
};

function getSyncLabel(
  lastSyncedAt: string | null
) {
  if (!lastSyncedAt) {
    return "Manual data";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day: "2-digit",
      month: "short"
    }
  ).format(new Date(lastSyncedAt));
}

export function CharacterOverview({
  characters,
  minimumCraftingLevel
}: CharacterOverviewProps) {
  const visibleCharacters =
    characters.slice(0, 5);

  return (
    <section className="panel my-roster-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            YOUR ROSTER
          </p>

          <h2>Character overview</h2>
        </div>

        <Link
          className="button button-secondary"
          to="/characters"
        >
          Manage roster
        </Link>
      </div>

      {visibleCharacters.length === 0 ? (
        <div className="my-roster-empty">
          <strong>
            Your roster is empty
          </strong>

          <p>
            Add a character or connect
            Battle.net to start building your
            personal command center.
          </p>

          <Link
            className="button button-primary"
            to="/characters"
          >
            Add first character
          </Link>
        </div>
      ) : (
        <div className="my-roster-list">
          {visibleCharacters.map(
            (character) => (
              <Link
                className="my-roster-row"
                key={character.id}
                to={
                  `/characters/${character.id}/specializations`
                }
              >
                <span className="my-roster-avatar">
                  {character.name
                    .slice(0, 2)
                    .toUpperCase()}
                </span>

                <span className="my-roster-identity">
                  <strong>
                    {character.name}
                  </strong>

                  <small>
                    {character.className}
                    {" · "}
                    {character.realm}
                  </small>
                </span>

                <span className="my-roster-professions">
                  {character.professions.length ===
                    0 ? (
                    <small>
                      No professions
                    </small>
                  ) : (
                    character.professions.map(
                      (assignment) => (
                        <span
                          key={assignment.id}
                        >
                          {
                            assignment
                              .profession.name
                          }
                        </span>
                      )
                    )
                  )}
                </span>

                <span className="my-roster-status">
                  <strong
                    className={
                      character.level >=
                      minimumCraftingLevel
                        ? "is-ready"
                        : "is-pending"
                    }
                  >
                    Level {character.level}
                  </strong>

                  <small>
                    {getSyncLabel(
                      character.lastSyncedAt
                    )}
                  </small>
                </span>

                <span
                  aria-hidden="true"
                  className="my-roster-arrow"
                >
                  →
                </span>
              </Link>
            )
          )}
        </div>
      )}
    </section>
  );
}
