import {  taskSlice, TasksReducer } from './../features/tasksBoard/redux/tasksSlice';
import { authSlice } from './../features/auth/redux/authApi';
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

/* ================= TASKS ================= */

/* ================= PROPOSALS ================= */
import { ProposalsReducer } from "@/features/proposals/redux/proposalsSlice";

/* ================= STORE ================= */
export const store = configureStore({
  reducer: {
    signup: SignupReducer,
    signin: SigninReducer,
    forgotPassword: ForgotPasswordReducer,
    verification: VerificationReducer,
    [taskSlice.reducerPath]: taskSlice.reducer,
    tasks: TasksReducer,
    [authSlice.reducerPath]: authSlice.reducer,

    changePassword: ChangePasswordReducer,
    deleteAccount: DeleteAccountReducer,
    getprofile: GetProfileReducer,

    home: HomeReducer,
    proposals: ProposalsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskSlice.middleware, authSlice.middleware),
});

/* ================= TYPES ================= */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;