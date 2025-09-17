import mongoose from "mongoose";

async function connectDb(mongo_url) {
  try {
    await mongoose.connect(mongo_url);
    console.log("MongoDB Connected ✅");

    mongoose.connection.on("error", (err) => {
      console.log(`🚫 MongoDB Connection error: ${err.message}`);
      process.exit(1);
    });
  } catch (err) {
    console.log("MongoDB Error:", err);
    process.exit(1);
  }
}

export default connectDb;
