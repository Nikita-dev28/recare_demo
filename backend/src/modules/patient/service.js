import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// patient schema
const patientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Patient = mongoose.model("Patient", patientSchema);

// Service: fetch all patients
export const getAllPatients = async () => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    return patients;
  } catch (error) {
    throw new Error("Error fetching patient list: " + error.message);
  }
};
