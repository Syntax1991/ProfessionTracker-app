import type {
  ChangeEvent
} from "react";

type AddonFilePanelProps = {
  fileName: string | null;
  fileSize: number | null;
  hasSource: boolean;
  hasPreview: boolean;
  isPreviewing: boolean;
  isImporting: boolean;
  onFileSelected: (
    file: File | null
  ) => Promise<void>;
  onPreview: () => Promise<void>;
  onImport: () => Promise<void>;
};

function formatFileSize(
  bytes: number
): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes =
    bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  return `${(
    kilobytes / 1024
  ).toFixed(1)} MB`;
}

export function AddonFilePanel({
  fileName,
  fileSize,
  hasSource,
  hasPreview,
  isPreviewing,
  isImporting,
  onFileSelected,
  onPreview,
  onImport
}: AddonFilePanelProps) {
  const handleFileChange = (
    event:
      ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] ??
      null;

    event.target.value = "";

    void onFileSelected(
      file
    );
  };

  return (
    <section className="panel addon-import-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            SAVEDVARIABLES
          </p>

          <h2>
            ProfessionTracker.lua
          </h2>
        </div>

        <span className="integration-badge configured">
          Schema 4
        </span>
      </div>

      <div className="instruction-box">
        <strong>
          Wo finde ich die Datei?
        </strong>

        <p>
          Öffne deinen WoW-Ordner und wähle
          unter WTF → Account → dein Account →
          SavedVariables die Datei
          ProfessionTracker.lua aus.
        </p>
      </div>

      <div className="addon-file-picker">
        <label
          className="button button-secondary"
          htmlFor="addon-savedvariables-file"
        >
          Datei auswählen
        </label>

        <input
          accept=".lua,text/plain"
          id="addon-savedvariables-file"
          onChange={handleFileChange}
          type="file"
        />

        <div className="addon-file-details">
          {fileName ? (
            <>
              <strong>
                {fileName}
              </strong>

              <span>
                {fileSize === null
                  ? "Datei geladen"
                  : formatFileSize(
                      fileSize
                    )}
              </span>
            </>
          ) : (
            <span>
              Noch keine SavedVariables-Datei ausgewählt.
            </span>
          )}
        </div>
      </div>

      <div className="integration-actions">
        <button
          className="button button-secondary"
          disabled={
            !hasSource ||
            isPreviewing ||
            isImporting
          }
          onClick={() => {
            void onPreview();
          }}
          type="button"
        >
          {isPreviewing
            ? "Prüfe…"
            : "Snapshot prüfen"}
        </button>

        <button
          className="button button-primary"
          disabled={
            !hasPreview ||
            isPreviewing ||
            isImporting
          }
          onClick={() => {
            void onImport();
          }}
          type="button"
        >
          {isImporting
            ? "Importiere…"
            : "Daten importieren"}
        </button>
      </div>
    </section>
  );
}