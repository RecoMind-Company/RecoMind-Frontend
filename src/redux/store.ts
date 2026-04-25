import { configureStore } from "@reduxjs/toolkit";
import { SignupReducer } from "./features/SignUp/SignupSlice";
import { SigninReducer } from "./features/SignIn/SigninSlice";
import { ForgotPasswordReducer } from "./features/ForgotPassword/ForgotPasswordSlice";
import { VerificationReducer } from "./features/Verification/VerificationSlice";
import { ChangePasswordReducer } from "./features/ChangePassword/ChangePasswordSlice";
import { DeleteAccountReducer } from "./features/DeleteAccount/DeleteAccountSlice";
import { useDispatch } from "react-redux";
import { GetProfileReducer } from "./features/GetProfile/getProfileSlice";

export const store = configureStore({
  reducer: {
    signup: SignupReducer,
    signin: SigninReducer,
    forgotPassword: ForgotPasswordReducer,
    verification: VerificationReducer,
    changePassword: ChangePasswordReducer,
    deleteAccount: DeleteAccountReducer,
    getprofile: GetProfileReducer,
  },
});

export const useAppDispatch = () => useDispatch();
