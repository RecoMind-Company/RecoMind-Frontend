import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAuth } from "../../../config";
import toast from "react-hot-toast";

interface AxiosErrorShape {
  response?: {
    data?: {
      message?: string;
      error?: unknown;
    };
  };
}

interface ChangePasswordState {
  isloading: boolean;
  data: object;
  success: boolean;
  error: string | null;
}

const initialState: ChangePasswordState = {
  isloading: false,
  data: {},
  success: false,
  error: null,
};

export const ChangePasswordFunction = createAsyncThunk(
  "ChangePassword/changePassword",
  async (data: unknown, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      console.log(data);
      const token = localStorage.getItem("token");
      const res = await axiosAuth.post("/reset-password", data, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (res.status === 200) {
        toast.success(res.data.message || "Password changed successfully!", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        return res.data;
      }
    } catch (error) {
      const errorobj = error as AxiosErrorShape;
      const errorMessage =
        errorobj.response?.data?.message ||
        (typeof errorobj.response?.data?.error === "string"
          ? errorobj.response.data.error
          : null) ||
        "Failed to change password";

      if (
        errorobj.response?.data?.error &&
        typeof errorobj.response.data.error === "object"
      ) {
        const allErrors = Object.values(
          errorobj.response.data.error as Record<string, unknown[]>
        )
          .flat()
          .join(", ");
        toast.error(allErrors, {
          position: "bottom-center",
          duration: 1500,
        });
        return rejectWithValue(allErrors);
      } else {
        toast.error(String(errorMessage), {
          position: "bottom-center",
          duration: 1500,
        });
        return rejectWithValue(errorMessage);
      }
    }
  }
);

export const changePasswordSlice = createSlice({
  name: "ChangePassword",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isloading = false;
      state.data = {};
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(ChangePasswordFunction.pending, (state) => {
      state.isloading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(ChangePasswordFunction.fulfilled, (state, action) => {
      state.isloading = false;
      state.data = action.payload as object;
      state.success = true;
      state.error = null;
    });
    builder.addCase(ChangePasswordFunction.rejected, (state, action) => {
      state.isloading = false;
      state.data = {};
      state.success = false;
      state.error = action.payload as string | null;
    });
  },
});

export const { resetState } = changePasswordSlice.actions;
export const ChangePasswordReducer = changePasswordSlice.reducer;
