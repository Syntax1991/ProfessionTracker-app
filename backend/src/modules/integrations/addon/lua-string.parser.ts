import { LuaParserCursor } from "./lua-parser.cursor.js";

export class LuaStringParser {
  constructor(
    private readonly cursor:
      LuaParserCursor
  ) {}

  parse(): string {
    this.cursor.skipIgnored();

    const quote =
      this.cursor.current();

    if (
      quote !== '"' &&
      quote !== "'"
    ) {
      this.cursor.fail(
        "Lua-String erwartet"
      );
    }

    this.cursor.advance();

    let result = "";

    while (this.cursor.hasMore()) {
      const character =
        this.cursor.current();

      this.cursor.advance();

      if (character === quote) {
        return result;
      }

      if (character !== "\\") {
        result += character;
        continue;
      }

      result +=
        this.parseEscape();
    }

    this.cursor.fail(
      "Lua-String wurde nicht geschlossen"
    );
  }

  private parseEscape(): string {
    if (!this.cursor.hasMore()) {
      this.cursor.fail(
        "Unvollständige Escape-Sequenz"
      );
    }

    const escaped =
      this.cursor.current();

    this.cursor.advance();

    const simple:
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
      simple[escaped];

    if (simpleValue !== undefined) {
      return simpleValue;
    }

    if (escaped === "z") {
      while (
        this.cursor.hasMore() &&
        /\s/u.test(
          this.cursor.current()
        )
      ) {
        this.cursor.advance();
      }

      return "";
    }

    if (escaped === "x") {
      return this.parseHexEscape();
    }

    if (/\d/u.test(escaped)) {
      return this.parseDecimalEscape(
        escaped
      );
    }

    return escaped;
  }

  private parseHexEscape(): string {
    let raw = "";

    for (let index = 0; index < 2; index += 1) {
      const character =
        this.cursor.current();

      if (
        !/[0-9A-Fa-f]/u.test(
          character
        )
      ) {
        this.cursor.fail(
          "Ungültige Hex-Escape-Sequenz"
        );
      }

      raw += character;

      this.cursor.advance();
    }

    return String.fromCharCode(
      Number.parseInt(
        raw,
        16
      )
    );
  }

  private parseDecimalEscape(
    firstDigit: string
  ): string {
    let digits = firstDigit;

    while (
      digits.length < 3 &&
      this.cursor.hasMore() &&
      /\d/u.test(
        this.cursor.current()
      )
    ) {
      digits +=
        this.cursor.current();

      this.cursor.advance();
    }

    return String.fromCharCode(
      Number.parseInt(
        digits,
        10
      )
    );
  }
}