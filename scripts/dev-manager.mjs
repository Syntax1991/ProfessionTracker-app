import {
  spawn,
  spawnSync
} from "node:child_process";
import { fileURLToPath } from "node:url";
import net from "node:net";
import path from "node:path";
import process from "node:process";

const currentFile =
  fileURLToPath(import.meta.url);

const projectRoot =
  path.resolve(
    path.dirname(currentFile),
    ".."
  );

const services = [
  {
    name: "backend",
    port: 4000,
    directory:
      path.join(
        projectRoot,
        "backend"
      )
  },
  {
    name: "frontend",
    port: 5173,
    directory:
      path.join(
        projectRoot,
        "frontend"
      )
  }
];

const managedPorts =
  new Set(
    services.map(
      (service) =>
        service.port
    )
  );

const runningChildren = [];

let isShuttingDown = false;

function writeInfo(message = "") {
  process.stdout.write(
    `${message}\n`
  );
}

function writeError(message) {
  process.stderr.write(
    `${message}\n`
  );
}

function delay(milliseconds) {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}

function parsePort(address) {
  const match =
    address.match(
      /:(\d+)$/u
    );

  if (!match) {
    return null;
  }

  const port =
    Number.parseInt(
      match[1],
      10
    );

  return Number.isInteger(port)
    ? port
    : null;
}

function getListeningProcessIds() {
  const result = spawnSync(
    "netstat.exe",
    [
      "-ano",
      "-p",
      "tcp"
    ],
    {
      encoding: "utf8",
      windowsHide: true
    }
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      result.stderr.trim() ||
        "netstat.exe konnte nicht ausgeführt werden."
    );
  }

  const processIds =
    new Set();

  for (
    const line of
    result.stdout.split(/\r?\n/u)
  ) {
    const columns =
      line.trim().split(/\s+/u);

    if (
      columns.length < 4 ||
      columns[0]?.toUpperCase() !==
        "TCP"
    ) {
      continue;
    }

    const localAddress =
      columns[1];

    const processIdValue =
      columns.at(-1);

    if (
      !localAddress ||
      !processIdValue
    ) {
      continue;
    }

    const port =
      parsePort(
        localAddress
      );

    if (
      port === null ||
      !managedPorts.has(port)
    ) {
      continue;
    }

    const processId =
      Number.parseInt(
        processIdValue,
        10
      );

    if (
      Number.isInteger(processId) &&
      processId > 0
    ) {
      processIds.add(
        processId
      );
    }
  }

  return [
    ...processIds
  ];
}

function killProcessTree(
  processId,
  showOutput = false
) {
  if (
    !Number.isInteger(processId) ||
    processId <= 0
  ) {
    return;
  }

  const result = spawnSync(
    "taskkill.exe",
    [
      "/PID",
      String(processId),
      "/T",
      "/F"
    ],
    {
      encoding: "utf8",
      windowsHide: true
    }
  );

  if (
    showOutput &&
    result.status === 0
  ) {
    writeInfo(
      `Prozessbaum ${processId} wurde beendet.`
    );
  }
}

async function waitForPortsToClose(
  timeoutMilliseconds = 5000
) {
  const startedAt =
    Date.now();

  while (
    Date.now() - startedAt <
    timeoutMilliseconds
  ) {
    if (
      getListeningProcessIds()
        .length === 0
    ) {
      return;
    }

    await delay(150);
  }

  const remainingProcessIds =
    getListeningProcessIds();

  if (
    remainingProcessIds.length > 0
  ) {
    throw new Error(
      `Die Ports 4000 und 5173 konnten nicht freigegeben werden. Verbleibende Prozess-IDs: ${remainingProcessIds.join(", ")}`
    );
  }
}

async function stopManagedServers() {
  const processIds =
    getListeningProcessIds();

  if (processIds.length === 0) {
    writeInfo(
      "Keine laufenden Profession-Tracker-Server gefunden."
    );

    return;
  }

  writeInfo(
    "Beende Backend und Frontend auf Port 4000 und 5173 …"
  );

  for (
    const processId of
    processIds
  ) {
    killProcessTree(
      processId,
      true
    );
  }

  await waitForPortsToClose();

  writeInfo(
    "Backend und Frontend wurden beendet."
  );
}

function isPortReachable(port) {
  return new Promise(
    (resolve) => {
      const socket =
        net.createConnection({
          host: "127.0.0.1",
          port
        });

      let completed = false;

      function finish(reachable) {
        if (completed) {
          return;
        }

        completed = true;

        socket.removeAllListeners();
        socket.destroy();

        resolve(reachable);
      }

      socket.setTimeout(500);

      socket.once(
        "connect",
        () => finish(true)
      );

      socket.once(
        "timeout",
        () => finish(false)
      );

      socket.once(
        "error",
        () => finish(false)
      );
    }
  );
}

