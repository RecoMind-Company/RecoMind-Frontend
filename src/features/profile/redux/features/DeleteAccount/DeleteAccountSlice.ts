import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosaccount } from "../../../config";
import toast from "react-hot-toast";

interface AxiosErrorShape {
  response?: {
    data?: {
      message?: string;
      error?: unknown;
    };
  };
}

interface DeleteAccountState {
  isloading: boolean;
  data: object;
  success: boolean;
  error: string | null;
}

const initialState: DeleteAccountState = {
  isloading: false,
  data: {},
  success: false,
  error: null,
};

export const DeleteAccountFunction = createAsyncThunk(
  "DeleteAccount/deleteAccount",
  async (id: string, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const token = localStorage.getItem("token");

      const res = await axiosaccount.delete(`/${id}`, {
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
      const errorobj = error as AxiosErrorShape;
      const errorMessage =
        errorobj.response?.data?.message ||
        (typeof errorobj.response?.data?.error === "string"
          ? errorobj.response.data.error
          : null) ||
        "Failed to delete account";

      toast.error(String(errorMessage), {
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
    builder.addCase(DeleteAccountFunction.pending, (state) => {
      state.isloading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(DeleteAccountFunction.fulfilled, (state, action) => {
      state.isloading = false;
      state.data = action.payload as object;
      state.success = true;
      state.error = null;
    });
    builder.addCase(DeleteAccountFunction.rejected, (state, action) => {
      state.isloading = false;
      state.data = {};
      state.success = false;
      state.error = action.payload as string | null;
    });
  },
});

export const { resetState } = deleteAccountSlice.actions;
export const DeleteAccountReducer = deleteAccountSlice.reducer;
