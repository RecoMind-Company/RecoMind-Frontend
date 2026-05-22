import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { schemaResetPassword } from "../validation/Schema";
import {
  clearResetPasswordState,
  resetPasswordAction,
} from "../redux/features/ResetPassword/resetPasswordSlice";
import Key from "../assets/images/Key.png";

interface LocationState {
  email?: string;
}

interface ResetPasswordFormData {
  newPassword: string;
  confirmNewPassword: string;
}

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const email = state?.email || "";

  const { loading, success, error } = useAppSelector(
    (appState) => appState.resetPassword,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schemaResetPassword) as any,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!email) {
      navigate("/forgotpassword");
    }
  }, [email, navigate]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!email) return;
    dispatch(resetPasswordAction(email, data));
  };

  useEffect(() => {
    if (success) {
      const timeoutId = setTimeout(() => {
        dispatch(clearResetPasswordState());
        navigate("/completed");
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearResetPasswordState());
    };
  }, [dispatch]);

  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        }}
      />

      <div className="container min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 p-6 md:p-8 mx-auto">
        <div className="flex-1 flex flex-col items-center md:items-start justify-center w-full">
          <img
            src={Key}
            alt="Reset Password Illustration"
            className="w-75 sm:w-100 md:w-125 lg:w-136.75 h-auto "
          />
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-4 w-full max-w-150 bg-(--Primary) p-6 sm:p-10 md:p-18.5 rounded-lg shadow-2xl">
          <h1 className="text-5xl font-normal mb-4 text-(--Secondary)">
            Reset Password
          </h1>
          <p className="text-start font-medium text-xl text-(--font_primary) mb-4">
            Create a new password for your account.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2 w-full">
              <label className="text-(--font_primary) font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  disabled={loading}
                  {...register("newPassword")}
                  className={`w-full bg-transparent border rounded-md py-2 px-4 pr-10 focus:outline-none transition-all disabled:opacity-50 ${
                    errors.newPassword
                      ? "border-(--error)"
                      : "border-(--border_color) focus:border-(--Secondary)"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-(--border_color)"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-(--error) text-sm flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-(--font_primary) font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  disabled={loading}
                  {...register("confirmNewPassword")}
                  className={`w-full bg-transparent border rounded-md py-2 px-4 pr-10 focus:outline-none transition-all disabled:opacity-50 ${
                    errors.confirmNewPassword
                      ? "border-(--error)"
                      : "border-(--border_color) focus:border-(--Secondary)"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-(--border_color)"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-(--error) text-sm flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-(--error) text-sm flex items-center gap-1">
                <AlertCircle size={14} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !isValid}
              className="w-full rounded-lg py-3 font-semibold text-xl transition-all bg-(--Secondary) text-(--Primary) hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
