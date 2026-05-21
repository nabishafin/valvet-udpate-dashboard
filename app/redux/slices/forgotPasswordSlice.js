import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resetEmail: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setResetEmail: (state, action) => {
      state.resetEmail = action.payload;
    },
    clearResetEmail: (state) => {
      state.resetEmail = null;
    },
  },
});

export const { setResetEmail, clearResetEmail } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
