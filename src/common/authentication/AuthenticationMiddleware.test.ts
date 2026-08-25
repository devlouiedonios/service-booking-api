import { describe, it, expect, vi } from "vitest";
import { FakeTokenProvider } from "../../auth/testing/FakeTokenProvider";
import { Request, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { AuthenticationMiddleware } from "./AuthenticationMiddleware";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

describe("AuthenticationMiddleware", () => {
  it("authenticates valid access token", async () => {
    const { middleware, next } = createAuthenticationMiddlewareFixture();
    const req = createAuthenticatedRequest("Bearer access-token");
    const res = createResponse();

    await middleware.authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as AuthenticatedRequest).authenticatedUser).toEqual({
      userId: "user-001",
    });
  });

  it("rejects request when access token is missing", async () => {
    const { middleware, next } = createAuthenticationMiddlewareFixture();
    const req = createAuthenticatedRequest(undefined);
    const res = createResponse();

    await middleware.authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it("rejects request when access token is invalid", async () => {
    const tokenProvider = new FakeTokenProvider();
    vi.spyOn(tokenProvider, "verifyAccessToken").mockRejectedValue(
      new UnauthorizedError("Token is invalid"),
    );
    const middleware = new AuthenticationMiddleware(tokenProvider);
    const next = vi.fn();
    const req = createAuthenticatedRequest("Bearer invalid-token");
    const res = createResponse();

    await middleware.authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it("rejects request when access token is expired", async () => {
    const tokenProvider = new FakeTokenProvider();
    vi.spyOn(tokenProvider, "verifyAccessToken").mockRejectedValue(
      new UnauthorizedError("Token has expired"),
    );
    const middleware = new AuthenticationMiddleware(tokenProvider);
    const next = vi.fn();
    const req = createAuthenticatedRequest("Bearer expired-token");
    const res = createResponse();

    await middleware.authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it("extracts authenticated identity from valid token", async () => {
    const { middleware, next } = createAuthenticationMiddlewareFixture();
    const req = createAuthenticatedRequest("Bearer access-token");
    const res = createResponse();

    await middleware.authenticate(req, res, next);

    expect((req as AuthenticatedRequest).authenticatedUser.userId).toBe(
      "user-001",
    );
  });
});

function createAuthenticationMiddlewareFixture() {
  const tokenProvider = new FakeTokenProvider();
  const middleware = new AuthenticationMiddleware(tokenProvider);
  const next = vi.fn();

  return { middleware, next };
}

function createAuthenticatedRequest(authorization?: string): Request {
  return {
    header: vi.fn().mockImplementation((name) => {
      if (name === "Authorization") {
        return authorization;
      }
      return undefined;
    }),
  } as unknown as Request;
}

function createResponse(): Response {
  return {} as unknown as Response;
}
