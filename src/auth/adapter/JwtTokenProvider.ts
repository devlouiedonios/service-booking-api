import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { TokenProvider } from "../TokenProvider";
import { GeneratedToken } from "../GeneratedToken";
import { UnauthorizedError } from "../../common/errors/UnauthorizedError";

const ACCESS_TOKEN_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = "30d";

const ACCESS_TOKEN_EXPIRATION_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000;

type RefreshTokenPayload = {
  sub: string;
};

export class JwtTokenProvider implements TokenProvider {
  async generateAccessToken(userId: string): Promise<GeneratedToken> {
    const token = jwt.sign(
      {
        sub: userId,
      },
      env.accessTokenSecret,
      {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      },
    );
    return {
      token,
      expiresAt: new Date(Date.now() + ACCESS_TOKEN_EXPIRATION_MS),
    };
  }

  async generateRefreshToken(userId: string): Promise<GeneratedToken> {
    const token = jwt.sign(
      {
        sub: userId,
      },
      env.refreshTokenSecret,
      {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      },
    );
    return {
      token,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS),
    };
  }

  async verifyRefreshToken(refreshToken: string): Promise<VerifiedToken> {
    try {
      const decoded = jwt.verify(refreshToken, env.refreshTokenSecret) as {
        sub: string;
      } as RefreshTokenPayload;

      return {
        userId: decoded.sub,
      };
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        throw new UnauthorizedError("Invalid Refresh Token");
      }
      throw error;
    }
  }

  async verifyAccessToken(accessToken: string): Promise<VerifiedToken> {
    try {
      const decoded = jwt.verify(accessToken, env.accessTokenSecret) as {
        sub: string;
      };

      return {
        userId: decoded.sub,
      };
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        throw new UnauthorizedError("Invalid Access Token");
      }
      throw error;
    }
  }
}
