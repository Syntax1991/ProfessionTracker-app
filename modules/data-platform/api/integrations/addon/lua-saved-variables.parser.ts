import type {
  LuaTable
} from "./addon-import.types.js";
import { LuaParserCursor } from "./lua-parser.cursor.js";
import { LuaTableValueParser } from "./lua-table-value.parser.js";

const supportedVariableNames =
  new Set([
    "ProfessionTrackerDB",
    "SynTrackCoreDB",
    "SynTrack_GuildDB"
  ]);

export class LuaSavedVariablesParser {
  constructor(
    private readonly source: string
  ) {}

  parse(): LuaTable {
    const cursor =
      new LuaParserCursor(
        this.source
      );

    const valueParser =
      new LuaTableValueParser(
        cursor
      );

    cursor.skipIgnored();

    const variableName =
      cursor.parseIdentifier();

    if (
      !supportedVariableNames.has(
        variableName
      )
    ) {
      cursor.fail(
        "No supported SynTrack SavedVariables table was found"
      );
    }

    cursor.expect("=");

    const value =
      valueParser.parseValue();

    if (
      typeof value !== "object" ||
      value === null
    ) {
      cursor.fail(
        `${variableName} must be a Lua table`
      );
    }

    const table =
      value as LuaTable;

    cursor.skipIgnored();

    if (
      cursor.current() ===
      ";"
    ) {
      cursor.advance();
      cursor.skipIgnored();
    }

    if (
      cursor.hasMore()
    ) {
      cursor.fail(
        `Unexpected content after ${variableName}`
      );
    }

    return table;
  }
}