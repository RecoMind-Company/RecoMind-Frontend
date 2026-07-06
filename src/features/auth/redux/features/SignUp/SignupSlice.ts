import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

interface SignupState {
  isloading: boolean;
  data: object;
  success: boolean;
}

const initialState: SignupState = {
  isloading: false,
  data: {},
  success: false,
};

export const SignupFunction = createAsyncThunk(
  "SignupFunction/Signup",
  async (data: { email: string; fullName: string; password: string; role: string }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      // Use the auth API endpoint
      const response = await fetch("https://api.recomind.site/api/Authentication/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (response.ok) {
        toast.success("Successfully registered!", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res));
        return res;
      } else {
        const errorMessage = res.message || "Registration failed";
        toast.error(errorMessage, {
          position: "bottom-center",
          duration: 1500,
        });
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      const errorMessage = "Registration failed";
      toast.error(errorMessage, {
        position: "bottom-center",
        duration: 1500,
      });
      return rejectWithValue(errorMessage);
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
      state.data = action.payload as object;
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
