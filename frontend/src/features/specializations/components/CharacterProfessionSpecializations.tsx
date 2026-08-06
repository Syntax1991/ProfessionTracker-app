import type { CharacterProfessionSpecialization } from "../types/specialization.types";
import { SpecializationTreeCard } from "./SpecializationTreeCard";

type CharacterProfessionSpecializationsProps = {
  profession:
    CharacterProfessionSpecialization;
  ranks: Record<string, number>;
  isSaving: boolean;
  onRankChange: (
    nodeId: string,
    rank: number
  ) => void;
  onSave: () => void;
};

export function CharacterProfessionSpecializations({
  profession,
  ranks,
  isSaving,
  onRankChange,
  onSave
}: CharacterProfessionSpecializationsProps) {
  return (
    <section className="panel profession-specialization-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            BERUF
          </p>

          <h2>
            {
              profession
                .profession
                .name
            }
          </h2>
        </div>

        <div className="profession-specialization-actions">
          <div className="profession-skill-summary">
            <span>
              Skill
            </span>

            <strong>
              {profession.skill}
            </strong>
          </div>

          <button
            className="button button-primary"
            disabled={
              isSaving ||
              profession.trees.length === 0
            }
            onClick={
              onSave
            }
            type="button"
          >
            {isSaving
              ? "Speichern…"
              : "Spezialisierung speichern"}
          </button>
        </div>
      </div>

      {profession.trees.length === 0 ? (
        <div className="empty-state">
          Für diesen Beruf ist noch kein
          Spezialisierungskatalog hinterlegt.
        </div>
      ) : (
        <div className="specialization-tree-grid">
          {profession.trees.map(
            (tree) => (
              <SpecializationTreeCard
                key={
                  tree.id
                }
                onRankChange={
                  onRankChange
                }
                ranks={
                  ranks
                }
                tree={
                  tree
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
}