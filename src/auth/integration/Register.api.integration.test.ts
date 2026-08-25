import request from "supertest";
import { describe, expect, it } from "vitest";
import { createRegisterRequest } from "../testing/TestData";
import { createTestApp } from "../../testing/createTestApp";

describe("Register API", () => {
  describe("Success", () => {
    it("returns authentication response for mobile", async () => {
      const registerRequest = createRegisterRequest();

      const app = createTestApp();

      const response = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "mobile")
        .send(registerRequest);

      expect(response.status).toBe(201);

      const user = response.body.user;
      expect(user.id).toBeDefined();
      expect(user.name).toBe(registerRequest.name);
      expect(user.email).toBe(registerRequest.email);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it("returns authentication response for web", async () => {
      const registerRequest = createRegisterRequest();

      const app = createTestApp();

      const response = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

      expect(response.status).toBe(201);

      const user = response.body.user;
      expect(user.id).toBeDefined();
      expect(user.name).toBe(registerRequest.name);
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
    it("returns validation error when name is missing", async () => {
      const registerRequest = createRegisterRequest({ name: undefined });

      const app = createTestApp();

      const response = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "mobile")
        .send(registerRequest);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Validation failed",
        errors: [
          {
            field: "name",
            message: "Name is required.",
          },
        ],
      });
    });

    it("returns validation error when name is empty", async () => {
      const registerRequest = createRegisterRequest({ name: "" });

      const app = createTestApp();

      const response = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "mobile")
        .send(registerRequest);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Validation failed",
        errors: [
          {
            field: "name",
            message: "Name is required.",
          },
        ],
      });
    });

    it("returns validation error when email is missing", async () => {
      const registerRequest = createRegisterRequest({ email: undefined });

      const app = createTestApp();

      const response = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

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

    it("returns validation error when email is invalid", async () => {
      const registerRequest = createRegisterRequest({ email: "jdoe@example" });

      const app = createTestApp();

      const response = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Validation failed",
        errors: [
          {
            field: "email",
            message: "Email must be a valid email address.",
          },
        ],
      });
    });

    it("returns validation error when password is missing", async () => {
      const registerRequest = createRegisterRequest({ password: undefined });

      const app = createTestApp();

      const response = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

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

    it("returns validation error when password is empty", async () => {
      const registerRequest = createRegisterRequest({ password: "" });

      const app = createTestApp();

      const response = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

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

    it("returns validation error when password is too short", async () => {
      const registerRequest = createRegisterRequest({ password: "abc" });

      const app = createTestApp();

      const response = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Validation failed",
        errors: [
          {
            field: "password",
            message: "Password must be at least 8 characters.",
          },
        ],
      });
    });
  });

  describe("Errors", () => {
    it("returns conflict when email already exists", async () => {
      const registerRequest = createRegisterRequest();

      const app = createTestApp();

      await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

      const response = await request(app)
        .post("/auth/register")
        .set("X-Client-Platform", "web")
        .send(registerRequest);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        message: "Email already exists.",
      });
    });
  });
});
