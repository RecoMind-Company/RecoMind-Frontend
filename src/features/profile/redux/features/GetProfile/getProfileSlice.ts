import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

interface AxiosErrorShape {
  response?: {
    data?: {
      message?: string;
      error?: unknown;
    };
  };
}

interface GetProfileState {
  isloading: boolean;
  data: object;
  success: boolean;
  error: string | null;
}

const initialState: GetProfileState = {
  isloading: false,
  data: {},
  success: false,
  error: null,
};

// ============ Get Profile Thunk ============
export const GetprofileFunction = createAsyncThunk(
  "GetProfile/GetProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://api.recomind.site/api/users/getProfile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data; // SUCCESS
    } catch (error) {
      const errorobj = error as AxiosErrorShape;
      const errorMessage =
        errorobj.response?.data?.message ||
        (typeof errorobj.response?.data?.error === "string"
          ? errorobj.response.data.error
          : null) ||
        "Failed to fetch profile";

      toast.error(String(errorMessage), {
        position: "bottom-center",
        duration: 1500,
      });

      return rejectWithValue(errorMessage);
    }
  }
);

// ============ Slice ============

export const getprofile = createSlice({
  name: "GetProfile",
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetprofileFunction.pending, (state) => {
        state.isloading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(GetprofileFunction.fulfilled, (state, action) => {
        state.isloading = false;
        state.data = action.payload as object;
        state.success = true;
        state.error = null;
      })
      .addCase(GetprofileFunction.rejected, (state, action) => {
        state.isloading = false;
        state.success = false;
        state.data = {};
        state.error = action.payload as string | null;
      });
  },
});

export const { resetState } = getprofile.actions;
export const GetProfileReducer = getprofile.reducer;
