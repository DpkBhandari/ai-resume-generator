import express from "express";
import { getAllUser, searchUsers } from "../controllers/admin.controllers.js";
const adminRoutes = express.Router();

adminRoutes.get("/users", getAllUser);
adminRoutes.get("/user/:id", searchUsers);

export default adminRoutes;
