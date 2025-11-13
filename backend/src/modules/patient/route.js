import express from "express";
import { patientList } from "./patientController.js";

const router = express.Router();

// GET /api/patients
router.get("/patients", patientList);

export default router;
