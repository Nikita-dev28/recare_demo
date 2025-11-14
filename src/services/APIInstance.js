import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import CryptoJS from "crypto-js";
import { clearUserData } from "@/store/slices/authSlice";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPT_SECRET;

export const storeToken = (token) => {
  console.log(" Storing token:", token);
  if (!token) return;

  const encrypted = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();

  setCookie("authToken", encrypted, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export const getAuthToken = () => {
  const encrypted = getCookie("authToken");
  if (!encrypted) return null;

  try {
    return CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    );
  } catch {
    return null;
  }
};

export const removeToken = () => {
  deleteCookie("authToken", { path: "/" });
};

export function getDeviceToken() {
  const key = process.env.NEXT_PUBLIC_DEVICE_TOKEN;

  let deviceToken = getCookie(key);
  if (!deviceToken) {
    deviceToken = uuidv4();
    setCookie(key, deviceToken, {
      path: "/",
      secure: true,
      sameSite: "strict",
    });
  }

  return deviceToken;
}

export function removeDeviceToken() {
  const key = process.env.NEXT_PUBLIC_DEVICE_TOKEN;
  deleteCookie(key, { path: "/" });
}

function getDeviceId() {
  const key = process.env.NEXT_PUBLIC_DEVICE_ID;

  let id = getCookie(key);
  if (!id) {
    id = uuidv4();
    setCookie(key, id);
  }
  return id;
}

function getLanguage() {
  return getCookie("language") || "english";
}

export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

export const setupInterceptors = (store) => {
  apiInstance.interceptors.request.use((config) => {
    const jwtToken = getAuthToken();

    if (jwtToken) {
      config.headers["access-token"] = jwtToken;
    }

    config.headers["device-id"] = getDeviceId();
    config.headers["device-type"] = "web";
    config.headers["device-token"] = getDeviceToken();
    config.headers["language"] = getLanguage();

    return config;
  });

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        removeToken();
        removeDeviceToken();
        store.dispatch(clearUserData());
      }

      return Promise.reject(error);
    }
  );
};

// Utility APIs
export const getMethod = async (url, params) => {
  const response = await apiInstance?.get(url, {
    params,
  });
  return response;
};

export const postMethod = async (url, data) => {
  try {
    const response = await apiInstance.post(url, data);
    return response?.data;
  } catch (error) {
    return error?.response;
  }
};

export const putMethod = async (url, data) => {
  const isFormData = data instanceof FormData;

  const response = await apiInstance.put(url, data, {
    headers: isFormData ? {} : { "Content-Type": "application/json" },
  });

  return response?.data;
};

export const deleteMethod = async (url) => {
  const response = await apiInstance.delete(url);
  return response?.data;
};

export const patchMethod = async (url, data) => {
  const response = await apiInstance.patch(url, data);
  return response?.data;
};
