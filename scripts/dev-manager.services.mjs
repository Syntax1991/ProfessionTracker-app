import {
  spawn
} from "node:child_process";
import process from "node:process";
import {
  createPrefixedWriter
} from "./dev-manager.output.mjs";
import {
  delay,
  killProcessTree
} from "./dev-manager.processes.mjs";

const runningChildren = [];

export function startService(
  service
) {
  const stdoutWriter =
    createPrefixedWriter(
      service.name,
      process.stdout
    );

  const stderrWriter =
    createPrefixedWriter(
      service.name,
      process.stderr
    );

  const commandProcessor =
    process.env.ComSpec ||
    "cmd.exe";

  const child =
    spawn(
      commandProcessor,
      [
        "/d",
        "/s",
        "/c",
        "npm.cmd run dev"
      ],
      {
        cwd: service.directory,
        env: {
          ...process.env,
          FORCE_COLOR: "1"
        },
        stdio: [
          "ignore",
          "pipe",
          "pipe"
        ],
        windowsHide: true
      }
    );

  const exitPromise =
    new Promise(
      (resolve) => {
        let resolved = false;

        function resolveOnce(
          result
        ) {
          if (resolved) {
            return;
          }

          resolved = true;

          resolve(
            result
          );
        }

        child.once(
          "error",
          (error) => {
            stderrWriter.flush();

            resolveOnce({
              service:
                service.name,
              code: 1,
              signal: null,
              error
            });
          }
        );

        child.once(
          "exit",
          (
            code,
            signal
          ) => {
            stdoutWriter.flush();
            stderrWriter.flush();

            resolveOnce({
              service:
                service.name,
              code,
              signal,
              error: null
            });
          }
        );
      }
    );

  child.stdout.on(
    "data",
    (chunk) => {
      stdoutWriter.write(
        chunk
      );
    }
  );

  child.stderr.on(
    "data",
    (chunk) => {
      stderrWriter.write(
        chunk
      );
    }
  );

  runningChildren.push({
    name:
      service.name,
    child
  });

  return {
    service,
    child,
    exitPromise
  };
}

export async function terminateStartedChildren() {
  for (
    const entry of
    runningChildren
  ) {
    if (
      entry.child.pid &&
      entry.child.exitCode === null
    ) {
      killProcessTree(
        entry.child.pid
      );
    }
  }

  await delay(
    250
  );
}