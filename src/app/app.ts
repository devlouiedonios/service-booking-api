import express from "express";
import cookieParser from "cookie-parser";
import { createAuthModule } from "../auth/AuthModule";
import { AppDependencies } from "./appDependencies";
import { errorHandler } from "../common/http/errorHandler";
import cors from "cors";
import { env } from "../config/env";
import { createBookingModule } from "../bookings/BookingModule";

export function createApp(dependencies: AppDependencies) {
  const app = express();

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser());

  app.use("/auth", createAuthModule(dependencies.auth));
  app.use("/bookings", createBookingModule(dependencies.bookings));

  app.use(errorHandler);

  return app;
}
