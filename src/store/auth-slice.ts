import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  loading: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string | null }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("accessToken", JSON.stringify(state.accessToken));
      console.log(state.accessToken);
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setLoading, setCredentials, setUser, logout } =
  authSlice.actions;
export default authSlice.reducer;
