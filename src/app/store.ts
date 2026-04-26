import { configureStore } from "@reduxjs/toolkit";

/* ================= AUTH ================= */
import { SignupReducer } from "@/features/auth/redux/features/SignUp/SignupSlice";
import { SigninReducer } from "@/features/auth/redux/features/SignIn/SigninSlice";
import { ForgotPasswordReducer } from "@/features/auth/redux/features/ForgotPassword/ForgotPasswordSlice";
import { VerificationReducer } from "@/features/auth/redux/features/Verification/VerificationSlice";

/* ================= PROFILE ================= */
import { ChangePasswordReducer } from "@/features/profile/redux/features/ChangePassword/ChangePasswordSlice";
import { DeleteAccountReducer } from "@/features/profile/redux/features/DeleteAccount/DeleteAccountSlice";
import { GetProfileReducer } from "@/features/profile/redux/features/GetProfile/getProfileSlice";

/* ================= HOME ================= */
import { HomeReducer } from "@/features/home/redux/Homeslice";


/* ================= STORE ================= */
export const store = configureStore({
  reducer: {
    signup: SignupReducer,
    signin: SigninReducer,
    forgotPassword: ForgotPasswordReducer,
    verification: VerificationReducer,

    changePassword: ChangePasswordReducer,
    deleteAccount: DeleteAccountReducer,
    getprofile: GetProfileReducer,

    home: HomeReducer,
  },
});

/* ================= TYPES ================= */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;