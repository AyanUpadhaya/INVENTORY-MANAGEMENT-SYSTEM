import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import router from "./routes/v1/index.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

connectDB();
// app.use("/api/auth",authRoutes);
app.use("/api/v1", router);

app.get("/", (req, res) => res.send("Server running"));

app.use(globalErrorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
