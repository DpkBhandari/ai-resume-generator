import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongo_url: process.env.MONGO_URL,
};

export default Object.freeze(config);
