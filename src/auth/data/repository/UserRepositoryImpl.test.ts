import { describe, expect, it } from "vitest";
import { FakeUserDataSource } from "../../testing/FakeUserDataSource";
import { UserRepositoryImpl } from "./UserRepositoryImpl";
import { NewUser } from "../../domain/NewUser";
import { createUser } from "../../testing/TestData";

describe("UserRepository", () => {
  it("creates user", async () => {
    const dataSource = new FakeUserDataSource();
    const repository = new UserRepositoryImpl(dataSource);
    const newUser = createNewUser();
    const user = createUser();

    const actual = await repository.create(newUser);

    expect(actual).toEqual(user);
  });

  it("finds user by email", async () => {
    const dataSource = new FakeUserDataSource();
    const repository = new UserRepositoryImpl(dataSource);
    const newUser = createNewUser();
    const expectedUser = createUser();

    await repository.create(newUser);

    const existingUser = await repository.findByEmail("john.doe@example.com");

    expect(existingUser).toEqual(expectedUser);
  });

  it("returns no user when email does not exist", async () => {
    const dataSource = new FakeUserDataSource();
    const repository = new UserRepositoryImpl(dataSource);
    const newUser = createNewUser();

    await repository.create(newUser);

    const user = await repository.findByEmail("jane.doe@example.com");

    expect(user).toBeUndefined();
  });

  it("returns user when user id exists", async () => {
    const dataSource = new FakeUserDataSource();
    const repository = new UserRepositoryImpl(dataSource);
    const newUser = createNewUser();
    const expectedUser = createUser();

    await repository.create(newUser);

    const existingUser = await repository.findByUserId("user-001");

    expect(existingUser).toEqual(expectedUser);
  });

  it("returns no user when user id does not exist", async () => {
    const dataSource = new FakeUserDataSource();
    const repository = new UserRepositoryImpl(dataSource);
    const newUser = createNewUser();

    await repository.create(newUser);

    const user = await repository.findByUserId("non-existent-user");

    expect(user).toBeUndefined();
  });
});

function createNewUser(): NewUser {
  return {
    name: "John Doe",
    email: "john.doe@example.com",
    passwordHash: "hashed-Password123",
  };
}
