import request from "supertest";
import { describe, expect, it } from "vitest";
import { createTestApp } from "../../testing/createTestApp";

describe("Get Booking API", () => {
  describe("Happy Path", () => {
    it("returns booking details with valid authentication when booking exists", async () => {
      const app = createTestApp();

      const response = await request(app)
        .get("/bookings/booking-001")
        .set("X-Client-Platform", "mobile")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("booking");
      expect(response.body).toHaveProperty("customer");
      expect(response.body).toHaveProperty("property");

      expect(response.body.booking.id).toBe("booking-001");
      expect(response.body.booking).toHaveProperty("service");
      expect(response.body.booking).toHaveProperty("preferredDate");
      expect(response.body.booking).toHaveProperty("preferredTime");
      expect(response.body.booking).toHaveProperty("status");

      expect(response.body.customer).toHaveProperty("id");
      expect(response.body.customer).toHaveProperty("name");
      expect(response.body.customer).toHaveProperty("mobileNumber");

      expect(response.body.property).toHaveProperty("id");
      expect(response.body.property).toHaveProperty("type");
      expect(response.body.property).toHaveProperty("address");
      expect(response.body.property).not.toHaveProperty("customerId");
    });
  });

  describe("Unhappy Path", () => {
    it("returns 401 unauthorized when access token is missing", async () => {
      const app = createTestApp();

      const response = await request(app)
        .get("/bookings/booking-001")
        .set("X-Client-Platform", "mobile");

      expect(response.status).toBe(401);
    });

    it("returns null when booking does not exist", async () => {
      const app = createTestApp();

      const response = await request(app)
        .get("/bookings/nonexistent-id")
        .set("X-Client-Platform", "mobile")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(404);
    });
  });
});
