import { Link } from "react-router-dom";
import type {
  ProfessionCoverageCharacter,
  ProfessionCoverageGroup
} from "../utils/professionCoverageGroups";

type ProfessionCoverageGroupListProps = {
  title: string;
  description: string;
  emptyText: string;
  groups:
    ProfessionCoverageGroup[];
};

function formatRank(
  character:
    ProfessionCoverageCharacter
): string {
  if (
    character.maxRank === null
  ) {
    return `Rang ${character.rank}`;
  }

  return (
    `${character.rank}/${character.maxRank}`
  );
}

export function ProfessionCoverageGroupList({
  title,
  description,
  emptyText,
  groups
}: ProfessionCoverageGroupListProps) {
  return (
    <section className="panel profession-coverage-group-panel">
      <header className="profession-coverage-group-panel-header">
        <div>
          <h3>
            {title}
          </h3>

          <p>
            {description}
          </p>
        </div>

        <span>
          {groups.length}
        </span>
      </header>

      {groups.length === 0 ? (
        <div className="profession-coverage-group-empty">
          {emptyText}
        </div>
      ) : (
        <div className="profession-coverage-group-list">
          {groups.map(
            (group) => (
              <article
                className="profession-coverage-group"
                key={group.id}
              >
                <header>
                  <div>
                    <h4>
                      {group.name}
                    </h4>

                    <p>
                      {group.path}
                    </p>
                  </div>

                  <span>
                    {
                      group
                        .characters
                        .length
                    }
                    {" Crafter"}
                  </span>
                </header>

                <ul>
                  {group.characters.map(
                    (character) => (
                      <li
                        key={
                          character.id
                        }
                      >
                        <Link
                          to={
                            `/characters/${character.id}`
                          }
                        >
                          <div>
                            <strong>
                              {
                                character
                                  .name
                              }
                            </strong>

                            <span>
                              {
                                character
                                  .className
                              }
                              {" · "}
                              {
                                character
                                  .realm
                              }
                            </span>
                          </div>

                          <div className="profession-coverage-character-meta">
                            <span>
                              {
                                character
                                  .source
                              }
                            </span>

                            <strong>
                              {formatRank(
                                character
                              )}
                            </strong>
                          </div>
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}