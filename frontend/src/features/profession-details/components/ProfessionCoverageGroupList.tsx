import { Link } from "react-router-dom";
import type {
  ProfessionCoverageGroup
} from "../utils/professionCoverageGroups";

type ProfessionCoverageGroupListProps = {
  title: string;
  description: string;
  emptyText: string;
  groups:
    ProfessionCoverageGroup[];
};

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
                  <h4>
                    {group.name}
                  </h4>

                  <span>
                    {group.characters.length}
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
                              {character.name}
                            </strong>

                            <span>
                              {character.className}
                              {" · "}
                              {character.realm}
                            </span>
                          </div>

                          <div className="profession-coverage-character-meta">
                            <span>
                              {character.source}
                            </span>
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