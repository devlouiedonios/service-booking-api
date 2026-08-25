import { RefreshTokenDataSource } from "../data/datasource/RefreshTokenDataSource";
import { NewRefreshToken } from "../domain/NewRefreshToken";
import { RefreshToken } from "../domain/RefreshToken";
import { TEST_CREATED_AT, TEST_EXPIRES_AT } from "./TestConstants";

export class FakeRefreshTokenDataSource implements RefreshTokenDataSource {
  private refreshTokens: RefreshToken[] = [];
  async save({
    userId,
    hashedToken,
    expiresAt,
  }: NewRefreshToken): Promise<RefreshToken> {
    this.refreshTokens = this.refreshTokens.filter(
      (token) => token.userId !== userId,
    );
    const refreshToken: RefreshToken = {
      userId,
      hashedToken,
      expiresAt,
      createdAt: TEST_CREATED_AT,
    };
    this.refreshTokens.push(refreshToken);
    return refreshToken;
  }

  async findByUserId(userId: string): Promise<RefreshToken | null> {
    return this.refreshTokens.find((token) => token.userId === userId) || null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter(
      (token) => token.userId !== userId,
    );
  }
}
