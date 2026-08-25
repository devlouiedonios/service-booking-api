import request from "supertest";
import { describe, expect, it } from "vitest";
import { createRegisterRequest } from "../testing/TestData";
import { createTestApp } from "../../testing/createTestApp";

describe("Refresh API", () => {
  describe("Success", () => {
    it("returns refreshed authentication response for web", async () => {
      const app = createTestApp();
      const registerRequest = createRegisterRequest();

      // Register to get initial tokens
      const registerResponse = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

      const setCookie = registerResponse.headers["set-cookie"];

      const refreshTokenCookie = Array.isArray(setCookie)
        ? setCookie.find((cookie: string) => cookie.startsWith("refreshToken="))
        : undefined;

      // Refresh with token from cookie
      const response = await request(app)
        .post("/auth/refresh")
        .set("X-Client-Platform", "web")
        .set("Cookie", refreshTokenCookie);

      expect(response.status).toBe(204);
      expect(response.body.accessToken).toBeUndefined();
      expect(response.body.refreshToken).toBeUndefined();

      const cookies = response.headers["set-cookie"];
      expect(cookies).toHaveLength(2);
      expect(cookies[0]).toContain("accessToken=");
      expect(cookies[1]).toContain("refreshToken=");
    });

    it("returns refreshed authentication response for mobile", async () => {
      const app = createTestApp();
      const registerRequest = createRegisterRequest();

      // Register to get initial tokens
      const registerResponse = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "mobile")
        .send(registerRequest);

      // Refresh with token from response body
      const response = await request(app)
        .post("/auth/refresh")
        .set("X-Client-Platform", "mobile")
        .send({
          refreshToken: registerResponse.body.refreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.headers["set-cookie"]).toBeUndefined();
    });
  });

  describe("Validation", () => {
    it("returns validation error when refresh token is missing for mobile", async () => {
      const app = createTestApp();

      const response = await request(app)
        .post("/auth/refresh")
        .set("X-Client-Platform", "mobile")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Validation failed",
        errors: [
          {
            field: "refreshToken",
            message: "Refresh token is required.",
          },
        ],
      });
    });
  });

  describe("Errors", () => {
    it("returns unauthorized when refresh token is invalid", async () => {
      const app = createTestApp();

      const response = await request(app)
        .post("/auth/refresh")
        .set("X-Client-Platform", "mobile")
        .send({
          refreshToken: "invalid-token",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });
  });
});
