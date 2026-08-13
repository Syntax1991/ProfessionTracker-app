import type {
  LuaTable,
  LuaValue
} from "./addon-import.types.js";
import { LuaParserCursor } from "./lua-parser.cursor.js";
import { LuaStringParser } from "./lua-string.parser.js";

export class LuaTableValueParser {
  private readonly stringParser:
    LuaStringParser;

  constructor(
    private readonly cursor:
      LuaParserCursor
  ) {
    this.stringParser =
      new LuaStringParser(
        cursor
      );
  }

  parseValue(): LuaValue {
    this.cursor.skipIgnored();

    const character =
      this.cursor.current();

    if (character === "{") {
      return this.parseTable();
    }

    if (
      character === '"' ||
      character === "'"
    ) {
      return this.stringParser.parse();
    }

    if (/[+\-\d.]/u.test(character)) {
      return this.cursor.parseNumber();
    }

    if (/[A-Za-z_]/u.test(character)) {
      return this.parseKeyword();
    }

    this.cursor.fail(
      "Lua-Wert erwartet"
    );
  }

  isTable(
    value: LuaValue
  ): value is LuaTable {
    return (
      typeof value === "object" &&
      value !== null
    );
  }

  private parseKeyword(): LuaValue {
    const identifier =
      this.cursor.parseIdentifier();

    if (identifier === "true") {
      return true;
    }

    if (identifier === "false") {
      return false;
    }

    if (identifier === "nil") {
      return null;
    }

    this.cursor.fail(
      `Unerwarteter Lua-Bezeichner ${identifier}`
    );
  }

  private parseTable(): LuaTable {
    this.cursor.expect("{");

    const table: LuaTable = {};
    let arrayIndex = 1;

    this.cursor.skipIgnored();

    while (
      this.cursor.current() !== "}"
    ) {
      if (!this.cursor.hasMore()) {
        this.cursor.fail(
          "Lua-Tabelle wurde nicht geschlossen"
        );
      }

      if (this.cursor.current() === "[") {
        const key =
          this.parseBracketKey();

        table[key] =
          this.parseValue();
      }
      else {
        arrayIndex =
          this.parseTableEntry(
            table,
            arrayIndex
          );
      }

      this.cursor.skipIgnored();

      if (
        this.cursor.current() === "," ||
        this.cursor.current() === ";"
      ) {
        this.cursor.advance();
        this.cursor.skipIgnored();
      }
    }

    this.cursor.expect("}");

    return table;
  }

  private parseTableEntry(
    table: LuaTable,
    arrayIndex: number
  ): number {
    const checkpoint =
      this.cursor.position();

    if (
      /[A-Za-z_]/u.test(
        this.cursor.current()
      )
    ) {
      const candidate =
        this.cursor.parseIdentifier();

      this.cursor.skipIgnored();

      if (this.cursor.current() === "=") {
        this.cursor.advance();

        table[candidate] =
          this.parseValue();

        return arrayIndex;
      }

      this.cursor.setPosition(
        checkpoint
      );
    }

    let nextIndex = arrayIndex;

    while (
      Object.prototype
        .hasOwnProperty.call(
          table,
          String(nextIndex)
        )
    ) {
      nextIndex += 1;
    }

    table[String(nextIndex)] =
      this.parseValue();

    return nextIndex + 1;
  }

  private parseBracketKey(): string {
    this.cursor.expect("[");
    this.cursor.skipIgnored();

    const character =
      this.cursor.current();

    let key:
      string | number;

    if (
      character === '"' ||
      character === "'"
    ) {
      key =
        this.stringParser.parse();
    }
    else if (
      /[+\-\d.]/u.test(character)
    ) {
      key =
        this.cursor.parseNumber();
    }
    else {
      this.cursor.fail(
        "Nicht unterstützter Lua-Tabellenschlüssel"
      );
    }

    this.cursor.expect("]");
    this.cursor.expect("=");

    return String(key);
  }
}