import type {
  LuaTable
} from "./addon-import.types.js";
import { LuaParserCursor } from "./lua-parser.cursor.js";
import { LuaTableValueParser } from "./lua-table-value.parser.js";

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
      variableName !==
      "ProfessionTrackerDB"
    ) {
      cursor.fail(
        "ProfessionTrackerDB wurde nicht gefunden"
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
        "ProfessionTrackerDB muss eine Lua-Tabelle sein"
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
        "Unerwarteter Inhalt nach ProfessionTrackerDB"
      );
    }

    return table;
  }
}