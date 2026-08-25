import { createApp } from "../app/app";
import { FakeBookingDataSource } from "../bookings/testing/FakeBookingDataSource";
import { AuthenticationMiddleware } from "../common/authentication/AuthenticationMiddleware";

import { FakeRefreshTokenDataSource } from "../auth/testing/FakeRefreshTokenDataSource";
import { FakeTokenProvider } from "../auth/testing/FakeTokenProvider";
import { FakeUserDataSource } from "../auth/testing/FakeUserDataSource";

export function createTestApp() {
  const tokenProvider = new FakeTokenProvider();

  return createApp({
    auth: {
      userDataSource: new FakeUserDataSource(),
      refreshTokenDataSource: new FakeRefreshTokenDataSource(),
    },
    bookings: {
      bookingDataSource: new FakeBookingDataSource(),
      authenticationMiddleware: new AuthenticationMiddleware(tokenProvider),
    },
  });
}
