import express from "express";
import { loginController } from "./loginController.js";

const router = express.Router();

// POST /api/login
router.post("/login", loginController);

export default router;
