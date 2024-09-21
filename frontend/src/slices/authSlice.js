import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  studentInfo: localStorage.getItem("studentInfo")
    ? JSON.parse(localStorage.getItem("studentInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.studentInfo = action.payload;
      localStorage.setItem("studentInfo", JSON.stringify(action.payload));
    },
    clearCredentials: (state, action) => {
      state.studentInfo = "";
      localStorage.removeItem("studentInfo");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
