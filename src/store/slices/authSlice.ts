import { removeToken, storeToken } from "@/services/APIInstance";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  name: string | null;
}

const initialState: AuthState = {
  token: null,
  name: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; name: string }>
    ) => {
      storeToken(action.payload.token);
      state.name = action.payload.name;
    },

    clearUserData: (state) => {
      state.name = null;
      removeToken();
    },
  },
});

export const { setAuth, clearUserData } = authSlice.actions;
export default authSlice.reducer;
