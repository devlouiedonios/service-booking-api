import "dotenv/config";

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error("Port must be a valid integer.");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL!,
  clientOrigin: process.env.CLIENT_ORIGIN!,
};
