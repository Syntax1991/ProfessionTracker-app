import { Link } from "react-router-dom";
import type { Character } from "../types/character.types";

type CharacterTableProps = {
  characters: Character[];
  minimumCraftingLevel: number;
  onDelete: (
    character: Character
  ) => void;
  onEdit: (
    character: Character
  ) => void;
};

export function CharacterTable({
  characters,
  minimumCraftingLevel,
  onDelete,
  onEdit
}: CharacterTableProps) {
  if (characters.length === 0) {
    return (
      <div className="empty-state">
        No characters yet.
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Character</th>
            <th>Level</th>
            <th>Professions</th>
            <th>Source</th>
            <th aria-label="Aktionen" />
          </tr>
        </thead>

        <tbody>
          {characters.map(
            (character) => (
              <tr key={character.id}>
                <td>
                  <div className="character-identity">
                    <div className="character-avatar">
                      {character.name
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

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
                  </div>
                </td>

                <td>
                  <span
                    className={
                      character.level >=
                      minimumCraftingLevel
                        ? "level-badge ready"
                        : "level-badge pending"
                    }
                  >
                    {character.level}
                  </span>
                </td>

                <td>
                  <div className="tag-list">
                    {character.professions.length ===
                      0 && (
                      <span className="muted-text">
                        No Professions
                      </span>
                    )}

                    {character.professions.map(
                      (assignment) => (
                        <span
                          className="profession-tag"
                          key={assignment.id}
                        >
                          {
                            assignment
                              .profession
                              .name
                          }
                        </span>
                      )
                    )}
                  </div>
                </td>

                <td>
                  {character.source}
                </td>

                <td>
                  <div className="table-actions character-table-actions">
                    <Link
                      className="text-button"
                      to={
                        `/characters/${character.id}/specializations`
                      }
                    >
                      Specializations
                    </Link>

                    <button
                      className="text-button"
                      onClick={() =>
                        onEdit(
                          character
                        )
                      }
                      type="button"
                    >
                      Edit
                    </button>

                    <button
                      className="text-button danger"
                      onClick={() =>
                        onDelete(
                          character
                        )
                      }
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}