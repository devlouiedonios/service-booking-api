import { RefreshTokenRepository } from "../domain/RefreshTokenRepository";
import { RefreshToken } from "../domain/RefreshToken";
import { NewRefreshToken } from "../domain/NewRefreshToken";
import { TEST_CREATED_AT, TEST_EXPIRES_AT } from "./TestConstants";

export class FakeRefreshTokenRepository implements RefreshTokenRepository {
  private refreshTokens: RefreshToken[] = [];
  async save({ userId, hashedToken }: NewRefreshToken): Promise<RefreshToken> {
    this.refreshTokens = this.refreshTokens.filter(
      (token) => token.userId !== userId,
    );

    const refreshToken: RefreshToken = {
      userId: userId,
      hashedToken: hashedToken,
      expiresAt: TEST_EXPIRES_AT,
      createdAt: TEST_CREATED_AT,
    };
    this.refreshTokens.push(refreshToken);

    return refreshToken;
  }

  async findByUserId(userId: string): Promise<RefreshToken | undefined> {
    return (
      this.refreshTokens.find((token) => token.userId === userId) || undefined
    );
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter(
      (token) => token.userId !== userId,
    );
  }
}
