import { NextFunction, Request, Response } from "express";
import { ConflictError } from "../errors/ConflictError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { PaginationValidationError } from "../errors/PaginationValidationError";
import { SortValidationError } from "../errors/SortValidationError";
import { NotFoundError } from "../errors/NotFoundError";
import { BookingStatusValidationError } from "../errors/BookingStatusValidationError";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof ConflictError) {
    res.status(409).json({
      message: error.message,
    });

    return;
  }

  if (error instanceof UnauthorizedError) {
    res.status(401).json({
      message: error.message,
    });

    return;
  }

  if (
    error instanceof PaginationValidationError ||
    error instanceof SortValidationError ||
    error instanceof BookingStatusValidationError
  ) {
    res.status(400).json({
      message: error.message,
    });

    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    message: "An unexpected error occured.",
  });
}
