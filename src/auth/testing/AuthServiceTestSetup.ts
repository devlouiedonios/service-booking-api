import { AuthService } from "../service/AuthService";
import { UserRepositoryImpl } from "../data/repository/UserRepositoryImpl";
import { FakeUserDataSource } from "./FakeUserDataSource";
import { RefreshTokenRepositoryImpl } from "../data/repository/RefreshTokenRepositoryImpl";
import { FakeRefreshTokenDataSource } from "./FakeRefreshTokenDataSource";
import { FakePasswordHasher } from "./FakePasswordHasher";
import { FakeTokenProvider } from "./FakeTokenProvider";

export function createAuthService(): AuthService {
  const userDataSource = new FakeUserDataSource();
  const userRepository = new UserRepositoryImpl(userDataSource);

  const refreshTokenDataSource = new FakeRefreshTokenDataSource();
  const refreshTokenRepository = new RefreshTokenRepositoryImpl(
    refreshTokenDataSource,
  );

  const passwordHasher = new FakePasswordHasher();
  const tokenProvider = new FakeTokenProvider();
  return new AuthService(
    userRepository,
    refreshTokenRepository,
    passwordHasher,
    tokenProvider,
  );
}
