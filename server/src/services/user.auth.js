import bcrypt from "bcryptjs";
import config from "../config/config.js";

export async function hashPassword(password) {
  const salt = Number(config.salt) || 14;
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}
