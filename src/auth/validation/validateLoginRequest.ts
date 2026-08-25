import { createValidationMiddleware } from "./createValidationMiddleware";
import { loginRequestSchema } from "./LoginRequestSchema";

export const validateLoginRequest =
  createValidationMiddleware(loginRequestSchema);
