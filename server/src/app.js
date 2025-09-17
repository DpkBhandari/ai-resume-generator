import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", userRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    error: "Route not found",
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Server Started ....</h1>");
});

app.use(globalErrorHandler);

export default app;
