import { AppError } from "../../../shared/errors/AppError.js";
import { normalizeAddonSnapshot } from "./addon-import.normalizer.js";
import { AddonImportPersistence } from "./addon-import.persistence.js";
import { createAddonImportPreview } from "./addon-import.preview.js";
import type {
  AddonSnapshot
} from "./addon-import.types.js";
import { LuaSavedVariablesParser } from "./lua-saved-variables.parser.js";

const MIN_SUPPORTED_ADDON_SCHEMA_VERSION =
  4;

const MAX_SUPPORTED_ADDON_SCHEMA_VERSION =
  8;

function isSupportedSchemaVersion(
  schemaVersion: number
): boolean {
  return (
    schemaVersion >=
      MIN_SUPPORTED_ADDON_SCHEMA_VERSION &&
    schemaVersion <=
      MAX_SUPPORTED_ADDON_SCHEMA_VERSION
  );
}

export class AddonImportService {
  constructor(
    private readonly persistence:
      AddonImportPersistence
  ) {}

  preview(
    source: string
  ) {
    const snapshot =
      this.readSnapshot(
        source
      );

    return createAddonImportPreview(
      snapshot
    );
  }

  async importSavedVariables(
    source: string
  ) {
    const snapshot =
      this.readSnapshot(
        source
      );

    return this.persistence.persist(
      snapshot
    );
  }

  private readSnapshot(
    source: string
  ): AddonSnapshot {
    try {
      const root =
        new LuaSavedVariablesParser(
          source
        ).parse();

      const snapshot =
        normalizeAddonSnapshot(
          root
        );

      if (
        !isSupportedSchemaVersion(
          snapshot.schemaVersion
        )
      ) {
        throw new AppError(
          400,
          `Nicht unterstützte Addon-Schema-Version ${snapshot.schemaVersion}. Unterstützt werden Versionen ${MIN_SUPPORTED_ADDON_SCHEMA_VERSION} bis ${MAX_SUPPORTED_ADDON_SCHEMA_VERSION}.`
        );
      }

      if (
        snapshot
          .characters
          .length === 0
      ) {
        throw new AppError(
          400,
          "Die SavedVariables enthalten keine Charaktere."
        );
      }

      return snapshot;
    }
    catch (error) {
      if (
        error instanceof
        AppError
      ) {
        throw error;
      }

      throw new AppError(
        400,
        "ProfessionTracker SavedVariables konnten nicht gelesen werden.",
        error instanceof Error
          ? error.message
          : String(error)
      );
    }
  }
}