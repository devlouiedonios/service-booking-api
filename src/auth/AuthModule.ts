import { Router } from "express";
import { UserRepositoryImpl } from "./data/repository/UserRepositoryImpl";
import { RefreshTokenRepositoryImpl } from "./data/repository/RefreshTokenRepositoryImpl";
import { BcryptPasswordHasher } from "./adapter/BcryptPasswordHasher";
import { JwtTokenProvider } from "./adapter/JwtTokenProvider";
import { AuthService } from "./service/AuthService";
import { AuthController } from "./presentation/AuthController";
import { createAuthRoutes } from "./presentation/AuthRoutes";
import { UserDataSource } from "./data/datasource/UserDataSource";
import { RefreshTokenDataSource } from "./data/datasource/RefreshTokenDataSource";
import { AuthenticationMiddleware } from "../common/authentication/AuthenticationMiddleware";
import { TokenProvider } from "./TokenProvider";

export interface AuthModuleDependencies {
  userDataSource: UserDataSource;
  refreshTokenDataSource: RefreshTokenDataSource;
}

export function createAuthModule({
  userDataSource,
  refreshTokenDataSource,
}: AuthModuleDependencies): Router {
  const userRepository = new UserRepositoryImpl(userDataSource);
  const refreshTokenRepository = new RefreshTokenRepositoryImpl(
    refreshTokenDataSource,
  );

  const paswordHasher = new BcryptPasswordHasher();
  const tokenProvider = new JwtTokenProvider();

  const authService = new AuthService(
    userRepository,
    refreshTokenRepository,
    paswordHasher,
    tokenProvider,
  );

  const authController = new AuthController(authService);
  const authenticationMiddleware = new AuthenticationMiddleware(tokenProvider);

  return createAuthRoutes(authController, authenticationMiddleware);
}
