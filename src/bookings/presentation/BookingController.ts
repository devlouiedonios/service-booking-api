import { Request, Response } from "express";
import { IBookingService } from "../service/BookingService";
import { GetBookingsResponse } from "./response/GetBookingsResponse";
import { GetBookingResponse } from "./response/GetBookingResponse";

export type GetBookingParams = {
  id: string;
};

export type UpdateBookingStatusParams = {
  id: string;
};

export class BookingController {
  constructor(private bookingService: IBookingService) {}

  async getBookings(request: Request, response: Response): Promise<void> {
    const page =
      request.query.page !== undefined
        ? parseInt(request.query.page as string)
        : 1;
    const pageSize =
      request.query.pageSize !== undefined
        ? parseInt(request.query.pageSize as string)
        : 20;
    const search = (request.query.search as string) || "";
    const sort = (request.query.sort as string) || "createdAt";
    const direction = (request.query.direction as string) || "desc";

    const result = await this.bookingService.getBookings({
      page,
      pageSize,
      search,
      sort,
      direction,
    });

    const totalPages = Math.ceil(result.totalItems / pageSize);

    const bookingsResponse: GetBookingsResponse = {
      bookings: result.items,
      pagination: {
        page,
        pageSize,
        totalItems: result.totalItems,
        totalPages,
      },
    };

    response.status(200).json(bookingsResponse);
  }

  async getBooking(
    request: Request<GetBookingParams>,
    response: Response,
  ): Promise<void> {
    const id = request.params.id;

    const result = await this.bookingService.getBookingById(id);

    const bookingResponse: GetBookingResponse = {
      booking: result.booking,
      customer: result.customer,
      property: {
        id: result.property.id,
        type: result.property.type,
        address: result.property.address,
      },
    };

    response.status(200).json(bookingResponse);
  }

  async updateBookingStatus(
    request: Request<UpdateBookingStatusParams>,
    response: Response,
  ): Promise<void> {
    const id = request.params.id;
    const { status } = request.body;

    const result = await this.bookingService.updateBookingStatus(id, status);

    const bookingResponse: GetBookingResponse = {
      booking: result.booking,
      customer: result.customer,
      property: {
        id: result.property.id,
        type: result.property.type,
        address: result.property.address,
      },
    };

    response.status(200).json(bookingResponse);
  }
}
