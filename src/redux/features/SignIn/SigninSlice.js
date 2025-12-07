import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAuth } from "../../../config";
import toast from "react-hot-toast";

const initialState = {
  isloading: false,
  data: {},
  isAuthenticated: false,
  user: null,
};

export const LoginFunction = createAsyncThunk(
  "LoginFunction/Login",
  async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const res = await axiosAuth.post("/login", data);
      if (res.status === 200) {
        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login Successfully", {
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
      const errorMessages = errorobj.response?.data.error;
      if (errorMessages) {
        const allErrors = Object.values(errorMessages).flat().join(", ");
        toast.error(allErrors, {
          position: "bottom-center",
          duration: 1500,
        });
        return rejectWithValue(allErrors);
      } else {
        const errorMessage = errorobj.response?.data?.message || "Login failed";
        toast.error(errorMessage, {
          position: "bottom-center",
          duration: 1500,
        });
        return rejectWithValue(errorMessage);
      }
    }
  }
);

export const signinSlice = createSlice({
  name: "Signin",
  initialState,
  reducers: {
    logout: (state) => {
      state.isloading = false;
      state.data = {};
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        state.isAuthenticated = true;
        state.user = JSON.parse(user);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LoginFunction.pending, (state) => {
      state.isloading = true;
    });
    builder.addCase(LoginFunction.fulfilled, (state, action) => {
      state.isloading = false;
      state.data = action.payload;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    });
    builder.addCase(LoginFunction.rejected, (state) => {
      state.isloading = false;
      state.data = {};
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});

export const { logout, loadUserFromStorage } = signinSlice.actions;
export const SigninReducer = signinSlice.reducer;
