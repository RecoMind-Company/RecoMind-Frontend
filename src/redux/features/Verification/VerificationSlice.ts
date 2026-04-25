import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAuth } from "../../../config";
import toast from "react-hot-toast";

const initialState = {
  isloading: false,
  data: {},
  success: false,
  error: null,
};

export const VerificationFunction = createAsyncThunk(
  "Verification/verify",
  async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const res = await axiosAuth.post("/verify", data);
      console.log("Verification response:", res);

      if (res.status === 200) {
        toast.success(res.data.message || "Verification successful!", {
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
      const errorobj = error;
      const errorMessage =
        errorobj.response?.data?.message ||
        errorobj.response?.data?.error ||
        "Verification failed";

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

// Resend Code Function
export const ResendCodeFunction = createAsyncThunk(
  "Verification/resendCode",
  async (email, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const res = await axiosAuth.post("/resend-code", { email });

      if (res.status === 200) {
        toast.success(res.data.message || "Code resent successfully!", {
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
      const errorMessage =
        error.response?.data?.message || "Failed to resend code";

      toast.error(errorMessage, {
        position: "bottom-center",
        duration: 1500,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

export const verificationSlice = createSlice({
  name: "Verification",
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
    // Verification
    builder.addCase(VerificationFunction.pending, (state) => {
      state.isloading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(VerificationFunction.fulfilled, (state, action) => {
      state.isloading = false;
      state.data = action.payload;
      state.success = true;
      state.error = null;
    });
    builder.addCase(VerificationFunction.rejected, (state, action) => {
      state.isloading = false;
      state.data = {};
      state.success = false;
      state.error = action.payload;
    });

    // Resend Code
    builder.addCase(ResendCodeFunction.pending, (state) => {
      state.isloading = true;
    });
    builder.addCase(ResendCodeFunction.fulfilled, (state) => {
      state.isloading = false;
    });
    builder.addCase(ResendCodeFunction.rejected, (state) => {
      state.isloading = false;
    });
  },
});

export const { resetState } = verificationSlice.actions;
export const VerificationReducer = verificationSlice.reducer;
