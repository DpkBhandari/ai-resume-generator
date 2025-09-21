import mongoose from "mongoose";

async function connectDb(mongo_url) {
  const connectWithRetry = async () => {
    try {
      await mongoose.connect(mongo_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB Connected");
    } catch (err) {
      console.error("🚫 MongoDB connection failed, retrying in 5s...", err);
      setTimeout(connectWithRetry, 5000); // retry after 5 seconds
    }
  };

  connectWithRetry();

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connection established ✅");
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected. Trying to reconnect...");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`🚨 MongoDB error: ${err.message}`);
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });
}

export default connectDb;
