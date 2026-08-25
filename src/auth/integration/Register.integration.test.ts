import { describe, expect, it } from "vitest";
import { createRegisterRequest, createUserResponse } from "../testing/TestData";
import { createAuthService } from "../testing/AuthServiceTestSetup";

describe("Register", () => {
  it("registers user successfully", async () => {
    const authService = createAuthService();

    const authenticationResult = await authService.register(
      createRegisterRequest(),
    );

    expect(authenticationResult).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: createUserResponse(),
    });
  });
});
