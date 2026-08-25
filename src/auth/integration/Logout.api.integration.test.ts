import request from "supertest";
import { describe, expect, it } from "vitest";
import { createRegisterRequest } from "../testing/TestData";
import { createTestApp } from "../../testing/createTestApp";

describe("Logout API", () => {
  describe("Success", () => {
    it("clears authentication cookies for web", async () => {
      const app = createTestApp();
      const registerRequest = createRegisterRequest();

      // Register to set cookies
      const registerResponse = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

      const setCookie = registerResponse.headers["set-cookie"];
      const accessTokenCookie = Array.isArray(setCookie)
        ? setCookie.find((cookie: string) => cookie.startsWith("accessToken="))
        : undefined;
      const accessToken = accessTokenCookie
        ?.replace(/^accessToken=/, "")
        .split(";")[0];

      // Logout
      const response = await request(app)
        .post("/auth/logout")
        .set("Cookie", `accessToken=${accessToken}`)
        .set("X-Client-Platform", "web");

      expect(response.status).toBe(204);
      const logoutCookies = response.headers["set-cookie"];
      expect(logoutCookies).toBeDefined();
      expect(logoutCookies).toEqual(
        expect.arrayContaining([
          expect.stringContaining("accessToken="),
          expect.stringContaining("refreshToken="),
        ]),
      );
    });

    it("returns no content for mobile", async () => {
      const app = createTestApp();
      const registerRequest = createRegisterRequest();

      // Register to get refresh token
      const registerResponse = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "mobile")
        .send(registerRequest);

      // Logout
      const response = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${registerResponse.body.accessToken}`)
        .set("X-Client-Platform", "mobile");

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(response.headers["set-cookie"]).toBeUndefined();
    });
  });
});
