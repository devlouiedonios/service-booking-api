import { createApp } from "./app/app";
import { env } from "./config/env";
import { db } from "./common/db/prisma";
import { createAppDependencies } from "./app/appDependencies";

async function main() {
  await db.$connect();

  const app = createApp(createAppDependencies());

  const server = app.listen(env.port, () => {
    console.log(`Server is running on http://localhost:${env.port}`);
  });

  let isShuttingDown = false;

  async function shutdown(exitCode: number) {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;

    console.log("Shutting down gracefully...");

    server.close(async () => {
      await db.$disconnect();
      process.exit(exitCode);
    });
  }

  process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception:", error);
    shutdown(1);
  });

  process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection:", error);
    shutdown(1);
  });

  process.on("SIGINT", () => {
    shutdown(0);
  });
  process.on("SIGTERM", () => {
    shutdown(0);
  });
}

main().catch(async (error) => {
  console.error("Failed to start application.", error);

  await db.$disconnect();
  process.exit(1);
});
