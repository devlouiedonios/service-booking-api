import { z } from "zod";

export const refreshRequestSchema = z.object({
  refreshToken: z
    .string({
      error: "Refresh token is required.",
    })
    .min(1, {
      message: "Refresh token is required.",
    }),
});
