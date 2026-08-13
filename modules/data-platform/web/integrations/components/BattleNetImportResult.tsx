import type { BattleNetImportResult } from "../types/battlenet.types";

type BattleNetImportResultProps = {
  result: BattleNetImportResult;
};

export function BattleNetImportResultCard({
  result
}: BattleNetImportResultProps) {
  return (
    <section className="panel import-result">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            SYNC
          </p>

          <h2>
            Import complete
          </h2>
        </div>
      </div>

      <div className="import-result-content">
        <div className="import-result-grid">
          <div>
            <span>Selected</span>

            <strong>
              {result.totalCharacters}
            </strong>
          </div>

          <div>
            <span>Synced</span>

            <strong>
              {result.importedCharacters}
            </strong>
          </div>

          <div>
            <span>Failed</span>

            <strong>
              {
                result.failedCharacters
                  .length
              }
            </strong>
          </div>
        </div>

        {result.failedCharacters.length >
          0 && (
          <div className="failed-imports">
            <h3>
              Not imported characters
            </h3>

            <ul>
              {result.failedCharacters.map(
                (failure) => (
                  <li
                    key={
                      `${failure.realm}-${failure.name}`
                    }
                  >
                    <strong>
                      {failure.name}
                      {" – "}
                      {failure.realm}
                    </strong>

                    <span>
                      {failure.error}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}