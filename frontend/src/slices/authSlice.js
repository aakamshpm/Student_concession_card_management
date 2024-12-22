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
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + 1); // 1 day from now

      const studentData = {
        ...action.payload,
        expiration: expiration.getTime(),
      };

      state.studentInfo = studentData;
      localStorage.setItem("studentInfo", JSON.stringify(studentData));
    },
    clearCredentials: (state) => {
      state.studentInfo = "";
      localStorage.removeItem("studentInfo");
    },
    clearExpiredCredentials: (state, action) => {
      const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
      if (studentInfo && studentInfo.expiration < Date.now()) {
        state.studentInfo = "";
        localStorage.removeItem("studentInfo");
        action.payload = true;
      } else action.payload = false;
    },
  },
});

export const { setCredentials, clearCredentials, clearExpiredCredentials } =
  authSlice.actions;
export default authSlice.reducer;
