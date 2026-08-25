import { Router } from "express";
import {
  BookingController,
  GetBookingParams,
  UpdateBookingStatusParams,
} from "./BookingController";
import { AuthenticationMiddleware } from "../../common/authentication/AuthenticationMiddleware";

export function createBookingRoutes(
  controller: BookingController,
  authenticationMiddleware: AuthenticationMiddleware,
): Router {
  const router = Router();

  router.get(
    "/",
    authenticationMiddleware.authenticate.bind(authenticationMiddleware),
    (request, response) => controller.getBookings(request, response),
  );

  router.get<GetBookingParams>(
    "/:id",
    authenticationMiddleware.authenticate.bind(authenticationMiddleware),
    (request, response) => controller.getBooking(request, response),
  );

  router.patch<UpdateBookingStatusParams>(
    "/:id/status",
    authenticationMiddleware.authenticate.bind(authenticationMiddleware),
    (request, response) => controller.updateBookingStatus(request, response),
  );

  return router;
}
