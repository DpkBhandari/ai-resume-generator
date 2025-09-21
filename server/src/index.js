import app from "./app.js";
import config from "./config/config.js";
import connectDb from "./config/db.js";

async function startServer() {
  try {
    console.log(`Environment: ${process.env.PHASE}`);
    console.log("Connecting to MongoDB...");

    // ✅ Await DB connection before starting server
    await connectDb(config.mongo_url);

    const port = config.port;
    const server = app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });

    // ✅  shutdown
    const shutdown = (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    // ✅ Handle unhandled rejections & uncaught exceptions
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error("❌ Server start error:", err);
    process.exit(1);
  }
}

startServer();
