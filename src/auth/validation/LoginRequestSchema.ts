import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z.email({
    error: (issue) => {
      if (issue.input === undefined) {
        return "Email is required.";
      }

      return "Email must be a valid email address.";
    },
  }),
  password: z
    .string({
      error: "Password is required.",
    })
    .min(1, {
      message: "Password is required.",
    }),
});
