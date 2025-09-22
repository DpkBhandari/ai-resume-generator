import User from "../models/user.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import mongoose from "mongoose";
//Get All user in Pagination

export async function getAllUser(req, res, next) {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = Math.max(parseInt(page), 1);
    limit = Math.min(Math.max(parseInt(limit), 1), 100);
    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      select: "-password",
    };

    const user = await User.paginate({}, options);

    return sendResponse(res, 200, "All users Fetched Successfulyy", { user });
  } catch (err) {
    return next(err);
  }
}

// Admin controller
export async function searchUsers(req, res, next) {
  try {
    const { name, id } = req.query;

    if (!name && !id) {
      return res.status(400).json({ message: "Provide name or id to search" });
    }

    const query = [];

    if (id) query.push({ _id: id }); // use _id, not id
    if (name) query.push({ name: { $regex: name, $options: "i" } }); // case-insensitive

    const users = await User.find({ $or: query }).select("-password");

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
}
