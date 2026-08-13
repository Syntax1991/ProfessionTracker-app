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
    name: "api",
    port: 4000,
    directory:
      path.join(
        projectRoot,
        "apps",
        "api"
      )
  },
  {
    name: "web",
    port: 5173,
    directory:
      path.join(
        projectRoot,
        "apps",
        "web"
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
