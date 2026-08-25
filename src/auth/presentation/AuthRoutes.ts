import { Router } from "express";
import { AuthController } from "./AuthController";
import { validateRegisterRequest } from "../validation/validateRegisterRequest";
import { validateLoginRequest } from "../validation/validateLoginRequest";
import { validateRefreshRequest } from "../validation/validateRefreshRequest";
import { AuthenticationMiddleware } from "../../common/authentication/AuthenticationMiddleware";

export function createAuthRoutes(
  authController: AuthController,
  authenticationMiddleware: AuthenticationMiddleware,
): Router {
  const router = Router();

  router.post(
    "/register",
    validateRegisterRequest,
    authController.register.bind(authController),
  );

  router.post(
    "/login",
    validateLoginRequest,
    authController.login.bind(authController),
  );

  router.post(
    "/refresh",
    validateRefreshRequest,
    authController.refresh.bind(authController),
  );

  router.post(
    "/logout",
    authenticationMiddleware.authenticate.bind(authenticationMiddleware),
    authController.logout.bind(authController),
  );

  router.get(
    "/me",
    authenticationMiddleware.authenticate.bind(authenticationMiddleware),
    authController.currentUser.bind(authController),
  );

  return router;
}
