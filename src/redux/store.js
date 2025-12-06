import { configureStore } from "@reduxjs/toolkit";
import { SignupReducer } from "./features/SignUp/SignupSlice";
import { ForgotPasswordReducer } from "./features/ForgotPassword/ForgotPasswordSlice";
import { VerificationReducer } from "./features/Verification/VerificationSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    signup: SignupReducer,
    forgotPassword: ForgotPasswordReducer,
    verification: VerificationReducer,
  },
});

export const useAppDispatch = () => useDispatch();
