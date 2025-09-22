import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
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
      select: false,
    },

    isVerified: { type: Boolean, default: false },
    verificationCode: String, // store OTP
    verificationCodeExpires: Date,

    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "moderator"],
    },
  },
  { timestamps: true }
);
userSchema.plugin(mongoosePaginate);
const User = mongoose.model("User", userSchema);
export default User;
