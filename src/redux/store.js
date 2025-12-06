import { configureStore } from "@reduxjs/toolkit";
import { SignupReducer } from "./features/SignUp/SignupSlice";
import { ForgotPasswordReducer } from "./features/ForgotPassword/ForgotPasswordSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    signup: SignupReducer,
    forgotPassword: ForgotPasswordReducer,
  },
});

export const useAppDispatch = () => useDispatch();
