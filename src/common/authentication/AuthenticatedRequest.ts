import { Request } from "express";
import { AuthenticatedUser } from "./AuthenticatedUser";

export interface AuthenticatedRequest extends Request {
  authenticatedUser: AuthenticatedUser;
}
