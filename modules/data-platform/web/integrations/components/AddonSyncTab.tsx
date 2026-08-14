import { StatusMessage } from "../../../../../apps/web/src/shared/components/StatusMessage";
import { AddonFilePanel } from "./AddonFilePanel";
import { AddonImportResultPanel } from "./AddonImportResultPanel";
import { AddonPreviewPanel } from "./AddonPreviewPanel";
import { useAddonImport } from "../hooks/useAddonImport";

export function AddonSyncTab() {
  const addonImport =
    useAddonImport();

  return (
    <>
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
