import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import userRoutes from "./routes/user.routes.js";
import { authenticate } from "./middlewares/authorization.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

app.use(express.json({ limit: "10kb" }));

// Routes
app.use("/api/v1/users", userRoutes);

app.get("/hello", authenticate, (req, res) => {
  res.send("<h1>Premium Route</h1>");
});

app.get("/", (req, res) => {
  res.send("<h1>Server Started ....</h1>");
});

// ❌ 404 handler should come AFTER routes
app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    error: "Route not found",
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
