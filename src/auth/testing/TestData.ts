import { User } from "../domain/User";
import { UserResponse } from "../presentation/response/UserResponse";
import { RegisterRequest } from "../service/RegisterRequest";
import { TEST_CREATED_AT } from "./TestConstants";

export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-001",
    name: "John Doe",
    email: "john.doe@example.com",
    passwordHash: "hashed-Password123",
    createdAt: TEST_CREATED_AT,
    ...overrides,
  };
}

export function createUserResponse(
  overrides: Partial<UserResponse> = {},
): UserResponse {
  return {
    id: "user-001",
    name: "John Doe",
    email: "john.doe@example.com",
    ...overrides,
  };
}

export function createRegisterRequest(
  overrides: Partial<RegisterRequest> = {},
): RegisterRequest {
  return {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "Password123",
    ...overrides,
  };
}
