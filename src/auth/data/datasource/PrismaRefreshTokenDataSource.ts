import { PrismaClient } from "@prisma/client";
import { RefreshToken } from "../../domain/RefreshToken";
import { RefreshTokenDataSource } from "./RefreshTokenDataSource";
import { NewRefreshToken } from "../../domain/NewRefreshToken";

export class PrismaRefreshTokenDataSource implements RefreshTokenDataSource {
  constructor(private db: PrismaClient) {}

  async save({
    userId,
    hashedToken,
    expiresAt,
  }: NewRefreshToken): Promise<RefreshToken> {
    return this.db.refreshToken.upsert({
      where: { userId },
      update: { hashedToken, expiresAt },
      create: {
        userId,
        hashedToken,
        expiresAt,
      },
    });
  }

  async findByUserId(userId: string): Promise<RefreshToken | null> {
    return this.db.refreshToken.findFirst({
      where: {
        userId,
      },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.db.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
