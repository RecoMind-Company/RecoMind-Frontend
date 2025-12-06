import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAuth } from "../../../config";
import toast from "react-hot-toast";

const initialState = {
  isloading: false,
  data: {},
};

export const SignupFunction = createAsyncThunk(
  "SignupFunction/Signup",
  async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const res = await axiosAuth.post("/register", data);
      if (res.status === 200) {
        toast.success("Successfully", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
      }
      console.log(res);
    } catch (error) {
      const errorobj = error;
      const errorMessages = errorobj.response?.data.error;
      if (errorMessages) {
        const allErrors = Object.values(errorMessages).flat().join(", ");
        toast.error(allErrors, {
          position: "bottom-center",
          duration: 1500,
        });
        return rejectWithValue(allErrors);
      }
    }
  }
);

export const signupSlice = createSlice({
  name: "Signup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(SignupFunction.pending, (state) => {
      state.isloading = true;
    });
    builder.addCase(SignupFunction.fulfilled, (state, action) => {
      state.isloading = false;
      state.data = action.payload;
    });
    builder.addCase(SignupFunction.rejected, (state) => {
      state.isloading = false;
      state.data = {};
    });
  },
});

export const SignupReducer = signupSlice.reducer;
