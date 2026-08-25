import { UserResponse } from "../presentation/response/UserResponse";

export interface AuthenticationResult {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}
