import type {
  AddonImportPreview
} from "../types/addon.types";

type AddonPreviewPanelProps = {
  preview: AddonImportPreview;
};

export function AddonPreviewPanel({
  preview
}: AddonPreviewPanelProps) {
  return (
    <section className="panel addon-preview-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            VORSCHAU
          </p>

          <h2>
            Addon {preview.addonVersion}
          </h2>
        </div>

        <span className="integration-badge configured">
          Schema {preview.schemaVersion}
        </span>
      </div>

      <div className="addon-summary-grid">
        <div>
          <span>
            Charaktere
          </span>

          <strong>
            {preview.totals.characters}
          </strong>
        </div>

        <div>
          <span>
            Berufszuweisungen
          </span>

          <strong>
            {preview.totals.professionAssignments}
          </strong>
        </div>

        <div>
          <span>
            Expansionen
          </span>

          <strong>
            {preview.totals.expansions}
          </strong>
        </div>

        <div>
          <span>
            Spezialisierungsbäume
          </span>

          <strong>
            {preview.totals.trees}
          </strong>
        </div>

        <div>
          <span>
            Spezialisierungsknoten
          </span>

          <strong>
            {preview.totals.specializationNodes}
          </strong>
        </div>

        <div>
          <span>
            Wissenspunkte
          </span>

          <strong>
            {preview.totals.investedKnowledge}
          </strong>
        </div>
      </div>

      <div className="addon-preview-meta">
        <span>
          Kataloge: {preview.catalogs.length}
        </span>

        <span>
          Client: {preview.client.version ?? "unbekannt"}
        </span>

        <span>
          Build: {preview.client.build ?? "unbekannt"}
        </span>
      </div>

      <div className="addon-character-grid">
        {preview.characters.map(
          (character) => (
            <article
              className="addon-character-card"
              key={character.key}
            >
              <div className="addon-character-heading">
                <div>
                  <strong>
                    {character.name}
                  </strong>

                  <span>
                    {character.realm}
                    {" · "}
                    {character.className}
                    {" · Level "}
                    {character.level}
                  </span>
                </div>

                <span className="level-badge ready">
                  {character.region.toUpperCase()}
                </span>
              </div>

              {character.professions.length === 0 ? (
                <p className="addon-character-empty">
                  Keine Primärberufe im Snapshot.
                </p>
              ) : (
                <div className="addon-profession-list">
                  {character.professions.map(
                    (profession) => (
                      <div
                        className="addon-profession-row"
                        key={
                          `${character.key}-${profession.name}`
                        }
                      >
                        <div>
                          <strong>
                            {profession.name}
                          </strong>

                          <span>
                            Skill{" "}
                            {profession.skillLevel}
                            /
                            {profession.maxSkillLevel}
                          </span>
                        </div>

                        <span>
                          {profession.investedKnowledge} Wissen
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </article>
          )
        )}
      </div>
    </section>
  );
}