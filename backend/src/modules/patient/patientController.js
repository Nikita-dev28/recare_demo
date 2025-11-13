import { getAllPatients } from "./service.js";

export const patientList = async (req, res) => {
  try {
    const patients = await getAllPatients();
    res.status(200).json({
      success: true,
      message: "Patient list fetched successfully",
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
