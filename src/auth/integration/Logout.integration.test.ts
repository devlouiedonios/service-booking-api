import { describe, expect, it } from "vitest";
import { UnauthorizedError } from "../../common/errors/UnauthorizedError";
import { createRegisterRequest } from "../testing/TestData";
import { createAuthService } from "../testing/AuthServiceTestSetup";

describe("Logout", () => {
  it("logs out user successfully", async () => {
    const authService = createAuthService();

    // Arrange: register a user to create a refresh token
    const registerResult = await authService.register(createRegisterRequest());
    const { refreshToken } = registerResult;

    // Act: logout the user
    await authService.logout("user-001");

    // Assert: verify refresh token is invalidated
    await expect(
      authService.refresh({
        refreshToken,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
