import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import {
  BookingController,
  GetBookingParams,
  UpdateBookingStatusParams,
} from "./BookingController";
import { FakeBookingService } from "../testing/FakeBookingService";
import { BookingServiceImpl } from "../service/BookingServiceImpl";
import { BookingRepositoryImpl } from "../data/repository/BookingRepositoryImpl";
import { FakeBookingDataSource } from "../testing/FakeBookingDataSource";

describe("BookingController", () => {
  it("returns 200 OK with paginated bookings list when valid query parameters are provided", async () => {
    const request = createGetBookingsRequest();
    const response = createResponse();
    const { bookingController } = createBookingController();

    await bookingController.getBookings(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalled();

    const responseBody = (response.json as any).mock.calls[0][0];
    expect(responseBody).toHaveProperty("bookings");
    expect(responseBody).toHaveProperty("pagination");
    expect(responseBody.pagination).toHaveProperty("page");
    expect(responseBody.pagination).toHaveProperty("pageSize");
    expect(responseBody.pagination).toHaveProperty("totalItems");
    expect(responseBody.pagination).toHaveProperty("totalPages");
    expect(Array.isArray(responseBody.bookings)).toBe(true);
  });

  describe("Return Empty Bookings List", () => {
    it("returns 200 OK with empty bookings list when no bookings match search criteria", async () => {
      const request = createGetBookingsRequest({
        search: "nonexistent",
      });
      const response = createResponse();

      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const bookingService = new BookingServiceImpl(repository);
      const bookingController = new BookingController(bookingService);

      await bookingController.getBookings(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalled();

      const responseBody = (response.json as any).mock.calls[0][0];
      expect(responseBody.bookings).toBeDefined();
      expect(Array.isArray(responseBody.bookings)).toBe(true);
      expect(responseBody.bookings.length).toBe(0);
      expect(responseBody.pagination.totalItems).toBe(0);
    });
  });

  describe("Get Booking by ID", () => {
    describe("Return Booking Details", () => {
      it("returns 200 OK with booking details when booking exists", async () => {
        const request = createGetBookingRequest("booking-001");
        const response = createResponse();
        const { bookingController } = createBookingController();

        await bookingController.getBooking(request, response);

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalled();

        const responseBody = (response.json as any).mock.calls[0][0];
        expect(responseBody).toHaveProperty("booking");
        expect(responseBody).toHaveProperty("customer");
        expect(responseBody).toHaveProperty("property");
        expect(responseBody.booking.id).toBe("booking-001");
        expect(responseBody.booking).toHaveProperty("service");
        expect(responseBody.booking).toHaveProperty("preferredDate");
        expect(responseBody.booking).toHaveProperty("preferredTime");
        expect(responseBody.booking).toHaveProperty("status");
        expect(responseBody.customer).toHaveProperty("id");
        expect(responseBody.customer).toHaveProperty("name");
        expect(responseBody.customer).toHaveProperty("mobileNumber");
        expect(responseBody.property).toHaveProperty("id");
        expect(responseBody.property).toHaveProperty("type");
        expect(responseBody.property).toHaveProperty("address");
      });

      it("property response should not include customerId", async () => {
        const request = createGetBookingRequest("booking-001");
        const response = createResponse();

        const dataSource = new FakeBookingDataSource();
        const repository = new BookingRepositoryImpl(dataSource);
        const bookingService = new BookingServiceImpl(repository);
        const bookingController = new BookingController(bookingService);

        await bookingController.getBooking(request, response);

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalled();

        const responseBody = (response.json as any).mock.calls[0][0];
        expect(responseBody.property).not.toHaveProperty("customerId");
      });
    });
  });

  describe("Update Booking Status", () => {
    describe("Return Updated Booking", () => {
      it("returns 200 OK with updated booking when valid status is provided", async () => {
        const request = createUpdateBookingStatusRequest("booking-001", {
          status: "APPROVED",
        });
        const response = createResponse();
        const { bookingController } = createBookingController();

        await bookingController.updateBookingStatus(request, response);

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalled();

        const responseBody = (response.json as any).mock.calls[0][0];
        expect(responseBody).toHaveProperty("booking");
        expect(responseBody).toHaveProperty("customer");
        expect(responseBody).toHaveProperty("property");
        expect(responseBody.booking.id).toBe("booking-001");
        expect(responseBody.booking).toHaveProperty("service");
        expect(responseBody.booking).toHaveProperty("preferredDate");
        expect(responseBody.booking).toHaveProperty("preferredTime");
        expect(responseBody.booking).toHaveProperty("status");
        expect(responseBody.booking.status).toBe("APPROVED");
        expect(responseBody.customer).toHaveProperty("id");
        expect(responseBody.customer).toHaveProperty("name");
        expect(responseBody.customer).toHaveProperty("mobileNumber");
        expect(responseBody.property).toHaveProperty("id");
        expect(responseBody.property).toHaveProperty("type");
        expect(responseBody.property).toHaveProperty("address");
      });
    });
  });
});

function createBookingController() {
  const bookingService = new FakeBookingService();
  return {
    bookingController: new BookingController(bookingService),
    bookingService,
  };
}

function createGetBookingsRequest(
  overrides?: Partial<Request["query"]>,
): Request {
  return {
    query: {
      page: "1",
      pageSize: "20",
      search: "",
      sort: "createdAt",
      direction: "desc",
      ...overrides,
    },
    header: vi.fn().mockReturnValue("web"),
  } as unknown as Request;
}

function createGetBookingRequest(id: string): Request<GetBookingParams> {
  return {
    params: {
      id,
    },
    header: vi.fn().mockReturnValue("web"),
  } as unknown as Request<GetBookingParams>;
}

function createResponse(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;
}

function createUpdateBookingStatusRequest(
  id: string,
  body: any,
): Request<UpdateBookingStatusParams> {
  return {
    params: {
      id,
    },
    body,
    header: vi.fn().mockReturnValue("web"),
  } as unknown as Request<UpdateBookingStatusParams>;
}
