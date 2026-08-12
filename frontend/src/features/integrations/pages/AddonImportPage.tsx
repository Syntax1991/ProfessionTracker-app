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
        description="Import the ProfessionTracker.lua created by the WoW addon, review the snapshot and sync professions, Knowledge Points and specializations."
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
          Addon data was imported successfully.
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