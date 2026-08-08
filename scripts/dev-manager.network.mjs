import net from "node:net";
import {
  writeInfo
} from "./dev-manager.output.mjs";
import {
  delay
} from "./dev-manager.processes.mjs";

function isPortReachable(
  port
) {
  return new Promise(
    (resolve) => {
      const socket =
        net.createConnection({
          host: "127.0.0.1",
          port
        });

      let completed = false;

      function finish(
        reachable
      ) {
        if (completed) {
          return;
        }

        completed = true;

        socket.removeAllListeners();
        socket.destroy();

        resolve(
          reachable
        );
      }

      socket.setTimeout(
        500
      );

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

export async function waitForPort(
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
      await isPortReachable(
        port
      )
    ) {
      writeInfo(
        `[${serviceName}] Port ${port} ist erreichbar.`
      );

      return;
    }

    await delay(
      250
    );
  }

  throw new Error(
    `${serviceName} wurde nicht innerhalb von ${timeoutMilliseconds / 1000} Sekunden auf Port ${port} erreichbar.`
  );
}