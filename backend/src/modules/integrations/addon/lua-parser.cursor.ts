export class LuaParserCursor {
  private index = 0;

  constructor(
    private readonly source: string
  ) {}

  current(): string {
    return this.source[this.index] ?? "";
  }

  hasMore(): boolean {
    return this.index < this.source.length;
  }

  position(): number {
    return this.index;
  }

  setPosition(position: number): void {
    this.index = position;
  }

  startsWith(value: string): boolean {
    return this.source.startsWith(
      value,
      this.index
    );
  }

  advance(amount = 1): void {
    this.index += amount;
  }

  skipIgnored(): void {
    while (this.hasMore()) {
      if (/\s/u.test(this.current())) {
        this.advance();
        continue;
      }

      if (this.startsWith("--[[")) {
        this.skipBlockComment();
        continue;
      }

      if (this.startsWith("--")) {
        this.skipLineComment();
        continue;
      }

      break;
    }
  }

  expect(expected: string): void {
    this.skipIgnored();

    if (!this.startsWith(expected)) {
      this.fail(
        `"${expected}" erwartet`
      );
    }

    this.advance(expected.length);
  }

  parseIdentifier(): string {
    this.skipIgnored();

    const match =
      this.source
        .slice(this.index)
        .match(
          /^[A-Za-z_][A-Za-z0-9_]*/u
        );

    if (!match) {
      this.fail(
        "Lua-Bezeichner erwartet"
      );
    }

    const value = match[0];

    this.advance(value.length);

    return value;
  }

  parseNumber(): number {
    this.skipIgnored();

    const match =
      this.source
        .slice(this.index)
        .match(
          /^[+-]?(?:\d+\.\d*|\.\d+|\d+)(?:[eE][+-]?\d+)?/u
        );

    if (!match) {
      this.fail(
        "Ungültige Lua-Zahl"
      );
    }

    const raw = match[0];
    const value = Number(raw);

    if (!Number.isFinite(value)) {
      this.fail(
        "Lua-Zahl ist nicht endlich"
      );
    }

    this.advance(raw.length);

    return value;
  }

  fail(message: string): never {
    throw new Error(
      `${message} bei Zeichen ${this.index}.`
    );
  }

  private skipLineComment(): void {
    const lineEnd =
      this.source.indexOf(
        "\n",
        this.index + 2
      );

    if (lineEnd < 0) {
      this.index = this.source.length;
      return;
    }

    this.index = lineEnd + 1;
  }

  private skipBlockComment(): void {
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

    this.index = commentEnd + 2;
  }
}