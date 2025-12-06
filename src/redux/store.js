import { configureStore } from "@reduxjs/toolkit";
import { SignupReducer } from "./features/SignUp/SignupSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    signup: SignupReducer,
  },
});

export const useAppDispatch = () => useDispatch();
