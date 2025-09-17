import User from "../models/user.model.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/user.validator.js";

import { hashPassword, comparePassword } from "../services/user.auth.js";
import { generateToken } from "../services/auth.service.js";
export async function registerUser(req, res, next) {
  try {
    // Validation

    const { value, error } = registerValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { name, email, password } = value;

    // Db Search

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        status: 400,
        message: "user already exists",
      });
    }
    // Password ko Hash
    let hashedPassword = await hashPassword(password);

    // Db Entry

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Responce
    res.json({
      status: 201,
      message: "User Registered Successfull !",
      user: newUser,
    });
  } catch (err) {
    return next(err);
  }
}

// Login user

export async function loginUser(req, res, next) {
  try {
    // Validation

    const { value, error } = loginValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }
    const { email, password } = value;

    // Db Search

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "user not exists",
      });
    }

    const isMatched = await comparePassword(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        status: 401,
        message: "Invalid Credentials",
      });
    }
    const token = generateToken(user);

    res.status(200).json({
      status: 200,
      message: "User Login Successfull !",
      token: token,
    });
  } catch (err) {
    return next(err);
  }
}
