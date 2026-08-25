import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { ClientPlatform } from "../../common/ClientPlatform";
import { AuthService } from "../service/AuthService";
import { Request, Response, CookieOptions } from "express";
import { AuthenticatedRequest } from "../../common/authentication/AuthenticatedRequest";

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    const platform = req.header("X-Client-Platform");
    const { name, email, password } = req.body;

    const result = await this.authService.register({
      name,
      email,
      password,
    });

    const { accessToken, refreshToken, user } = result;
    const isProduction = env.nodeEnv === "production";
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    };
    if (platform === ClientPlatform.WEB) {
      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.status(201).json({ user });
      return;
    }

    res.status(201).json({ accessToken, refreshToken, user });
  }

  async login(req: Request, res: Response): Promise<void> {
    const platform = req.header("X-Client-Platform");
    const { email, password } = req.body;

    const result = await this.authService.login({
      email,
      password,
    });

    const { accessToken, refreshToken, user } = result;
    const isProduction = env.nodeEnv === "production";
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    };

    if (platform === ClientPlatform.WEB) {
      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.status(200).json({ user });
      return;
    }

    res.status(200).json({ accessToken, refreshToken, user });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const platform = req.header("X-Client-Platform");

    const refreshToken =
      platform === ClientPlatform.WEB
        ? req.cookies.refreshToken
        : req.body.refreshToken;

    const result = await this.authService.refresh({
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken, user } = result;
    const isProduction = env.nodeEnv === "production";
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    };

    if (platform === ClientPlatform.WEB) {
      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", newRefreshToken, cookieOptions);
      res.status(204).end();
      return;
    }

    res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const platform = req.header("X-Client-Platform");

    const userId = (req as AuthenticatedRequest).authenticatedUser.userId;

    await this.authService.logout(userId);

    if (platform === ClientPlatform.WEB) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
    }

    res.status(204).end();
  }

  async currentUser(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthenticatedRequest).authenticatedUser.userId;

    const user = await this.authService.getCurrentUser(userId);

    res.status(200).json({ user });
  }
}
