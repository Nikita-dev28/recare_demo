import { deleteMethod, getMethod, postMethod, putMethod } from "./APIInstance";

//Admin Login
export const loginApi = async (data) => {
  try {
    const response = await postMethod("/login", data);
    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};

//Admin Login
export const patientListApi = async () => {
  try {
    const response = await getMethod("/patients");
    return response;
  } catch (error) {
    console.error("Patient List API Error:", error);
    throw error;
  }
};
