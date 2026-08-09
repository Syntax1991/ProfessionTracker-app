import process from "node:process";
import {
  services
} from "./dev-manager.config.mjs";
import {
  writeError,
  writeInfo
} from "./dev-manager.output.mjs";
import {
  getListeningProcessIds,
  stopManagedServers
} from "./dev-manager.processes.mjs";
import {
  waitForPort
} from "./dev-manager.network.mjs";
import {
  startService,
  terminateStartedChildren
} from "./dev-manager.services.mjs";

let isShuttingDown = false;

async function shutdown(
  exitCode = 0
) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  writeInfo();
  writeInfo(
    "Beende SynTrack …"
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

  process.exit(
    exitCode
  );
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
    "Starte SynTrack …"
  );

  const startedServices =
    services.map(
      startService
    );

  await Promise.all(
    startedServices.map(
      ({
        service
      }) =>
        waitForPort(
          service.port,
          service.name
        )
    )
  );

  writeInfo();
  writeInfo(
    "SynTrack läuft:"
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
        ({
          exitPromise
        }) =>
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