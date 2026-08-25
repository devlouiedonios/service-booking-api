import { JwtTokenProvider } from "../auth/adapter/JwtTokenProvider";
import { AuthModuleDependencies } from "../auth/AuthModule";
import { PrismaRefreshTokenDataSource } from "../auth/data/datasource/PrismaRefreshTokenDataSource";
import { PrismaUserDataSource } from "../auth/data/datasource/PrismaUserDataSource";
import { db } from "../common/db/prisma";
import { BookingModuleDependencies } from "../bookings/BookingModule";
import { PrismaBookingDataSource } from "../bookings/data/datasource/PrismaBookingDataSource";
import { AuthenticationMiddleware } from "../common/authentication/AuthenticationMiddleware";

export interface AppDependencies {
  auth: AuthModuleDependencies;
  bookings: BookingModuleDependencies;
}

export function createAppDependencies(): AppDependencies {
  const tokenProvider = new JwtTokenProvider();

  return {
    auth: {
      userDataSource: new PrismaUserDataSource(db),
      refreshTokenDataSource: new PrismaRefreshTokenDataSource(db),
    },
    bookings: {
      bookingDataSource: new PrismaBookingDataSource(db),
      authenticationMiddleware: new AuthenticationMiddleware(tokenProvider),
    },
  };
}
