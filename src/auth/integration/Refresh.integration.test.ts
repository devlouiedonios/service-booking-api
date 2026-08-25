import { describe, expect, it } from "vitest";
import { createRegisterRequest, createUserResponse } from "../testing/TestData";
import { createAuthService } from "../testing/AuthServiceTestSetup";

describe("Refresh", () => {
  it("refreshes authentication successfully", async () => {
    const authService = createAuthService();

    // Arrange: Register a user and get initial tokens
    const registerResult = await authService.register(createRegisterRequest());
    const { refreshToken } = registerResult;

    // Act: Refresh authentication with the token from registration
    const refreshResult = await authService.refresh({
      refreshToken,
    });

    // Assert: Verify refresh returns valid authentication result
    expect(refreshResult).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: createUserResponse(),
    });
  });
});
