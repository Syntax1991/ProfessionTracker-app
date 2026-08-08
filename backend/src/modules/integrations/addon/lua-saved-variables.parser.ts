import type {
  LuaTable,
  LuaValue
} from "./addon-import.types.js";

export class LuaSavedVariablesParser {
  private index = 0;

  constructor(
    private readonly source: string
  ) {}

  parse(): LuaTable {
    this.skipIgnored();

    const variableName =
      this.parseIdentifier();

    if (
      variableName !==
      "ProfessionTrackerDB"
    ) {
      this.fail(
        "ProfessionTrackerDB wurde nicht gefunden"
      );
    }

    this.expect("=");

    const value =
      this.parseValue();

    if (!this.isTable(value)) {
      this.fail(
        "ProfessionTrackerDB muss eine Lua-Tabelle sein"
      );
    }

    this.skipIgnored();

    if (this.current() === ";") {
      this.index += 1;
      this.skipIgnored();
    }

    if (
      this.index <
      this.source.length
    ) {
      this.fail(
        "Unerwarteter Inhalt nach ProfessionTrackerDB"
      );
    }

    return value;
  }

  private parseValue(): LuaValue {
    this.skipIgnored();

    const character =
      this.current();

    if (character === "{") {
      return this.parseTable();
    }

    if (
      character === '"' ||
      character === "'"
    ) {
      return this.parseString();
    }

    if (
      /[+\-\d.]/u.test(
        character
      )
    ) {
      return this.parseNumber();
    }

    if (
      /[A-Za-z_]/u.test(
        character
      )
    ) {
      const identifier =
        this.parseIdentifier();

      if (identifier === "true") {
        return true;
      }

      if (identifier === "false") {
        return false;
      }

      if (identifier === "nil") {
        return null;
      }

      this.fail(
        `Unerwarteter Lua-Bezeichner ${identifier}`
      );
    }

    this.fail(
      "Lua-Wert erwartet"
    );
  }

  private parseTable(): LuaTable {
    this.expect("{");

    const result: LuaTable = {};
    let arrayIndex = 1;

    this.skipIgnored();

    while (
      this.current() !== "}"
    ) {
      if (!this.current()) {
        this.fail(
          "Lua-Tabelle wurde nicht geschlossen"
        );
      }

      if (this.current() === "[") {
        const key =
          this.parseBracketKey();

        result[key] =
          this.parseValue();
      }
      else {
        const checkpoint =
          this.index;

        if (
          /[A-Za-z_]/u.test(
            this.current()
          )
        ) {
          const candidate =
            this.parseIdentifier();

          this.skipIgnored();

          if (this.current() === "=") {
            this.index += 1;

            result[candidate] =
              this.parseValue();
          }
          else {
            this.index =
              checkpoint;

            arrayIndex =
              this.storeArrayValue(
                result,
                arrayIndex
              );
          }
        }
        else {
          arrayIndex =
            this.storeArrayValue(
              result,
              arrayIndex
            );
        }
      }

      this.skipIgnored();

      if (
        this.current() === "," ||
        this.current() === ";"
      ) {
        this.index += 1;
        this.skipIgnored();
      }
    }

    this.expect("}");

    return result;
  }

  private storeArrayValue(
    table: LuaTable,
    startingIndex: number
  ): number {
    let arrayIndex =
      startingIndex;

    while (
      Object.prototype.hasOwnProperty.call(
        table,
        String(arrayIndex)
      )
    ) {
      arrayIndex += 1;
    }

    table[
      String(arrayIndex)
    ] =
      this.parseValue();

    return arrayIndex + 1;
  }

  private parseBracketKey(): string {
    this.expect("[");
    this.skipIgnored();

    const character =
      this.current();

    let key:
      string | number;

    if (
      character === '"' ||
      character === "'"
    ) {
      key =
        this.parseString();
    }
    else if (
      /[+\-\d.]/u.test(
        character
      )
    ) {
      key =
        this.parseNumber();
    }
    else {
      this.fail(
        "Nicht unterstützter Lua-Tabellenschlüssel"
      );
    }

    this.expect("]");
    this.expect("=");

    return String(key);
  }

  private parseString(): string {
    const quote =
      this.current();

    this.index += 1;

    let result = "";

    while (
      this.index <
      this.source.length
    ) {
      const character =
        this.current();

      this.index += 1;

      if (character === quote) {
        return result;
      }

      if (character !== "\\") {
        result += character;
        continue;
      }

      if (
        this.index >=
        this.source.length
      ) {
        this.fail(
          "Unvollständige Escape-Sequenz"
        );
      }

      result +=
        this.parseEscapeSequence();
    }

    this.fail(
      "Lua-String wurde nicht geschlossen"
    );
  }

