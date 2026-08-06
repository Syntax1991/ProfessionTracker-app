import type {
  ErrorRequestHandler
} from "express";
import { ZodError } from "zod";
import { AppError } from "../shared/errors/AppError.js";

export const errorMiddleware:
  ErrorRequestHandler = (
    error: unknown,
    _request,
    response,
    _next
  ) => {
    if (error instanceof AppError) {
      response
        .status(error.statusCode)
        .json({
          error: error.message,
          details: error.details
        });

      return;
    }

    if (error instanceof ZodError) {
      response.status(400).json({
        error:
          "Die übermittelten Daten sind ungültig.",
        details: error.flatten()
      });

      return;
    }

    console.error(error);

    response.status(500).json({
      error:
        "Ein interner Serverfehler ist aufgetreten."
    });
  };