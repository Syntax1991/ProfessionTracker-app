import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { asTable } from "../../../data-platform/api/integrations/addon/addon-import.lua-utils.js";
import { LuaSavedVariablesParser } from "../../../data-platform/api/integrations/addon/lua-saved-variables.parser.js";
import { normalizeGuildSnapshot } from "./roster-import.normalizer.js";
import { GuildRosterImportPersistence } from "./roster-import.persistence.js";
import type {
  AddonGuildSnapshot,
  GuildRosterImportPreview,
  GuildRosterImportResult
} from "./roster-import.types.js";

const SUPPORTED_SCHEMA_VERSION = 1;

export class GuildRosterImportService {
  constructor(
    private readonly persistence:
      GuildRosterImportPersistence
  ) {}

  preview(
    source: string
  ): GuildRosterImportPreview {
    const snapshot =
      this.readSnapshot(source);

    return {
      addonVersion:
        snapshot.addonVersion,
      schemaVersion:
        snapshot.schemaVersion,
      guildName:
        snapshot.guildName,
      realm: snapshot.realm,
      region: snapshot.region,
      capturedAt:
        snapshot.capturedAt,
      totalMembers:
        snapshot.members.length,
      members:
        snapshot.members
    };
  }

  async importSavedVariables(
    source: string
  ): Promise<GuildRosterImportResult> {
    const snapshot =
      this.readSnapshot(source);

    const processed =
      await this.persistence.persist(
        snapshot
      );

    return {
      addonVersion:
        snapshot.addonVersion,
      schemaVersion:
        snapshot.schemaVersion,
      importedAt:
        new Date().toISOString(),
      processed
    };
  }

  private readSnapshot(
    source: string
  ): AddonGuildSnapshot {
    try {
      const root =
        new LuaSavedVariablesParser(
          source
        ).parse();

      if (!asTable(root.members)) {
        throw new AppError(
          400,
          "The SavedVariables file does not contain a guild roster (SynTrack_GuildDB expected)."
        );
      }

      const snapshot =
        normalizeGuildSnapshot(
          root
        );

      if (
        snapshot.schemaVersion !==
        SUPPORTED_SCHEMA_VERSION
      ) {
        throw new AppError(
          400,
          `Unsupported guild roster schema version ${snapshot.schemaVersion}. Supported version is ${SUPPORTED_SCHEMA_VERSION}.`
        );
      }

      if (
        snapshot.members.length ===
        0
      ) {
        throw new AppError(
          400,
          "The SavedVariables do not contain any guild members."
        );
      }

      return snapshot;
    }
    catch (error) {
      if (
        error instanceof AppError
      ) {
        throw error;
      }

      throw new AppError(
        400,
        "SynTrack guild SavedVariables could not be read.",
        error instanceof Error
          ? error.message
          : String(error)
      );
    }
  }
}
