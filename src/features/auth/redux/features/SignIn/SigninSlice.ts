import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAuth } from "../../../config";
import toast from "react-hot-toast";

interface AxiosErrorShape {
  response?: {
    data?: {
      message?: string;
      error?: unknown;
    };
  };
}

interface SigninState {
  isloading: boolean;
  data: object;
  isAuthenticated: boolean;
  user: object | null;
}

const initialState: SigninState = {
  isloading: false,
  data: {},
  isAuthenticated: false,
  user: null,
};

export const LoginFunction = createAsyncThunk(
  "LoginFunction/Login",
  async (data: unknown, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const res = await axiosAuth.post("/login", data);
      if (res.status === 200) {
        console.log(res);
        const { token } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.data));

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
      const errorobj = error as AxiosErrorShape;
      const errorMessages = errorobj.response?.data?.error;
      if (errorMessages) {
        const allErrors = Object.values(errorMessages as Record<string, unknown[]>).flat().join(", ");
        toast.error(allErrors, {
          position: "bottom-center",
          duration: 1500,
        });
        return rejectWithValue(allErrors);
      } else {
        const errorMessage =
          (error as AxiosErrorShape).response?.data?.message || "Login failed";
        toast.error(String(errorMessage), {
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
      state.data = action.payload as object;
      state.isAuthenticated = true;
      state.user = (action.payload as { user: object }).user;
      setTimeout(() => {
        location.replace("/home");
      }, 2000);
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
