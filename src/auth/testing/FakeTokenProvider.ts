import { GeneratedToken } from "../GeneratedToken";
import { TokenProvider } from "../TokenProvider";
import { TEST_EXPIRES_AT } from "./TestConstants";

export class FakeTokenProvider implements TokenProvider {
  async generateAccessToken(userId: string): Promise<GeneratedToken> {
    return {
      token: "access-token",
      expiresAt: new Date(TEST_EXPIRES_AT),
    };
  }

  async generateRefreshToken(userId: string): Promise<GeneratedToken> {
    return {
      token: "refresh-token",
      expiresAt: new Date(TEST_EXPIRES_AT),
    };
  }

  async verifyRefreshToken(refreshToken: string): Promise<VerifiedToken> {
    return {
      userId: "user-001",
    };
  }

  async verifyAccessToken(accessToken: string): Promise<VerifiedToken> {
    return {
      userId: "user-001",
    };
  }
}
