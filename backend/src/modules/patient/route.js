import express from "express";
import { patientList } from "./patientController.js";
import { verifyToken } from "../../middleware/auth.js";

const router = express.Router();

// GET /api/patients
router.get("/patients", verifyToken, patientList);

export default router;
