import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminInfo: localStorage.getItem("adminInfo")
    ? localStorage.getItem("adminInfo")
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + 1);
      const adminData = {
        ...action.payload,
        expiration: expiration.getTime(),
      };

      state.adminInfo = adminData;
      localStorage.setItem("adminInfo", JSON.stringify(adminData));
    },
  },
});

export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;
