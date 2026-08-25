import { UserRepository } from "../domain/UserRepository";
import { RefreshTokenRepository } from "../domain/RefreshTokenRepository";
import { PasswordHasher } from "../PasswordHasher";
import { RegisterRequest } from "./RegisterRequest";
import { LoginRequest } from "./LoginRequest";
import { RefreshRequest } from "./RefreshRequest";
import { AuthenticationResult } from "./AuthenticationResult";
import { ConflictError } from "../../common/errors/ConflictError";
import { UnauthorizedError } from "../../common/errors/UnauthorizedError";
import { NewUser } from "../domain/NewUser";
import { TokenProvider } from "../TokenProvider";
import { toUserResponse } from "../presentation/response/UserResponseMapper";
import { AUTH_MESSAGES } from "../AuthMessages";

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private passwordHasher: PasswordHasher,
    private tokenProvider: TokenProvider,
  ) {}

  async register({
    name,
    email,
    password,
  }: RegisterRequest): Promise<AuthenticationResult> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser !== undefined) {
      throw new ConflictError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const passwordHash = await this.passwordHasher.hash(password);

    const newUser: NewUser = {
      name,
      email,
      passwordHash,
    };

    const user = await this.userRepository.create(newUser);

    const accessToken = await this.tokenProvider.generateAccessToken(user.id);
    const refreshToken = await this.tokenProvider.generateRefreshToken(user.id);

    const refreshTokenHash = await this.passwordHasher.hash(refreshToken.token);

    await this.refreshTokenRepository.save({
      userId: user.id,
      hashedToken: refreshTokenHash,
      expiresAt: refreshToken.expiresAt,
    });

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      user: toUserResponse(user),
    };
  }

  async login({
    email,
    password,
  }: LoginRequest): Promise<AuthenticationResult> {
    const user = await this.userRepository.findByEmail(email);

    if (user === undefined) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const passwordValid = await this.passwordHasher.verify(
      password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const accessToken = await this.tokenProvider.generateAccessToken(user.id);
    const refreshToken = await this.tokenProvider.generateRefreshToken(user.id);

    const refreshTokenHash = await this.passwordHasher.hash(refreshToken.token);

    await this.refreshTokenRepository.save({
      userId: user.id,
      hashedToken: refreshTokenHash,
      expiresAt: refreshToken.expiresAt,
    });

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      user: toUserResponse(user),
    };
  }

  async refresh({
    refreshToken,
  }: RefreshRequest): Promise<AuthenticationResult> {
    const refreshTokenHash = await this.passwordHasher.hash(refreshToken);

    const { userId } =
      await this.tokenProvider.verifyRefreshToken(refreshToken);

    const storedToken = await this.refreshTokenRepository.findByUserId(userId);

    if (storedToken === null || storedToken === undefined) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const isTokenMatched = await this.passwordHasher.verify(
      refreshToken,
      storedToken.hashedToken,
    );

    if (!isTokenMatched) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const user = await this.userRepository.findByUserId(userId);

    if (user === undefined) {
      throw new UnauthorizedError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const accessToken = await this.tokenProvider.generateAccessToken(userId);

    const newRefreshToken =
      await this.tokenProvider.generateRefreshToken(userId);

    const newRefreshTokenHash = await this.passwordHasher.hash(
      newRefreshToken.token,
    );

    await this.refreshTokenRepository.save({
      userId,
      hashedToken: newRefreshTokenHash,
      expiresAt: newRefreshToken.expiresAt,
    });

    return {
      accessToken: accessToken.token,
      refreshToken: newRefreshToken.token,
      user: toUserResponse(user),
    };
  }

  async logout(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteByUserId(userId);
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepository.findByUserId(userId);

    if (user === undefined) {
      throw new UnauthorizedError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    return toUserResponse(user);
  }
}
