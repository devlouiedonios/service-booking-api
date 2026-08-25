import request from "supertest";
import { describe, expect, it } from "vitest";
import { createTestApp } from "../../testing/createTestApp";

describe("Get Bookings API", () => {
  describe("Happy Path", () => {
    it("returns paginated bookings list with valid authentication and parameters", async () => {
      const app = createTestApp();

      const response = await request(app)
        .get("/bookings")
        .set("X-Client-Platform", "mobile")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("bookings");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.bookings)).toBe(true);
      expect(response.body.bookings.length).toBeGreaterThan(0);

      const booking = response.body.bookings[0];
      expect(booking).toHaveProperty("id");
      expect(booking).toHaveProperty("customerName");
      expect(booking).toHaveProperty("mobileNumber");
      expect(booking).toHaveProperty("propertyType");
      expect(booking).toHaveProperty("propertyAddress");
      expect(booking).toHaveProperty("service");
      expect(booking).toHaveProperty("preferredDate");
      expect(booking).toHaveProperty("preferredTime");
      expect(booking).toHaveProperty("status");

      expect(response.body.pagination).toHaveProperty("page");
      expect(response.body.pagination).toHaveProperty("pageSize");
      expect(response.body.pagination).toHaveProperty("totalItems");
      expect(response.body.pagination).toHaveProperty("totalPages");
    });
  });

  describe("Unhappy Path", () => {
    it("returns 401 unauthorized when access token is missing", async () => {
      const app = createTestApp();

      const response = await request(app)
        .get("/bookings")
        .set("X-Client-Platform", "mobile");

      expect(response.status).toBe(401);
    });

    describe("Reject Invalid Pagination Parameters", () => {
      it("returns 400 Bad Request when page parameter is 0", async () => {
        const app = createTestApp();

        const response = await request(app)
          .get("/bookings?page=0")
          .set("X-Client-Platform", "mobile")
          .set("Authorization", "Bearer valid-token");

        expect(response.status).toBe(400);
      });

      it("returns 400 Bad Request when pageSize parameter is 0", async () => {
        const app = createTestApp();

        const response = await request(app)
          .get("/bookings?pageSize=0")
          .set("X-Client-Platform", "mobile")
          .set("Authorization", "Bearer valid-token");

        expect(response.status).toBe(400);
      });
    });
  });
});
