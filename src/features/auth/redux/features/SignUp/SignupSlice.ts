import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAuth } from "../../../config";
import toast from "react-hot-toast";

const initialState = {
  isloading: false,
  data: {},
  success: false,
};

export const SignupFunction = createAsyncThunk(
  "SignupFunction/Signup",
  async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      console.log(data);
      const res = await axiosAuth.post("/register", data);
      if (res.status === 200) {
        toast.success("Successfully registered!", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        return res.data;
      }
    } catch (error) {
      const errorobj = error;
      console.log(errorobj);
      const errorMessages = errorobj.response?.data;
      if (errorMessages) {
        toast.error(errorMessages, {
          position: "bottom-center",
          duration: 1500,
        });
        return rejectWithValue(errorMessages);
      }
    }
  }
);

export const signupSlice = createSlice({
  name: "Signup",
  initialState,
  reducers: {
    resetSignupState: (state) => {
      state.isloading = false;
      state.data = {};
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(SignupFunction.pending, (state) => {
      state.isloading = true;
      state.success = false;
    });
    builder.addCase(SignupFunction.fulfilled, (state, action) => {
      state.isloading = false;
      state.data = action.payload;
      state.success = true;
      setTimeout(() => {
        location.replace("/home");
      }, 2000);
    });
    builder.addCase(SignupFunction.rejected, (state) => {
      state.isloading = false;
      state.data = {};
      state.success = false;
    });
  },
});

export const { resetSignupState } = signupSlice.actions;
export const SignupReducer = signupSlice.reducer;
