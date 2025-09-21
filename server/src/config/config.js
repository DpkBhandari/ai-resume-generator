import dotenv from "dotenv";
dotenv.config();

const requiredEnvs = ["MONGO_URL", "JWT_SECRET", "EMAIL", "PASS_EMAIL"];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    console.error(`❌ Missing required environment variable: ${env}`);
    process.exit(1);
  }
});
const config = {
  port: process.env.PORT || 5000,
  mongo_url: process.env.MONGO_URL,
  phase: process.env.PHASE || "development",
  salt: process.env.SALT || 12,
  jwt_secret: process.env.JWT_SECRET,
  email: process.env.EMAIL,
  pass_email: process.env.PASS_EMAIL,
};

export default Object.freeze(config);
