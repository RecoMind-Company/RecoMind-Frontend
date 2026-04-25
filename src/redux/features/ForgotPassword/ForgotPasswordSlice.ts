import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAuth } from "../../../config";
import toast from "react-hot-toast";

const initialState = {
  isloading: false,
  data: {},
  success: false,
  error: null,
};

export const ForgotPasswordFunction = createAsyncThunk(
  "ForgotPassword/forgetPassword",
  async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      console.log(data);

      const res = await axiosAuth.post("/forget-password", { email: data });

      if (res.status === 200) {
        toast.success(res.data.message || "Reset email sent successfully!", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        setTimeout(() => {
          window.location.href = "/verification";
        }, 1500);
        return res.data;
      }
    } catch (error) {
      const errorobj = error;
      const errorMessage =
        errorobj.response?.data?.message ||
        errorobj.response?.data?.error ||
        "Failed to send reset email";

      if (
        errorobj.response?.data?.error &&
        typeof errorobj.response.data.error === "object"
      ) {
        const allErrors = Object.values(errorobj.response.data.error)
          .flat()
          .join(", ");
        toast.error(allErrors, {
          position: "bottom-center",
          duration: 1500,
        });
        return rejectWithValue(allErrors);
      } else {
        toast.error(errorMessage, {
          position: "bottom-center",
          duration: 1500,
        });
        return rejectWithValue(errorMessage);
      }
    }
  }
);

export const forgotPasswordSlice = createSlice({
  name: "ForgotPassword",
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
    builder.addCase(ForgotPasswordFunction.pending, (state) => {
      state.isloading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(ForgotPasswordFunction.fulfilled, (state, action) => {
      state.isloading = false;
      state.data = action.payload;
      state.success = true;
      state.error = null;
    });
    builder.addCase(ForgotPasswordFunction.rejected, (state, action) => {
      state.isloading = false;
      state.data = {};
      state.success = false;
      state.error = action.payload;
    });
  },
});

export const { resetState } = forgotPasswordSlice.actions;
export const ForgotPasswordReducer = forgotPasswordSlice.reducer;
