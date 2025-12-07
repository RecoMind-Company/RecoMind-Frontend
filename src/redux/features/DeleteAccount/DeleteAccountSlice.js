import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAuth } from "../../../config";
import toast from "react-hot-toast";

const initialState = {
  isloading: false,
  data: {},
  success: false,
  error: null,
};

export const DeleteAccountFunction = createAsyncThunk(
  "DeleteAccount/deleteAccount",
  async (_, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const token = localStorage.getItem("token");
      
      const res = await axiosAuth.delete("/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        toast.success(res.data.message || "Account deleted successfully!", {
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
        errorobj. response?.data?.error ||
        "Failed to delete account";

      toast.error(errorMessage, {
        position: "bottom-center",
        duration: 1500,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteAccountSlice = createSlice({
  name: "DeleteAccount",
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
    builder. addCase(DeleteAccountFunction.pending, (state) => {
      state.isloading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(DeleteAccountFunction.fulfilled, (state, action) => {
      state.isloading = false;
      state.data = action.payload;
      state.success = true;
      state.error = null;
    });
    builder.addCase(DeleteAccountFunction.rejected, (state, action) => {
      state.isloading = false;
      state.data = {};
      state.success = false;
      state.error = action.payload;
    });
  },
});

export const { resetState } = deleteAccountSlice.actions;
export const DeleteAccountReducer = deleteAccountSlice.reducer;