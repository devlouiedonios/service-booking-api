import { NextFunction, Request, Response } from "express";
import { createValidationMiddleware } from "./createValidationMiddleware";
import { refreshRequestSchema } from "./RefreshRequestSchema";
import { ClientPlatform } from "../../common/ClientPlatform";

const validateRefreshRequestSchema =
  createValidationMiddleware(refreshRequestSchema);

export function validateRefreshRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const platform = req.header("X-Client-Platform");

  if (platform === ClientPlatform.WEB) {
    next();
    return;
  }

  validateRefreshRequestSchema(req, res, next);
}
