import type { CSSProperties } from "react";
import type { WeeklyChecklistCharacter } from "../types/weeklyChecklist.types";

type WeeklyCharacterRosterProps = {
  characters: WeeklyChecklistCharacter[];
  selectedCharacterId: string;
  taskCount: number;
  onSelect: (characterId: string) => void;
};

export function WeeklyCharacterRoster({
  characters,
  selectedCharacterId,
  taskCount,
  onSelect
}: WeeklyCharacterRosterProps) {
  return (
    <section className="panel weekly-roster-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            CHARACTER PROGRESS
          </p>

          <h2>Your roster</h2>
        </div>

        <span className="weekly-roster-count">
          {characters.length}
        </span>
      </div>

      <div className="weekly-character-list">
        {characters.map((character) => {
          const completedCount =
            character.completedTaskKeys.length;
          const progress =
            taskCount === 0
              ? 0
              : Math.round(
                  (
                    completedCount /
                    taskCount
                  ) * 100
                );

          return (
            <button
              aria-pressed={
                character.id ===
                selectedCharacterId
              }
              className={
                character.id ===
                selectedCharacterId
                  ? "weekly-character-row is-selected"
                  : "weekly-character-row"
              }
              key={character.id}
              onClick={() =>
                onSelect(character.id)
              }
              type="button"
            >
              <span className="weekly-character-avatar">
                {character.name
                  .slice(0, 2)
                  .toUpperCase()}
              </span>

              <span className="weekly-character-identity">
                <strong>{character.name}</strong>
                <small>
                  {character.className}
                  {" · "}
                  {character.realm}
                </small>
              </span>

              <span
                className="weekly-character-progress"
                style={
                  {
                    "--weekly-progress":
                      `${progress}%`
                  } as CSSProperties
                }
              >
                <strong>
                  {completedCount}/{taskCount}
                </strong>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
