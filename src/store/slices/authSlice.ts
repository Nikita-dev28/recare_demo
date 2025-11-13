import { removeToken, storeToken } from "@/services/APIInstance";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  email: string;
}

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      storeToken(action.payload);
    },

    clearUserData: (state) => {
      state.token = null;
      removeToken();
    },
  },
});

export const { setAuth, clearUserData } = authSlice.actions;
export default authSlice.reducer;
