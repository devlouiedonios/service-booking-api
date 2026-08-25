import request from "supertest";
import { describe, expect, it } from "vitest";
import { createRegisterRequest } from "../testing/TestData";
import { createTestApp } from "../../testing/createTestApp";

describe("Login API", () => {
  describe("Success", () => {
    it("returns authentication response for mobile", async () => {
      const app = createTestApp();
      const registerRequest = createRegisterRequest();

      await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "mobile")
        .send(registerRequest);

      const response = await request(app)
        .post("/auth/login")
        .set("X-Client-Platform", "mobile")
        .send({
          email: registerRequest.email,
          password: registerRequest.password,
        });

      expect(response.status).toBe(200);
      const user = response.body.user;
      expect(user.id).toBeDefined();
      expect(user.email).toBe(registerRequest.email);
      expect(user.passwordHash).not.toBe(registerRequest.password);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it("returns authentication response for web", async () => {
      const app = createTestApp();
      const registerRequest = createRegisterRequest();

      await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

      const response = await request(app)
        .post("/auth/login")
        .set("X-Client-Platform", "web")
        .send({
          email: registerRequest.email,
          password: registerRequest.password,
        });

      expect(response.status).toBe(200);

      const user = response.body.user;
      expect(user.id).toBeDefined();
      expect(user.email).toBe(registerRequest.email);

      expect(response.body.accessToken).toBeUndefined();
      expect(response.body.refreshToken).toBeUndefined();

      const cookies = response.headers["set-cookie"];
      expect(cookies).toHaveLength(2);
      expect(cookies[0]).toContain("accessToken=");
      expect(cookies[1]).toContain("refreshToken=");
    });
  });

  describe("Validation", () => {
    it("returns validation error when email is missing", async () => {
      const app = createTestApp();

      const response = await request(app)
        .post("/auth/login")
        .set("X-Client-Platform", "mobile")
        .send({ password: "Password123" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Validation failed",
        errors: [
          {
            field: "email",
            message: "Email is required.",
          },
        ],
      });
    });

    it("returns validation error when password is missing", async () => {
      const app = createTestApp();

      const response = await request(app)
        .post("/auth/login")
        .set("X-Client-Platform", "mobile")
        .send({ email: "john.doe@example.com" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Validation failed",
        errors: [
          {
            field: "password",
            message: "Password is required.",
          },
        ],
      });
    });
  });

  describe("Errors", () => {
    it("returns unauthorized when user does not exist", async () => {
      const app = createTestApp();

      const response = await request(app)
        .post("/auth/login")
        .set("X-Client-Platform", "mobile")
        .send({
          email: "nonexistent@example.com",
          password: "Password123",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Invalid email or password.",
      });
    });

    it("returns unauthorized when password is incorrect", async () => {
      const app = createTestApp();
      const registerRequest = createRegisterRequest();

      await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "mobile")
        .send(registerRequest);

      const response = await request(app)
        .post("/auth/login")
        .set("X-Client-Platform", "mobile")
        .send({
          email: registerRequest.email,
          password: "WrongPassword",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Invalid email or password.",
      });
    });
  });
});
