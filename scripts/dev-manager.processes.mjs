import {
  spawnSync
} from "node:child_process";
import { managedPorts } from "./dev-manager.config.mjs";
import {
  writeInfo
} from "./dev-manager.output.mjs";

export function delay(
  milliseconds
) {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}

function parsePort(
  address
) {
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

  return Number.isInteger(
    port
  )
    ? port
    : null;
}

export function getListeningProcessIds() {
  const result =
    spawnSync(
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
    result.stdout.split(
      /\r?\n/u
    )
  ) {
    const columns =
      line.trim().split(
        /\s+/u
      );

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
      !managedPorts.has(
        port
      )
    ) {
      continue;
    }

    const processId =
      Number.parseInt(
        processIdValue,
        10
      );

    if (
      Number.isInteger(
        processId
      ) &&
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

export function killProcessTree(
  processId,
  showOutput = false
) {
  if (
    !Number.isInteger(
      processId
    ) ||
    processId <= 0
  ) {
    return;
  }

  const result =
    spawnSync(
      "taskkill.exe",
      [
        "/PID",
        String(
          processId
        ),
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

export async function waitForPortsToClose(
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

    await delay(
      150
    );
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

export async function stopManagedServers() {
  const processIds =
    getListeningProcessIds();

  if (
    processIds.length === 0
  ) {
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