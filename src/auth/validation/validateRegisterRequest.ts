import { createValidationMiddleware } from "./createValidationMiddleware";
import { registerRequestSchema } from "./RegisterRequestSchema";

export const validateRegisterRequest = createValidationMiddleware(
  registerRequestSchema,
);
