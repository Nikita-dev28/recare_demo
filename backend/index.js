import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import loginRoutes from "./src/modules/login/route.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", loginRoutes);

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://192.168.1.138:${PORT}`)
);
