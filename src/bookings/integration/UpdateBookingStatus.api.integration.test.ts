import request from "supertest";
import { describe, expect, it } from "vitest";
import { createTestApp } from "../../testing/createTestApp";

describe("Update Booking Status API", () => {
  describe("Happy Path", () => {
    it("returns updated booking with valid authentication and valid status", async () => {
      const app = createTestApp();

      const response = await request(app)
        .patch("/bookings/booking-001/status")
        .set("X-Client-Platform", "mobile")
        .set("Authorization", "Bearer valid-token")
        .send({ status: "APPROVED" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("booking");
      expect(response.body).toHaveProperty("customer");
      expect(response.body).toHaveProperty("property");

      expect(response.body.booking.id).toBe("booking-001");
      expect(response.body.booking.status).toBe("APPROVED");
      expect(response.body.booking).toHaveProperty("service");
      expect(response.body.booking).toHaveProperty("preferredDate");
      expect(response.body.booking).toHaveProperty("preferredTime");

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
        .patch("/bookings/booking-001/status")
        .set("X-Client-Platform", "mobile")
        .send({ status: "APPROVED" });

      expect(response.status).toBe(401);
    });

    it("returns 400 bad request when status is invalid", async () => {
      const app = createTestApp();

      const response = await request(app)
        .patch("/bookings/booking-001/status")
        .set("X-Client-Platform", "mobile")
        .set("Authorization", "Bearer valid-token")
        .send({ status: "INVALID_STATUS" });

      expect(response.status).toBe(400);
    });

    it("returns 404 not found when booking does not exist", async () => {
      const app = createTestApp();

      const response = await request(app)
        .patch("/bookings/nonexistent-id/status")
        .set("X-Client-Platform", "mobile")
        .set("Authorization", "Bearer valid-token")
        .send({ status: "APPROVED" });

      expect(response.status).toBe(404);
    });
  });
});
