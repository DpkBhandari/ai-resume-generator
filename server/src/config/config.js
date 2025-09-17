import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongo_url: process.env.MONGO_URL,
  phase: process.env.PHASE || "development",
  salt: process.env.SALT || 12,
  jwt_secret : process.env.JWT_SECRET,
};

export default Object.freeze(config);
