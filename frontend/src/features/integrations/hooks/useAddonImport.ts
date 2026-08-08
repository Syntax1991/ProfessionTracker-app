import {
  useState
} from "react";
import {
  importAddonSavedVariables,
  previewAddonSavedVariables
} from "../api/addonApi";
import type {
  AddonImportPreview,
  AddonImportResult
} from "../types/addon.types";

const maximumFileSize =
  25 * 1024 * 1024;

export type AddonImportState = {
  fileName: string | null;
  fileSize: number | null;
  hasSource: boolean;
  preview: AddonImportPreview | null;
  result: AddonImportResult | null;
  isPreviewing: boolean;
  isImporting: boolean;
  error: string | null;
  selectFile: (
    file: File | null
  ) => Promise<void>;
  previewSnapshot: () => Promise<void>;
  importSnapshot: () => Promise<void>;
};

export function useAddonImport():
  AddonImportState {
  const [
    source,
    setSource
  ] = useState("");

  const [
    fileName,
    setFileName
  ] = useState<string | null>(
    null
  );

  const [
    fileSize,
    setFileSize
  ] = useState<number | null>(
    null
  );

  const [
    preview,
    setPreview
  ] = useState<AddonImportPreview | null>(
    null
  );

  const [
    result,
    setResult
  ] = useState<AddonImportResult | null>(
    null
  );

  const [
    isPreviewing,
    setIsPreviewing
  ] = useState(false);

  const [
    isImporting,
    setIsImporting
  ] = useState(false);

  const [
    error,
    setError
  ] = useState<string | null>(
    null
  );

  const clearLoadedFile = () => {
    setSource("");
    setFileName(null);
    setFileSize(null);
    setPreview(null);
    setResult(null);
  };

  const selectFile = async (
    file: File | null
  ) => {
    if (!file) {
      return;
    }

    setError(null);
    setPreview(null);
    setResult(null);

    if (
      file.size >
      maximumFileSize
    ) {
      clearLoadedFile();

      setError(
        "Die SavedVariables-Datei ist größer als 25 MB."
      );

      return;
    }

    try {
      const content =
        await file.text();

      if (
        content.trim().length ===
        0
      ) {
        throw new Error(
          "Die ausgewählte Datei ist leer."
        );
      }

      setSource(content);
      setFileName(file.name);
      setFileSize(file.size);
    }
    catch (fileError) {
      clearLoadedFile();

      setError(
        fileError instanceof Error
          ? fileError.message
          : "Die Datei konnte nicht gelesen werden."
      );
    }
  };

  const previewSnapshot =
    async () => {
      if (!source) {
        return;
      }

      setError(null);
      setResult(null);
      setIsPreviewing(true);

      try {
        const nextPreview =
          await previewAddonSavedVariables(
            source
          );

        setPreview(
          nextPreview
        );
      }
      catch (previewError) {
        setPreview(null);

        setError(
          previewError instanceof Error
            ? previewError.message
            : "Addon-Daten konnten nicht geprüft werden."
        );
      }
      finally {
        setIsPreviewing(false);
      }
    };

  const importSnapshot =
    async () => {
      if (
        !source ||
        !preview
      ) {
        return;
      }

      setError(null);
      setIsImporting(true);

      try {
        const importResult =
          await importAddonSavedVariables(
            source
          );

        setResult(
          importResult
        );
      }
      catch (importError) {
        setResult(null);

        setError(
          importError instanceof Error
            ? importError.message
            : "Addon-Daten konnten nicht importiert werden."
        );
      }
      finally {
        setIsImporting(false);
      }
    };

  return {
    fileName,
    fileSize,
    hasSource:
      source.length > 0,
    preview,
    result,
    isPreviewing,
    isImporting,
    error,
    selectFile,
    previewSnapshot,
    importSnapshot
  };
}