async function waitForPort(
  port,
  serviceName,
  timeoutMilliseconds = 20000
) {
  const startedAt =
    Date.now();

  while (
    Date.now() - startedAt <
    timeoutMilliseconds
  ) {
    if (
      await isPortReachable(port)
    ) {
      writeInfo(
        `[${serviceName}] Port ${port} ist erreichbar.`
      );

      return;
    }

    await delay(250);
  }

  throw new Error(
    `${serviceName} wurde nicht innerhalb von ${timeoutMilliseconds / 1000} Sekunden auf Port ${port} erreichbar.`
  );
}

function createPrefixedWriter(
  serviceName,
  output
) {
  let buffer = "";

  function writeLine(line) {
    output.write(
      `[${serviceName}] ${line}\n`
    );
  }

  return {
    write(chunk) {
      buffer +=
        chunk.toString();

      const lines =
        buffer.split(/\r?\n/u);

      buffer =
        lines.pop() ?? "";

      for (const line of lines) {
        writeLine(line);
      }
    },

    flush() {
      if (!buffer) {
        return;
      }

      writeLine(buffer);
      buffer = "";
    }
  };
}

function startService(service) {
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

  const child = spawn(
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

        function resolveOnce(result) {
          if (resolved) {
            return;
          }

          resolved = true;
          resolve(result);
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
          (code, signal) => {
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
      stdoutWriter.write(chunk);
    }
  );

  child.stderr.on(
    "data",
    (chunk) => {
      stderrWriter.write(chunk);
    }
  );

  runningChildren.push({
    name: service.name,
    child
  });

  return {
    service,
    child,
    exitPromise
  };
}

async function terminateStartedChildren() {
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

  await delay(250);
}

async function shutdown(
  exitCode = 0
) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  writeInfo();
  writeInfo(
    "Beende Profession Tracker …"
  );

  await terminateStartedChildren();

  try {
    await stopManagedServers();
  }
  catch (error) {
    writeError(
      error instanceof Error
        ? error.message
        : String(error)
    );
  }

  process.exit(exitCode);
}

async function startManagedServers() {
  const occupiedProcessIds =
    getListeningProcessIds();

  if (
    occupiedProcessIds.length > 0
  ) {
    throw new Error(
      `Port 4000 oder 5173 ist bereits belegt. Verwende npm run dev:restart. Prozess-IDs: ${occupiedProcessIds.join(", ")}`
    );
  }

  writeInfo(
    "Starte Profession Tracker …"
  );

  const startedServices =
    services.map(
      startService
    );

  await Promise.all(
    startedServices.map(
      ({ service }) =>
        waitForPort(
          service.port,
          service.name
        )
    )
  );

  writeInfo();
  writeInfo(
    "Profession Tracker läuft:"
  );

  writeInfo(
    "Frontend: http://localhost:5173"
  );

  writeInfo(
    "Backend:  http://localhost:4000"
  );

  writeInfo();
  writeInfo(
    "Mit Strg+C werden beide Server beendet."
  );

  const firstExit =
    await Promise.race(
      startedServices.map(
        ({ exitPromise }) =>
          exitPromise
      )
    );

  if (isShuttingDown) {
    return;
  }

  if (firstExit.error) {
    writeError(
      `${firstExit.service} konnte nicht gestartet werden: ${firstExit.error.message}`
    );
  }
  else {
    const exitDescription =
      firstExit.signal
        ? `Signal ${firstExit.signal}`
        : `Exit-Code ${firstExit.code ?? "unbekannt"}`;

    writeError(
      `${firstExit.service} wurde unerwartet beendet (${exitDescription}).`
    );
  }

  await shutdown(
    firstExit.code === 0
      ? 0
      : 1
  );
}

async function main() {
  const mode =
    process.argv[2] ??
    "start";

  if (mode === "stop") {
    await stopManagedServers();
    return;
  }

  if (mode === "restart") {
    await stopManagedServers();
    await startManagedServers();
    return;
  }

  if (mode === "start") {
    await startManagedServers();
    return;
  }

  throw new Error(
    `Unbekannter Modus "${mode}". Erlaubt sind start, restart und stop.`
  );
}

process.once(
  "SIGINT",
  () => {
    void shutdown(0);
  }
);

process.once(
  "SIGTERM",
  () => {
    void shutdown(0);
  }
);

main().catch(
  async (error) => {
    writeError(
      error instanceof Error
        ? error.message
        : String(error)
    );

    await terminateStartedChildren();

    process.exitCode = 1;
  }
);