import { Router } from "express";
import { BookingRepositoryImpl } from "./data/repository/BookingRepositoryImpl";
import { BookingServiceImpl } from "./service/BookingServiceImpl";
import { BookingController } from "./presentation/BookingController";
import { createBookingRoutes } from "./presentation/BookingRoutes";
import { BookingDataSource } from "./data/datasource/BookingDataSource";
import { AuthenticationMiddleware } from "../common/authentication/AuthenticationMiddleware";

export interface BookingModuleDependencies {
  bookingDataSource: BookingDataSource;
  authenticationMiddleware: AuthenticationMiddleware;
}

export function createBookingModule({
  bookingDataSource,
  authenticationMiddleware,
}: BookingModuleDependencies): Router {
  const bookingRepository = new BookingRepositoryImpl(bookingDataSource);
  const bookingService = new BookingServiceImpl(bookingRepository);
  const bookingController = new BookingController(bookingService);

  return createBookingRoutes(bookingController, authenticationMiddleware);
}
