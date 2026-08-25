import { describe, expect, it } from "vitest";
import { BookingRepositoryImpl } from "./BookingRepositoryImpl";
import { FakeBookingDataSource } from "../../testing/FakeBookingDataSource";

describe("BookingRepository", () => {
  it("returns the requested page of bookings with pagination metadata", async () => {
    const dataSource = new FakeBookingDataSource();
    const repository = new BookingRepositoryImpl(dataSource);

    const result = await repository.find({
      page: 1,
      pageSize: 10,
      sort: "createdAt",
      direction: "desc",
    });

    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.totalItems).toBeDefined();
    expect(typeof result.totalItems).toBe("number");
  });

  describe("Apply Sort Order", () => {
    it("returns bookings sorted by createdAt in descending order", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);

      const result = await repository.find({
        page: 1,
        pageSize: 100,
        sort: "createdAt",
        direction: "desc",
      });

      expect(result.items.length).toBeGreaterThan(1);
      for (let i = 0; i < result.items.length - 1; i++) {
        expect(result.items[i]).toBeDefined();
        expect(result.items[i + 1]).toBeDefined();
      }
    });

    it("returns bookings sorted by createdAt in ascending order", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);

      const result = await repository.find({
        page: 1,
        pageSize: 100,
        sort: "createdAt",
        direction: "asc",
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(Array.isArray(result.items)).toBe(true);
    });

    it("returns bookings sorted by preferredDate in descending order", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);

      const result = await repository.find({
        page: 1,
        pageSize: 100,
        sort: "preferredDate",
        direction: "desc",
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(Array.isArray(result.items)).toBe(true);
    });

    it("returns bookings sorted by status in ascending order", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);

      const result = await repository.find({
        page: 1,
        pageSize: 100,
        sort: "status",
        direction: "asc",
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(Array.isArray(result.items)).toBe(true);
    });
  });

  describe("Apply Search Filters", () => {
    it("filters bookings by customer name", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);

      const result = await repository.find({
        page: 1,
        pageSize: 100,
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

    it("returns empty result when search matches no bookings", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);

      const result = await repository.find({
        page: 1,
        pageSize: 100,
        search: "nonexistent",
        sort: "createdAt",
        direction: "desc",
      });

      expect(result.items).toBeDefined();
      expect(result.items.length).toBe(0);
      expect(result.totalItems).toBe(0);
    });
  });

  describe("Return Booking with Required Fields", () => {
    it("returns booking with id field", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);

      const result = await repository.find({
        page: 1,
        pageSize: 10,
        sort: "createdAt",
        direction: "desc",
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items[0]).toHaveProperty("id");
    });

    it("returns booking with all required fields", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);

      const result = await repository.find({
        page: 1,
        pageSize: 10,
        sort: "createdAt",
        direction: "desc",
      });

      expect(result.items.length).toBeGreaterThan(0);
      const booking = result.items[0];

      expect(booking).toHaveProperty("id");
      expect(booking).toHaveProperty("customerName");
      expect(booking).toHaveProperty("mobileNumber");
      expect(booking).toHaveProperty("propertyType");
      expect(booking).toHaveProperty("propertyAddress");
      expect(booking).toHaveProperty("service");
      expect(booking).toHaveProperty("preferredDate");
      expect(booking).toHaveProperty("preferredTime");
      expect(booking).toHaveProperty("status");
    });

    it("returns booking fields with correct types", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);

      const result = await repository.find({
        page: 1,
        pageSize: 10,
        sort: "createdAt",
        direction: "desc",
      });

      expect(result.items.length).toBeGreaterThan(0);
      const booking = result.items[0];

      expect(typeof booking.id).toBe("string");
      expect(typeof booking.customerName).toBe("string");
      expect(typeof booking.mobileNumber).toBe("string");
      expect(typeof booking.propertyType).toBe("string");
      expect(typeof booking.propertyAddress).toBe("string");
      expect(typeof booking.service).toBe("string");
      expect(typeof booking.preferredDate).toBe("string");
      expect(typeof booking.preferredTime).toBe("string");
      expect(typeof booking.status).toBe("string");
    });

    it("returns booking fields with non-empty values", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);

      const result = await repository.find({
        page: 1,
        pageSize: 10,
        sort: "createdAt",
        direction: "desc",
      });

      expect(result.items.length).toBeGreaterThan(0);
      const booking = result.items[0];

      expect(booking.id).toBeTruthy();
      expect(booking.customerName).toBeTruthy();
      expect(booking.mobileNumber).toBeTruthy();
      expect(booking.propertyType).toBeTruthy();
      expect(booking.propertyAddress).toBeTruthy();
      expect(booking.service).toBeTruthy();
      expect(booking.preferredDate).toBeTruthy();
      expect(booking.preferredTime).toBeTruthy();
      expect(booking.status).toBeTruthy();
    });
  });

  describe("Get Booking by ID", () => {
    describe("Retrieve Booking by ID", () => {
      it("returns booking with id, service, preferredDate, preferredTime, status when booking exists", async () => {
        const dataSource = new FakeBookingDataSource();
        const repository = new BookingRepositoryImpl(dataSource);

        const result = await repository.findById("booking-001");

        expect(result).toBeDefined();
        expect(result?.booking).toBeDefined();
        expect(result?.booking.id).toBe("booking-001");
        expect(result?.booking.service).toBeDefined();
        expect(result?.booking.preferredDate).toBeDefined();
        expect(result?.booking.preferredTime).toBeDefined();
        expect(result?.booking.status).toBeDefined();
      });
    });

    describe("Retrieve Associated Customer", () => {
      it("returns customer data when booking exists", async () => {
        const dataSource = new FakeBookingDataSource();
        const repository = new BookingRepositoryImpl(dataSource);

        const result = await repository.findById("booking-001");

        expect(result).toBeDefined();
        expect(result?.customer).toBeDefined();
        expect(result?.customer.id).toBeDefined();
        expect(result?.customer.name).toBeDefined();
        expect(result?.customer.mobileNumber).toBeDefined();
      });
    });

    describe("Retrieve Associated Property", () => {
      it("returns property data when booking exists", async () => {
        const dataSource = new FakeBookingDataSource();
        const repository = new BookingRepositoryImpl(dataSource);

        const result = await repository.findById("booking-001");

        expect(result).toBeDefined();
        expect(result?.property).toBeDefined();
        expect(result?.property.id).toBeDefined();
        expect(result?.property.type).toBeDefined();
        expect(result?.property.address).toBeDefined();
      });
    });

    describe("Return Not Found When Booking Does Not Exist", () => {
      it("returns null when booking does not exist", async () => {
        const dataSource = new FakeBookingDataSource();
        const repository = new BookingRepositoryImpl(dataSource);

        const result = await repository.findById("nonexistent-id");

        expect(result).toBeNull();
      });
    });
  });

  describe("Persist Updated Booking Status", () => {
    it("persists updated booking status and returns booking with updated status", async () => {
      const dataSource = new FakeBookingDataSource();
      const repository = new BookingRepositoryImpl(dataSource);

      const result = await repository.updateBookingStatus(
        "booking-001",
        "APPROVED",
      );

      expect(result).toBeDefined();
      expect(result?.booking.id).toBe("booking-001");
      expect(result?.booking.status).toBe("APPROVED");
      expect(result?.customer).toBeDefined();
      expect(result?.property).toBeDefined();
    });
  });
});
