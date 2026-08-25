import { User } from "../../domain/User";
import { UserResponse } from "./UserResponse";

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
