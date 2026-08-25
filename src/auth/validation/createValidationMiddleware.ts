import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export function createValidationMiddleware(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.reduce<{ field: string; message: string }[]>(
          (accumulator, issue) => {
            const field = issue.path.join(".");
            if (accumulator.some((error) => error.field === field)) {
              return accumulator;
            }
            accumulator.push({
              field: field,
              message: issue.message,
            });
            return accumulator;
          },
          [],
        ),
      });
      return;
    }
    next();
  };
}
