import { describe, expect, it } from "vitest";
import { ConflictError } from "../../common/errors/ConflictError";
import { UnauthorizedError } from "../../common/errors/UnauthorizedError";
import { FakeUserRepository } from "../testing/FakeUserRepository";
import { FakeRefreshTokenRepository } from "../testing/FakeRefreshTokenRepository";
import { FakePasswordHasher } from "../testing/FakePasswordHasher";
import { FakeTokenProvider } from "../testing/FakeTokenProvider";
import { AuthService } from "./AuthService";
import { AuthenticationResult } from "./AuthenticationResult";
import { createRegisterRequest, createUserResponse } from "../testing/TestData";
import { TEST_EXPIRES_AT } from "../testing/TestConstants";

function createAuthServiceFixture() {
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
    authService,
    userRepository,
    refreshTokenRepository,
    passwordHasher,
    tokenProvider,
  };
}

describe("AuthService", () => {
  it("registers user successfully", async () => {
    const { authService } = createAuthServiceFixture();

    const actual = await authService.register(createRegisterRequest());

    const authenticationResult: AuthenticationResult = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: createUserResponse(),
    };

    expect(actual).toEqual(authenticationResult);
  });

  it("rejects duplicate email", async () => {
    const { authService } = createAuthServiceFixture();

    await authService.register(createRegisterRequest());

    await expect(
      authService.register({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "Password123",
      }),
    ).rejects.toThrow(ConflictError);
  });

  it("logs in user successfully", async () => {
    const { authService, userRepository } = createAuthServiceFixture();

    // Arrange: create a user in the repository
    await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      passwordHash: "hashed-Password123",
    });

    // Act
    const actual = await authService.login({
      email: "john.doe@example.com",
      password: "Password123",
    });

    // Assert
    const authenticationResult: AuthenticationResult = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: createUserResponse(),
    };

    expect(actual).toEqual(authenticationResult);
  });

  it("rejects login when user does not exist", async () => {
    const { authService } = createAuthServiceFixture();

    await expect(
      authService.login({
        email: "nonexistent@example.com",
        password: "Password123",
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("rejects login when password does not match", async () => {
    const { authService, userRepository } = createAuthServiceFixture();

    await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      passwordHash: "hashed-Password123",
    });

    await expect(
      authService.login({
        email: "john.doe@example.com",
        password: "WrongPassword",
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("refreshes authentication successfully", async () => {
    const { authService } = createAuthServiceFixture();

    // Arrange: register a user (which creates and stores a refresh token)
    await authService.register(createRegisterRequest());

    // Act: refresh the authentication
    const actual = await authService.refresh({
      refreshToken: "refresh-token",
    });

    // Assert
    const authenticationResult: AuthenticationResult = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: createUserResponse(),
    };

    expect(actual).toEqual(authenticationResult);
  });

  it("rejects refresh when refresh token does not exist", async () => {
    const { authService } = createAuthServiceFixture();

    await expect(
      authService.refresh({
        refreshToken: "invalid-token",
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("rejects refresh when refresh token does not match", async () => {
    const { authService } = createAuthServiceFixture();

    // Arrange: register a user (which creates and stores a refresh token)
    await authService.register(createRegisterRequest());

    // Act & Assert: refresh with a mismatched token
    await expect(
      authService.refresh({
        refreshToken: "wrong-refresh-token",
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("rejects refresh when user does not exist", async () => {
    const { authService, refreshTokenRepository, passwordHasher } =
      createAuthServiceFixture();

    // Arrange: save a refresh token for a user that doesn't exist
    const tokenHash = await passwordHasher.hash("orphaned-refresh-token");
    await refreshTokenRepository.save({
      userId: "nonexistent-user-id",
      hashedToken: tokenHash,
      expiresAt: new Date(TEST_EXPIRES_AT),
    });

    // Act & Assert: refresh with a token that exists but user doesn't
    await expect(
      authService.refresh({
        refreshToken: "orphaned-refresh-token",
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("logs out successfully", async () => {
    const { authService, refreshTokenRepository } = createAuthServiceFixture();

    // Arrange: register a user to create a refresh token
    await authService.register(createRegisterRequest());

    // Act: logout the user
    await authService.logout("user-001");

    // Assert: verify refresh token is deleted
    const refreshToken = await refreshTokenRepository.findByUserId("user-001");
    expect(refreshToken).toBeUndefined();
  });

  it("retrieves current user when authenticated", async () => {
    const { authService, userRepository } = createAuthServiceFixture();

    // Arrange: register a user
    await authService.register(createRegisterRequest());

    // Act: retrieve the current user
    const user = await authService.getCurrentUser("user-001");

    // Assert: verify user is returned
    expect(user).toEqual(createUserResponse());
  });

  it("returns user when user exists", async () => {
    const { authService, userRepository } = createAuthServiceFixture();

    // Arrange: register a user
    await userRepository.create({
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "hashed-password",
    });

    // Act: retrieve the current user
    const user = await authService.getCurrentUser("user-001");

    // Assert: verify user is returned
    expect(user).toEqual({
      id: "user-001",
      name: "John Doe",
      email: "john@example.com",
    });
  });

  it("reports user not found when user does not exist", async () => {
    const { authService } = createAuthServiceFixture();

    // Act & Assert: verify error is thrown
    await expect(
      authService.getCurrentUser("non-existent-user"),
    ).rejects.toThrow(UnauthorizedError);
  });
});
