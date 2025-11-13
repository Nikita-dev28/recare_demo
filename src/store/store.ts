"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";

import authReducer from "./slices/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  transforms: [
    encryptTransform({
      secretKey: process.env.NEXT_PUBLIC_PERSIST_SECRET || "default-key",
      onError: (err) => console.error("Encryption error:", err),
    }),
  ],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// ✅ TypeScript helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
