import {
  useState
} from "react";
import {
  importGuildRoster,
  previewGuildRosterImport
} from "../api/rosterImportApi";
import type {
  GuildRosterImportPreview,
  GuildRosterImportResult
} from "../types/rosterImport.types";

const maximumFileSize =
  5 * 1024 * 1024;

export type RosterImportState = {
  fileName: string | null;
  fileSize: number | null;
  hasSource: boolean;
  preview: GuildRosterImportPreview | null;
  result: GuildRosterImportResult | null;
  isPreviewing: boolean;
  isImporting: boolean;
  error: string | null;
  selectFile: (
    file: File | null
  ) => Promise<void>;
  previewSnapshot: () => Promise<void>;
  importSnapshot: () => Promise<void>;
};

export function useRosterImport(
  onImported: () => void
): RosterImportState {
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
  ] = useState<GuildRosterImportPreview | null>(
    null
  );

  const [
    result,
    setResult
  ] = useState<GuildRosterImportResult | null>(
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
        "The SavedVariables file is larger than 5 MB."
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
          "The selected file is empty."
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
          : "The file could not be read."
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
          await previewGuildRosterImport(
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
            : "Guild roster data could not be validated."
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
          await importGuildRoster(
            source
          );

        setResult(
          importResult
        );

        onImported();
      }
      catch (importError) {
        setResult(null);

        setError(
          importError instanceof Error
            ? importError.message
            : "Guild roster could not be imported."
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