  private parseEscapeSequence(): string {
    const escaped =
      this.current();

    this.index += 1;

    const simpleEscapes:
      Record<string, string> = {
        a: "\x07",
        b: "\b",
        f: "\f",
        n: "\n",
        r: "\r",
        t: "\t",
        v: "\x0b",
        "\\": "\\",
        '"': '"',
        "'": "'"
      };

    const simpleValue =
      simpleEscapes[escaped];

    if (
      simpleValue !==
      undefined
    ) {
      return simpleValue;
    }

    if (escaped === "z") {
      while (
        /\s/u.test(
          this.current()
        )
      ) {
        this.index += 1;
      }

      return "";
    }

    if (escaped === "x") {
      return this.parseHexEscape();
    }

    if (
      /\d/u.test(
        escaped
      )
    ) {
      return this.parseDecimalEscape(
        escaped
      );
    }

    return escaped;
  }

  private parseHexEscape(): string {
    const hexadecimal =
      this.source.slice(
        this.index,
        this.index + 2
      );

    if (
      !/^[0-9A-Fa-f]{2}$/u.test(
        hexadecimal
      )
    ) {
      this.fail(
        "Ungültige hexadezimale Escape-Sequenz"
      );
    }

    this.index += 2;

    return String.fromCharCode(
      Number.parseInt(
        hexadecimal,
        16
      )
    );
  }

  private parseDecimalEscape(
    firstDigit: string
  ): string {
    let digits =
      firstDigit;

    while (
      digits.length < 3 &&
      /\d/u.test(
        this.current()
      )
    ) {
      digits +=
        this.current();

      this.index += 1;
    }

    return String.fromCharCode(
      Number.parseInt(
        digits,
        10
      )
    );
  }

  private parseNumber(): number {
    const match =
      this.source
        .slice(
          this.index
        )
        .match(
          /^[+-]?(?:\d+\.\d*|\.\d+|\d+)(?:[eE][+-]?\d+)?/u
        );

    if (!match) {
      this.fail(
        "Ungültige Lua-Zahl"
      );
    }

    const rawNumber =
      match[0];

    this.index +=
      rawNumber.length;

    const value =
      Number(
        rawNumber
      );

    if (
      !Number.isFinite(
        value
      )
    ) {
      this.fail(
        "Lua-Zahl ist nicht endlich"
      );
    }

    return value;
  }

  private parseIdentifier(): string {
    this.skipIgnored();

    const match =
      this.source
        .slice(
          this.index
        )
        .match(
          /^[A-Za-z_][A-Za-z0-9_]*/u
        );

    if (!match) {
      this.fail(
        "Lua-Bezeichner erwartet"
      );
    }

    const value =
      match[0];

    this.index +=
      value.length;

    return value;
  }

  private skipIgnored(): void {
    while (
      this.index <
      this.source.length
    ) {
      if (
        /\s/u.test(
          this.current()
        )
      ) {
        this.index += 1;
        continue;
      }

      if (
        this.source.startsWith(
          "--[[",
          this.index
        )
      ) {
        const commentEnd =
          this.source.indexOf(
            "]]",
            this.index + 4
          );

        if (commentEnd < 0) {
          this.fail(
            "Lua-Blockkommentar wurde nicht geschlossen"
          );
        }

        this.index =
          commentEnd + 2;

        continue;
      }

      if (
        this.source.startsWith(
          "--",
          this.index
        )
      ) {
        const lineEnd =
          this.source.indexOf(
            "\n",
            this.index + 2
          );

        this.index =
          lineEnd < 0
            ? this.source.length
            : lineEnd + 1;

        continue;
      }

      break;
    }
  }

  private expect(
    expected: string
  ): void {
    this.skipIgnored();

    if (
      !this.source.startsWith(
        expected,
        this.index
      )
    ) {
      this.fail(
        `"${expected}" erwartet`
      );
    }

    this.index +=
      expected.length;
  }

  private current(): string {
    return (
      this.source[
        this.index
      ] ?? ""
    );
  }

  private isTable(
    value: LuaValue
  ): value is LuaTable {
    return (
      typeof value === "object" &&
      value !== null
    );
  }

  private fail(
    message: string
  ): never {
    throw new Error(
      `${message} bei Zeichen ${this.index}.`
    );
  }
}