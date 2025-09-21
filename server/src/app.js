import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app = express();

// ✅ Security
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// ✅ Logging (dev only)
if (process.env.PHASE === "development") {
  app.use(morgan("dev"));
}

// ✅ CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// ✅ Body Parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// ✅ API Routes
app.use("/api/v1/users", userRoutes);

// ✅ Home Route
app.get("/", (req, res) =>
  res.json({ status: "success", message: "Server is running" })
);

// ❌ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

// ✅ Global Error Handler
app.use(globalErrorHandler);

export default app;
