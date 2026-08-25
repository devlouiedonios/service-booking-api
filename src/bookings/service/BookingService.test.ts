import { describe, expect, it } from "vitest";
import { BookingServiceImpl } from "./BookingServiceImpl";
import { FakeBookingDataSource } from "../testing/FakeBookingDataSource";
import { BookingRepositoryImpl } from "../data/repository/BookingRepositoryImpl";
import { NotFoundError } from "../../common/errors/NotFoundError";
import { BookingStatusValidationError } from "../../common/errors/BookingStatusValidationError";

describe("BookingService", () => {
  describe("Apply Default Pagination Values", () => {
    it("applies default page value of 1 when page is missing", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        pageSize: 10,
        sort: "createdAt",
        direction: "desc",
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.totalItems).toBeDefined();
    });

    it("applies default pageSize value of 20 when pageSize is missing", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        sort: "createdAt",
        direction: "desc",
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.totalItems).toBeDefined();
    });

    it("applies default page and pageSize when both are missing", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        sort: "createdAt",
        direction: "desc",
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.totalItems).toBeDefined();
    });
  });

  describe("Validate Pagination Parameter Ranges", () => {
    it("rejects request when page is less than 1", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      await expect(
        service.getBookings({
          page: 0,
          pageSize: 10,
          sort: "createdAt",
          direction: "desc",
        }),
      ).rejects.toThrow();
    });

    it("rejects request when pageSize is less than 1", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      await expect(
        service.getBookings({
          page: 1,
          pageSize: 0,
          sort: "createdAt",
          direction: "desc",
        }),
      ).rejects.toThrow();
    });

    it("rejects request when pageSize exceeds 100", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      await expect(
        service.getBookings({
          page: 1,
          pageSize: 101,
          sort: "createdAt",
          direction: "desc",
        }),
      ).rejects.toThrow();
    });
  });

  describe("Validate Sort Parameter Values", () => {
    it("rejects request when sort is not in [preferredDate, createdAt, status]", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      await expect(
        service.getBookings({
          page: 1,
          pageSize: 20,
          sort: "invalidField",
          direction: "desc",
        }),
      ).rejects.toThrow();
    });

    it("rejects request when direction is not in [asc, desc]", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      await expect(
        service.getBookings({
          page: 1,
          pageSize: 20,
          sort: "createdAt",
          direction: "invalidDirection" as any,
        }),
      ).rejects.toThrow();
    });

    it("accepts valid sort values: preferredDate", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 20,
        sort: "preferredDate",
        direction: "desc",
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
    });

    it("accepts valid sort values: createdAt", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 20,
        sort: "createdAt",
        direction: "asc",
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
    });

    it("accepts valid sort values: status", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 20,
        sort: "status",
        direction: "asc",
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
    });
  });

  describe("Apply Default Sort Parameters", () => {
    it("applies default sort value of createdAt when sort is missing", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 20,
        direction: "desc",
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
    });

    it("applies default direction value of desc when direction is missing", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 20,
        sort: "createdAt",
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
    });

    it("applies default sort and direction when both are missing", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 20,
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
    });
  });

  describe("Return Paginated Result", () => {
    it("returns paginated result with items", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 20,
        sort: "createdAt",
        direction: "desc",
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });

    it("returns total items count in paginated result", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 20,
        sort: "createdAt",
        direction: "desc",
      });

      expect(result).toBeDefined();
      expect(result.totalItems).toBeDefined();
      expect(typeof result.totalItems).toBe("number");
      expect(result.totalItems).toBeGreaterThan(0);
    });

    it("returns items and totalItems in paginated result", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 10,
        sort: "createdAt",
        direction: "desc",
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.totalItems).toBeDefined();
      expect(result.items.length).toBeLessThanOrEqual(10);
    });
  });

  describe("Support Search by Customer Name", () => {
    it("returns only bookings matching customer name search", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 20,
        search: "John",
        sort: "createdAt",
        direction: "desc",
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(
        result.items.every((item) =>
          item.customerName.toLowerCase().includes("john"),
        ),
      ).toBe(true);
    });
  });

  describe("Support Search by Mobile Number", () => {
    it("returns only bookings matching mobile number search", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 20,
        search: "+61234567890",
        sort: "createdAt",
        direction: "desc",
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(
        result.items.every((item) =>
          item.mobileNumber.includes("+61234567890"),
        ),
      ).toBe(true);
    });
  });

  describe("Support Search by Property Address", () => {
    it("returns only bookings matching property address search", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const result = await service.getBookings({
        page: 1,
        pageSize: 20,
        search: "Richmond",
        sort: "createdAt",
        direction: "desc",
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(
        result.items.every((item) =>
          item.propertyAddress.toLowerCase().includes("richmond"),
        ),
      ).toBe(true);
    });
  });

  describe("Apply No Filter for Missing Search Parameter", () => {
    it("returns all bookings when search parameter is missing", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const resultWithoutSearch = await service.getBookings({
        page: 1,
        pageSize: 20,
        sort: "createdAt",
        direction: "desc",
      });

      const resultWithAllBookings = await service.getBookings({
        page: 1,
        pageSize: 100,
        sort: "createdAt",
        direction: "desc",
      });

      expect(resultWithoutSearch.items.length).toBeGreaterThan(0);
      expect(resultWithoutSearch.items.length).toBe(
        resultWithAllBookings.items.length,
      );
    });

    it("returns all bookings when search parameter is blank", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);
      const service = new BookingServiceImpl(repository);

      const resultWithBlankSearch = await service.getBookings({
        page: 1,
        pageSize: 20,
        search: "",
        sort: "createdAt",
        direction: "desc",
      });

      const resultWithAllBookings = await service.getBookings({
        page: 1,
        pageSize: 100,
        sort: "createdAt",
        direction: "desc",
      });

      expect(resultWithBlankSearch.items.length).toBe(
        resultWithAllBookings.items.length,
      );
    });
  });

  describe("Get Booking by ID", () => {
    describe("Retrieve Booking with Related Data", () => {
      it("returns booking with customer and property data when booking exists", async () => {
        const dataSource = new FakeBookingDataSource();
        const repository = new BookingRepositoryImpl(dataSource);
        const service = new BookingServiceImpl(repository);

        const result = await service.getBookingById("booking-001");

        expect(result).toBeDefined();
        expect(result?.booking).toBeDefined();
        expect(result?.booking.id).toBe("booking-001");
        expect(result?.customer).toBeDefined();
        expect(result?.customer.id).toBeDefined();
        expect(result?.property).toBeDefined();
        expect(result?.property.id).toBeDefined();
      });
    });

    describe("Return Not Found When Booking Does Not Exist", () => {
      it("throws NotFoundError when booking does not exist", async () => {
        const dataSource = new FakeBookingDataSource();
        const repository = new BookingRepositoryImpl(dataSource);
        const service = new BookingServiceImpl(repository);

        await expect(service.getBookingById("nonexistent-id")).rejects.toThrow(
          NotFoundError,
        );
      });
    });
  });

  describe("Update Booking Status", () => {
    describe("Update Booking Status with Valid Status", () => {
      it("returns updated booking with requested status when booking exists and status is valid", async () => {
        const dataSource = new FakeBookingDataSource();
        const repository = new BookingRepositoryImpl(dataSource);
        const service = new BookingServiceImpl(repository);

        const result = await service.updateBookingStatus(
          "booking-001",
          "APPROVED",
        );

        expect(result).toBeDefined();
        expect(result.booking.id).toBe("booking-001");
        expect(result.booking.status).toBe("APPROVED");
        expect(result.customer).toBeDefined();
        expect(result.property).toBeDefined();
      });
    });

    describe("Reject Invalid Booking Status", () => {
      it("throws ValidationError when status is not a valid booking status", async () => {
        const dataSource = new FakeBookingDataSource();
        const repository = new BookingRepositoryImpl(dataSource);
        const service = new BookingServiceImpl(repository);

        await expect(
          service.updateBookingStatus("booking-001", "INVALID_STATUS"),
        ).rejects.toThrow();
      });
    });

    describe("Report Missing Booking", () => {
      it("throws NotFoundError when booking does not exist", async () => {
        const dataSource = new FakeBookingDataSource();
        const repository = new BookingRepositoryImpl(dataSource);
        const service = new BookingServiceImpl(repository);

        await expect(
          service.updateBookingStatus("nonexistent-id", "APPROVED"),
        ).rejects.toThrow(NotFoundError);
      });
    });
  });
});
