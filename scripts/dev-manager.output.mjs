export function writeInfo(
  message = ""
) {
  process.stdout.write(
    `${message}\n`
  );
}

export function writeError(
  message
) {
  process.stderr.write(
    `${message}\n`
  );
}

export function createPrefixedWriter(
  serviceName,
  output
) {
  let buffer = "";

  function writeLine(
    line
  ) {
    output.write(
      `[${serviceName}] ${line}\n`
    );
  }

  return {
    write(chunk) {
      buffer +=
        chunk.toString();

      const lines =
        buffer.split(
          /\r?\n/u
        );

      buffer =
        lines.pop() ??
        "";

      for (
        const line of
        lines
      ) {
        writeLine(
          line
        );
      }
    },

    flush() {
      if (!buffer) {
        return;
      }

      writeLine(
        buffer
      );

      buffer = "";
    }
  };
}