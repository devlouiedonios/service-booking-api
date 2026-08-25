import { GeneratedToken } from "./GeneratedToken";

export interface TokenProvider {
  generateAccessToken(userId: string): Promise<GeneratedToken>;
  generateRefreshToken(userId: string): Promise<GeneratedToken>;
  verifyRefreshToken(refreshToken: string): Promise<VerifiedToken>;
  verifyAccessToken(accessToken: string): Promise<VerifiedToken>;
}
