import { describe, expect, it } from "vitest";
import { createRegisterRequest, createUserResponse } from "../testing/TestData";
import { createAuthService } from "../testing/AuthServiceTestSetup";

describe("Login", () => {
  it("logs in user successfully", async () => {
    const authService = createAuthService();

    await authService.register(createRegisterRequest());

    const authenticationResult = await authService.login({
      email: "john.doe@example.com",
      password: "Password123",
    });

    expect(authenticationResult).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: createUserResponse(),
    });
  });
});
