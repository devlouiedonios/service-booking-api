import { NewRefreshToken } from "../../domain/NewRefreshToken";
import { RefreshToken } from "../../domain/RefreshToken";

export interface RefreshTokenDataSource {
  save(newRefreshToken: NewRefreshToken): Promise<RefreshToken>;
  findByUserId(userId: string): Promise<RefreshToken | null>;
  deleteByUserId(userId: string): Promise<void>;
}
