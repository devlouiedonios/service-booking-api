import { Request, Response, CookieOptions } from "express";
import { describe, expect, it, vi } from "vitest";
import { AuthService } from "../service/AuthService";
import { FakeUserRepository } from "../testing/FakeUserRepository";
import { FakeRefreshTokenRepository } from "../testing/FakeRefreshTokenRepository";
import { FakePasswordHasher } from "../testing/FakePasswordHasher";
import { FakeTokenProvider } from "../testing/FakeTokenProvider";
import { createUser, createUserResponse } from "../testing/TestData";
import { ClientPlatform } from "../../common/ClientPlatform";
import { AuthController } from "./AuthController";
import { TEST_EXPIRES_AT } from "../testing/TestConstants";
import { AuthenticatedRequest } from "../../common/authentication/AuthenticatedRequest";

describe("AuthController", () => {
  it("returns authentication response for web", async () => {
    const request = createRequest("web");
    const response = createResponse();
    const { authController } = createAuthController();

    await authController.register(request, response);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };

    expect(response.cookie).toHaveBeenNthCalledWith(
      1,
      "accessToken",
      "access-token",
      cookieOptions,
    );
    expect(response.cookie).toHaveBeenNthCalledWith(
      2,
      "refreshToken",
      "refresh-token",
      cookieOptions,
    );
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({ user: createUserResponse() });
  });

  it("returns authentication response for mobile", async () => {
    const request = createRequest("mobile");
    const response = createResponse();
    const { authController } = createAuthController();

    await authController.register(request, response);

    expect(response.cookie).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: createUserResponse(),
    });
  });

  it("returns login response for web", async () => {
    const request = createLoginRequest("web");
    const response = createResponse();
    const { authController, userRepository } = createAuthController();

    await userRepository.create(createUser());
    await authController.login(request, response);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };

    expect(response.cookie).toHaveBeenNthCalledWith(
      1,
      "accessToken",
      "access-token",
      cookieOptions,
    );
    expect(response.cookie).toHaveBeenNthCalledWith(
      2,
      "refreshToken",
      "refresh-token",
      cookieOptions,
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      user: createUserResponse(),
    });
  });

  it("returns login response for mobile", async () => {
    const request = createLoginRequest("mobile");
    const response = createResponse();
    const { authController, userRepository } = createAuthController();

    await userRepository.create(createUser());
    await authController.login(request, response);

    expect(response.cookie).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: createUserResponse(),
    });
  });

  it("returns refreshed authentication response for web", async () => {
    const request = createRefreshRequest("web");
    const response = createResponse();
    const { authController, userRepository, refreshTokenRepository } =
      createAuthController();

    await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      passwordHash: "hashed-Password123",
    });

    await refreshTokenRepository.save({
      userId: "user-001",
      hashedToken: "hashed-refresh-token",
      expiresAt: new Date(TEST_EXPIRES_AT),
    });

    await authController.refresh(request, response);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };

    expect(response.cookie).toHaveBeenNthCalledWith(
      1,
      "accessToken",
      "access-token",
      cookieOptions,
    );
    expect(response.cookie).toHaveBeenNthCalledWith(
      2,
      "refreshToken",
      "refresh-token",
      cookieOptions,
    );
    expect(response.status).toHaveBeenCalledWith(204);
  });

  it("returns refreshed authentication response for mobile", async () => {
    const request = createRefreshRequest("mobile");
    const response = createResponse();
    const { authController, userRepository, refreshTokenRepository } =
      createAuthController();

    await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      passwordHash: "hashed-Password123",
    });

    await refreshTokenRepository.save({
      userId: "user-001",
      hashedToken: "hashed-refresh-token",
      expiresAt: new Date(TEST_EXPIRES_AT),
    });

    await authController.refresh(request, response);

    expect(response.cookie).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  it("returns logout response for web", async () => {
    const request = createLogoutRequest("web");
    const response = createResponse();
    const { authController } = createAuthController();

    await authController.logout(request, response);

    expect(response.clearCookie).toHaveBeenNthCalledWith(1, "accessToken");
    expect(response.clearCookie).toHaveBeenNthCalledWith(2, "refreshToken");
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.end).toHaveBeenCalled();
  });

  it("returns logout response for mobile", async () => {
    const request = createLogoutRequest("mobile");
    const response = createResponse();
    const { authController } = createAuthController();

    await authController.logout(request, response);

    expect(response.clearCookie).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.end).toHaveBeenCalled();
  });

  it("returns current user for authenticated request", async () => {
    const request = createCurrentUserRequest("web");
    const response = createResponse();
    const { authController, userRepository } = createAuthController();

    await userRepository.create(createUser());
    await authController.currentUser(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      user: createUserResponse(),
    });
  });

  it("excludes password from current user response", async () => {
    const request = createCurrentUserRequest("web");
    const response = createResponse();
    const { authController, userRepository } = createAuthController();

    await userRepository.create(createUser());
    await authController.currentUser(request, response);

    const jsonCall = (response.json as any).mock.calls[0][0];
    expect(jsonCall.user).not.toHaveProperty("passwordHash");
  });

  it("excludes tokens from current user response", async () => {
    const request = createCurrentUserRequest("web");
    const response = createResponse();
    const { authController, userRepository } = createAuthController();

    await userRepository.create(createUser());
    await authController.currentUser(request, response);

    const jsonCall = (response.json as any).mock.calls[0][0];
    expect(jsonCall.user).not.toHaveProperty("accessToken");
    expect(jsonCall.user).not.toHaveProperty("refreshToken");
  });
});

function createAuthController() {
  const userRepository = new FakeUserRepository();
  const refreshTokenRepository = new FakeRefreshTokenRepository();
  const passwordHasher = new FakePasswordHasher();
  const tokenProvider = new FakeTokenProvider();

  const authService = new AuthService(
    userRepository,
    refreshTokenRepository,
    passwordHasher,
    tokenProvider,
  );
  return {
    authController: new AuthController(authService),
    userRepository,
    refreshTokenRepository,
  };
}

function createRequest(platform: ClientPlatform): Request {
  return {
    body: {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "Password123",
    },
    header: vi.fn().mockReturnValue(platform),
  } as unknown as Request;
}

function createLoginRequest(platform: ClientPlatform): Request {
  return {
    body: {
      email: "john.doe@example.com",
      password: "Password123",
    },
    header: vi.fn().mockReturnValue(platform),
  } as unknown as Request;
}

function createRefreshRequest(platform: ClientPlatform): Request {
  return {
    body: {
      userId: "user-001",
      refreshToken: "refresh-token",
    },
    cookies: { refreshToken: "refresh-token" },
    header: vi.fn().mockReturnValue(platform),
  } as unknown as Request;
}

function createLogoutRequest(platform: ClientPlatform): AuthenticatedRequest {
  return {
    header: vi.fn().mockReturnValue(platform),
    authenticatedUser: {
      userId: "user-001",
    },
  } as unknown as AuthenticatedRequest;
}

function createCurrentUserRequest(
  platform: ClientPlatform,
): AuthenticatedRequest {
  return {
    header: vi.fn().mockReturnValue(platform),
    authenticatedUser: {
      userId: "user-001",
    },
  } as unknown as AuthenticatedRequest;
}

function createResponse(): Response {
  return {
    cookie: vi.fn(),
    clearCookie: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    end: vi.fn(),
  } as unknown as Response;
}
