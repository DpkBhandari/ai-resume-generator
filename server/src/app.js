import express from "express";
import helmet from "helmet"; // Security
import morgan from "morgan"; // Logs
import cors from "cors"; // who can acces our apis

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("<h1>Server Started ....</h1>");
});

export default app;
