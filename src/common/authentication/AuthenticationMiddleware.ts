import { Request, Response, NextFunction } from "express";
import { TokenProvider } from "../../auth/TokenProvider";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { AuthenticatedRequest } from "./AuthenticatedRequest";
import { ClientPlatform } from "../ClientPlatform";

export class AuthenticationMiddleware {
  constructor(private tokenProvider: TokenProvider) {}

  async authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const platform = req.header("X-Client-Platform");

      const accessToken =
        platform === ClientPlatform.WEB
          ? req.cookies?.accessToken
          : this.getBearerToken(req);

      if (!accessToken) {
        throw new UnauthorizedError("Missing access token");
      }

      const verifiedToken =
        await this.tokenProvider.verifyAccessToken(accessToken);

      (req as AuthenticatedRequest).authenticatedUser = {
        userId: verifiedToken.userId,
      };

      next();
    } catch (error) {
      next(error);
    }
  }

  private getBearerToken(req: Request): string | undefined {
    const authorization = req.header("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return undefined;
    }

    return authorization?.substring("Bearer ".length);
  }
}
