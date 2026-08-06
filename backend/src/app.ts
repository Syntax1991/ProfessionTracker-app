import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import { apiRouter } from "./routes/apiRouter.js";

export const app =
  express();

app.disable(
  "x-powered-by"
);

app.use(helmet());

app.use(
  cors({
    origin:
      env.FRONTEND_ORIGIN
        .split(",")
        .map(
          (origin) =>
            origin.trim()
        )
  })
);

app.use(express.json());

app.use(
  "/api",
  apiRouter
);

app.use(
  notFoundMiddleware
);

app.use(
  errorMiddleware
);