"use client";
import {
  deleteCookie,
  getCookie,
  getLocalStorage,
  removeLocalStorage,
} from "@/components/LocalStorage/LocalStorage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: getLocalStorage("token") || null,
  user: getLocalStorage("user") || null,
  refreshtoken: getCookie("refreshtoken") || null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshtoken = action.payload.refreshtoken;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshtoken = null;
      removeLocalStorage("token");
      removeLocalStorage("user");
      deleteCookie("refreshToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
