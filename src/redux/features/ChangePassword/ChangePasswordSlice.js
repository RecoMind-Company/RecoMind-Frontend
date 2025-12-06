import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAuth } from "../../../config";
import toast from "react-hot-toast";

const initialState = {
  isloading: false,
  data: {},
  success: false,
  error: null,
};

export const ChangePasswordFunction = createAsyncThunk(
  "ChangePassword/changePassword",
  async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const res = await axiosAuth.post("/change-password", data);

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
      const errorobj = error;
      const errorMessage =
        errorobj.response?.data?.message ||
        errorobj.response?.data?.error ||
        "Failed to change password";

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
      state.data = action.payload;
      state.success = true;
      state.error = null;
    });
    builder.addCase(ChangePasswordFunction.rejected, (state, action) => {
      state.isloading = false;
      state.data = {};
      state.success = false;
      state.error = action.payload;
    });
  },
});

export const { resetState } = changePasswordSlice.actions;
export const ChangePasswordReducer = changePasswordSlice.reducer;
