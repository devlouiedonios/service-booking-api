import { NewRefreshToken } from "./NewRefreshToken";
import { RefreshToken } from "./RefreshToken";

export interface RefreshTokenRepository {
  save(newRefreshToken: NewRefreshToken): Promise<RefreshToken>;
  findByUserId(userId: string): Promise<RefreshToken | undefined>;
  deleteByUserId(userId: string): Promise<void>;
}
