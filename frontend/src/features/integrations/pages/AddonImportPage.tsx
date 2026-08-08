import { PageHeader } from "../../../shared/components/PageHeader";
import { StatusMessage } from "../../../shared/components/StatusMessage";
import { AddonFilePanel } from "../components/AddonFilePanel";
import { AddonImportResultPanel } from "../components/AddonImportResultPanel";
import { AddonPreviewPanel } from "../components/AddonPreviewPanel";
import { useAddonImport } from "../hooks/useAddonImport";

export function AddonImportPage() {
  const addonImport =
    useAddonImport();

  return (
    <>
      <PageHeader
        description="Importiere die vom WoW-Addon erzeugte ProfessionTracker.lua, prüfe den Snapshot und übernehme Berufe, Wissenspunkte und Spezialisierungen."
        eyebrow="INTEGRATION"
        title="WoW Addon Sync"
      />

      {addonImport.error && (
        <StatusMessage type="error">
          {addonImport.error}
        </StatusMessage>
      )}

      {addonImport.result && (
        <StatusMessage type="info">
          Addon-Daten wurden erfolgreich importiert.
        </StatusMessage>
      )}

      <AddonFilePanel
        fileName={
          addonImport.fileName
        }
        fileSize={
          addonImport.fileSize
        }
        hasPreview={
          addonImport.preview !==
          null
        }
        hasSource={
          addonImport.hasSource
        }
        isImporting={
          addonImport.isImporting
        }
        isPreviewing={
          addonImport.isPreviewing
        }
        onFileSelected={
          addonImport.selectFile
        }
        onImport={
          addonImport.importSnapshot
        }
        onPreview={
          addonImport.previewSnapshot
        }
      />

      {addonImport.preview && (
        <AddonPreviewPanel
          preview={
            addonImport.preview
          }
        />
      )}

      {addonImport.result && (
        <AddonImportResultPanel
          result={
            addonImport.result
          }
        />
      )}
    </>
  );
}