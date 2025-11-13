// /apiInstance.js
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import CryptoJS from "crypto-js";
import { clearUserData } from "@/store/slices/authSlice";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPT_SECRET;

// Token Functions using Cookie
export const storeToken = (token) => {
  const tokenString = typeof token === "string" ? token : token?.token || "";
  const encrypted = CryptoJS.AES.encrypt(tokenString, SECRET_KEY).toString();
  setCookie("authToken", encrypted, {
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export const getAuthToken = () => {
  const encrypted = getCookie("token");
  if (!encrypted) return null;

  const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(
    CryptoJS.enc.Utf8
  );
  return decrypted;
};

export const removeToken = () => {
  deleteCookie("authToken", { path: "/" });
};

export function getDeviceToken() {
  try {
    const key = process.env.NEXT_PUBLIC_DEVICE_TOKEN;
    let deviceToken = getCookie(key);
    if (!deviceToken) {
      deviceToken = crypto?.randomUUID?.() || uuidv4();

      setCookie(key, deviceToken);
    }
    return deviceToken;
  } catch (e) {
    console.error("getDeviceToken error", e);
    return uuidv4();
  }
}

export function removeDeviceToken() {
  const key = process.env.NEXT_PUBLIC_DEVICE_TOKEN;
  deleteCookie(key, { path: "/" });
}

function getDeviceId() {
  let deviceId = getCookie(process.env.NEXT_PUBLIC_DEVICE_ID);
  if (!deviceId) {
    deviceId = crypto?.randomUUID?.() || uuidv4();
    setCookie(process.env.NEXT_PUBLIC_DEVICE_ID, deviceId);
  }
  return deviceId;
}

function getLanguage() {
  const lang = getCookie("language");
  if (lang) return lang;
  return "english";
}

//  Create Axios Instance
export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

// ✅ Axios Interceptors
export const setupInterceptors = (store) => {
  // Single request interceptor
  apiInstance.interceptors.request.use((config) => {
    const state = store.getState();

    // Get JWT token from Redux or Cookie
    const token = state?.auth?.token || getAuthToken();

    if (token) {
      config.headers["access-token"] = token;
    }

    config.headers["device-id"] = getDeviceId();
    config.headers["device-type"] = "web";
    config.headers["device-token"] = getDeviceToken();
    config.headers["language"] = getLanguage();

    return config;
  });

  // Response interceptor
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
