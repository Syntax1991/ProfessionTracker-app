import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile =
  fileURLToPath(
    import.meta.url
  );

export const projectRoot =
  path.resolve(
    path.dirname(
      currentFile
    ),
    ".."
  );

export const services = [
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

export const managedPorts =
  new Set(
    services.map(
      (service) =>
        service.port
    )
  );