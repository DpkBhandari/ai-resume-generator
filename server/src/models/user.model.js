import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailExriry: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "moderator"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
