import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import type { AppDispatch } from "@/app/store";
import { ResetPasswordPayload, updatePassword } from "./resetPasswordApi";

interface AxiosErrorShape {
  response?: {
    data?: {
      message?: string;
      error?: unknown;
    };
  };
}

interface ResetPasswordState {
  loading: boolean;
  data: object;
  success: boolean;
  error: string | null;
}

const initialState: ResetPasswordState = {
  loading: false,
  data: {},
  success: false,
  error: null,
};

export const resetPasswordSlice = createSlice({
  name: "ResetPassword",
  initialState,
  reducers: {
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    resetPasswordSuccess: (state, action: PayloadAction<object>) => {
      state.loading = false;
      state.data = action.payload;
      state.success = true;
      state.error = null;
    },
    resetPasswordFailure: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.data = {};
      state.success = false;
      state.error = action.payload;
    },
    clearResetPasswordState: (state) => {
      state.loading = false;
      state.data = {};
      state.success = false;
      state.error = null;
    },
  },
});

export const resetPasswordAction =
  (email: string, data: ResetPasswordPayload) =>
  async (dispatch: AppDispatch) => {
    dispatch(resetPasswordRequest());

    try {
      const res = await updatePassword(email, data);

      if (res.status === 200) {
        toast.success(res.data?.message || "Password updated successfully!", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        dispatch(resetPasswordSuccess(res.data));
        return;
      }

      const fallbackMessage = "Failed to update password";
      toast.error(fallbackMessage, {
        position: "bottom-center",
        duration: 1500,
      });
      dispatch(resetPasswordFailure(fallbackMessage));
    } catch (error) {
      const errorobj = error as AxiosErrorShape;
      const errorMessage =
        errorobj.response?.data?.message ||
        (typeof errorobj.response?.data?.error === "string"
          ? errorobj.response.data.error
          : null) ||
        "Failed to update password";

      if (
        errorobj.response?.data?.error &&
        typeof errorobj.response.data.error === "object"
      ) {
        const allErrors = Object.values(
          errorobj.response.data.error as Record<string, unknown[]>,
        )
          .flat()
          .join(", ");
        toast.error(allErrors, {
          position: "bottom-center",
          duration: 1500,
        });
        dispatch(resetPasswordFailure(allErrors));
      } else {
        toast.error(String(errorMessage), {
          position: "bottom-center",
          duration: 1500,
        });
        dispatch(resetPasswordFailure(String(errorMessage)));
      }
    }
  };

export const {
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  clearResetPasswordState,
} = resetPasswordSlice.actions;

export const ResetPasswordReducer = resetPasswordSlice.reducer;
