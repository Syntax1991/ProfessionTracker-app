import type { Profession } from "../types/profession.types";

type ProfessionGridProps = {
  professions: Profession[];
};

export function ProfessionGrid({
  professions
}: ProfessionGridProps) {
  return (
    <div className="profession-grid">
      {professions.map((profession) => (
        <article
          className="profession-card"
          key={profession.id}
        >
          <div>
            <span className="category-badge">
              {profession.category ===
              "GATHERING"
                ? "Sammelberuf"
                : "Herstellungsberuf"}
            </span>

            <h3>{profession.name}</h3>
          </div>

          <strong>
            {profession.assignmentCount}
          </strong>

          <small>
            zugewiesene Charaktere
          </small>
        </article>
      ))}
    </div>
  );
}