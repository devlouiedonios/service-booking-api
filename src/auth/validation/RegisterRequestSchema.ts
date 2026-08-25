import { z } from "zod";

export const registerRequestSchema = z.object({
  name: z
    .string({
      error: "Name is required.",
    })
    .min(1, {
      message: "Name is required.",
    }),
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
    .trim()
    .min(1, {
      error: "Password is required.",
    })
    .min(8, {
      message: "Password must be at least 8 characters.",
    }),
});
