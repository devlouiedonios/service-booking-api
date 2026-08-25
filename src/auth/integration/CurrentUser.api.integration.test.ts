import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app/app";
import { FakeUserDataSource } from "../testing/FakeUserDataSource";
import { FakeRefreshTokenDataSource } from "../testing/FakeRefreshTokenDataSource";
import { createRegisterRequest } from "../testing/TestData";
import { FakeTokenProvider } from "../testing/FakeTokenProvider";
import { FakeBookingDataSource } from "../../bookings/testing/FakeBookingDataSource";
import { AuthenticationMiddleware } from "../../common/authentication/AuthenticationMiddleware";
import { createTestApp } from "../../testing/createTestApp";

describe("Current User API", () => {
  describe("Happy Path", () => {
    it("returns current user for authenticated mobile client", async () => {
      const app = createTestApp();
      const registerRequest = createRegisterRequest();

      // Register user to get authentication token
      const registerResponse = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "mobile")
        .send(registerRequest);

      // Request current user with valid token
      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", `Bearer ${registerResponse.body.accessToken}`)
        .set("X-Client-Platform", "mobile");

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: registerRequest.name,
          email: registerRequest.email,
        }),
      );
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it("returns current user for authenticated web client", async () => {
      const app = createTestApp();
      const registerRequest = createRegisterRequest();

      // Register user to set authentication cookie
      const registerResponse = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

      const setCookie = registerResponse.headers["set-cookie"];
      const accessTokenCookie = Array.isArray(setCookie)
        ? setCookie.find((cookie: string) => cookie.startsWith("accessToken="))
        : undefined;

      // Request current user with cookie
      const response = await request(app)
        .get("/auth/me")
        .set("Cookie", accessTokenCookie || "")
        .set("X-Client-Platform", "web");

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: registerRequest.name,
          email: registerRequest.email,
        }),
      );
      expect(response.body.user.passwordHash).toBeUndefined();
    });
  });

  describe("Unhappy Path", () => {
    it("returns 401 when access token is missing", async () => {
      const app = createTestApp();

      const response = await request(app)
        .get("/auth/me")
        .set("X-Client-Platform", "mobile");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Missing access token",
      });
    });

    it("returns 401 when access token is invalid", async () => {
      const app = createTestApp();

      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .set("X-Client-Platform", "mobile");

      expect(response.status).toBe(401);
    });

    it("returns 401 when authenticated user no longer exists", async () => {
      const dataSource = new FakeUserDataSource();
      const tokenProvider = new FakeTokenProvider();
      const appWithCustomDataSource = createApp({
        auth: {
          userDataSource: dataSource,
          refreshTokenDataSource: new FakeRefreshTokenDataSource(),
        },
        bookings: {
          bookingDataSource: new FakeBookingDataSource(),
          authenticationMiddleware: new AuthenticationMiddleware(tokenProvider),
        },
      });

      const registerRequest = createRegisterRequest();

      // Register user
      const registerResponse = await request(appWithCustomDataSource)
        .post("/auth/register")
        .set("X-Client-Platform", "mobile")
        .send(registerRequest);

      const accessToken = registerResponse.body.accessToken;

      // Delete user from data source
      dataSource.deleteUser("user-001");

      // Request current user with valid token but user no longer exists
      const response = await request(appWithCustomDataSource)
        .get("/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("X-Client-Platform", "mobile");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "User not found.",
      });
    });
  });
});
