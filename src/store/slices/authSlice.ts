import { removeToken, storeToken } from "@/services/APIInstance";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  name: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  name: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      storeToken(action.payload.token); // ONLY cookie
      state.isAuthenticated = true;
      state.name = action.payload.name;
    },

    clearUserData: (state) => {
      state.isAuthenticated = false;
      state.name = null;
      removeToken();
    },
  },
});

export const { setAuth, clearUserData } = authSlice.actions;
export default authSlice.reducer;
