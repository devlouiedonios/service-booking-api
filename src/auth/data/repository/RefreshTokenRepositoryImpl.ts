import { RefreshTokenRepository } from "../../domain/RefreshTokenRepository";
import { RefreshTokenDataSource } from "../datasource/RefreshTokenDataSource";
import { RefreshToken } from "../../domain/RefreshToken";
import { NewRefreshToken } from "../../domain/NewRefreshToken";

export class RefreshTokenRepositoryImpl implements RefreshTokenRepository {
  constructor(private dataSource: RefreshTokenDataSource) {}
  async save(newRefreshToken: NewRefreshToken): Promise<RefreshToken> {
    return this.dataSource.save(newRefreshToken);
  }

  async findByUserId(userId: string): Promise<RefreshToken | undefined> {
    return (await this.dataSource.findByUserId(userId)) ?? undefined;
  }

  async deleteByUserId(userId: string): Promise<void> {
    return this.dataSource.deleteByUserId(userId);
  }
}
