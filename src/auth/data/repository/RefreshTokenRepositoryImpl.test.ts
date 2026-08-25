import { describe, expect, it } from "vitest";
import { FakeRefreshTokenDataSource } from "../../testing/FakeRefreshTokenDataSource";
import { RefreshTokenRepositoryImpl } from "./RefreshTokenRepositoryImpl";
import { NewRefreshToken } from "../../domain/NewRefreshToken";
import { RefreshToken } from "@prisma/client";
import { TEST_CREATED_AT, TEST_EXPIRES_AT } from "../../testing/TestConstants";

describe("RefreshTokenRepository", () => {
  it("stores refresh token", async () => {
    const dataSource = new FakeRefreshTokenDataSource();
    const repository = new RefreshTokenRepositoryImpl(dataSource);
    const newRefreshToken: NewRefreshToken = {
      userId: "user-001",
      hashedToken: "hashed-token",
      expiresAt: TEST_EXPIRES_AT,
    };

    const expectedRefreshToken: RefreshToken = {
      userId: "user-001",
      hashedToken: "hashed-token",
      expiresAt: TEST_EXPIRES_AT,
      createdAt: TEST_CREATED_AT,
    };

    const savedRefreshToken = await repository.save(newRefreshToken);

    expect(savedRefreshToken).toEqual(expectedRefreshToken);
  });

  it("returns stored refresh token when found", async () => {
    const dataSource = new FakeRefreshTokenDataSource();
    const repository = new RefreshTokenRepositoryImpl(dataSource);
    const newRefreshToken: NewRefreshToken = {
      userId: "user-001",
      hashedToken: "hashed-token",
      expiresAt: TEST_EXPIRES_AT,
    };

    const expectedRefreshToken: RefreshToken = {
      userId: "user-001",
      hashedToken: "hashed-token",
      expiresAt: TEST_EXPIRES_AT,
      createdAt: TEST_CREATED_AT,
    };

    await repository.save(newRefreshToken);

    const foundRefreshToken = await repository.findByUserId("user-001");

    expect(foundRefreshToken).toEqual(expectedRefreshToken);
  });

  it("returns no refresh token when not found", async () => {
    const dataSource = new FakeRefreshTokenDataSource();
    const repository = new RefreshTokenRepositoryImpl(dataSource);

    const foundRefreshToken = await repository.findByUserId("user-001");

    expect(foundRefreshToken).toBeUndefined();
  });

  it("replaces existing refresh token for user", async () => {
    const dataSource = new FakeRefreshTokenDataSource();
    const repository = new RefreshTokenRepositoryImpl(dataSource);

    const initialToken: NewRefreshToken = {
      userId: "user-001",
      hashedToken: "initial-token",
      expiresAt: TEST_EXPIRES_AT,
    };

    const newToken: NewRefreshToken = {
      userId: "user-001",
      hashedToken: "new-token",
      expiresAt: TEST_EXPIRES_AT,
    };

    await repository.save(initialToken);
    await repository.save(newToken);

    const foundRefreshToken = await repository.findByUserId("user-001");

    expect(foundRefreshToken).toEqual({
      userId: "user-001",
      hashedToken: "new-token",
      expiresAt: TEST_EXPIRES_AT,
      createdAt: TEST_CREATED_AT,
    });
  });

  it("deletes refresh token by user ID", async () => {
    const dataSource = new FakeRefreshTokenDataSource();
    const repository = new RefreshTokenRepositoryImpl(dataSource);

    const newRefreshToken: NewRefreshToken = {
      userId: "user-001",
      hashedToken: "hashed-token",
      expiresAt: TEST_EXPIRES_AT,
    };

    await repository.save(newRefreshToken);

    await repository.deleteByUserId("user-001");

    const foundRefreshToken = await repository.findByUserId("user-001");

    expect(foundRefreshToken).toBeUndefined();
  });
});
