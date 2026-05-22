import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ForgotPasswordFunction,
  resetState,
} from "../redux/features/ForgotPassword/ForgotPasswordSlice";
import { schemaForgotPassword } from "../validation/Schema";
import Lock from "../assets/images/Lock.png";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isloading, success } = useAppSelector(
    (state) => state.forgotPassword,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schemaForgotPassword) as any,
    mode: "onTouched",
  });

  const emailValue = watch("email", "");

  const onSubmit = (data: ForgotPasswordFormData) => {
    dispatch(ForgotPasswordFunction(data));
  };

  useEffect(() => {
    if (success) {
      const timeoutId = setTimeout(() => {
        dispatch(resetState());
        navigate("/verification", { state: { email: emailValue } });
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [success, dispatch, navigate, emailValue]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
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
            src={Lock}
            alt="ForgotPassword Illustration"
            className="w-75 sm:w-100 md:w-125 lg:w-136.75 h-auto "
          />
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-4 w-full max-w-150 bg-(--Primary) p-6 sm:p-10 md:p-18.5 rounded-lg shadow-2xl">
          <h1 className="text-xl md:text-5xl font-normal mb-4 text-(--Secondary)">
            ForgotPassword
          </h1>
          <p className="text-start font-medium text-xl text-(--font_primary) mb-4">
            A verification code will be sent to your email. Enter your email and
            follow the instructions.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2 w-full">
              <label className="text-(--font_primary) font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-(--border_color) w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  disabled={isloading}
                  {...register("email")}
                  className={`w-full bg-transparent border rounded-md py-2 pl-10 pr-10 focus:outline-none transition-all disabled:opacity-50 ${
                    errors.email
                      ? "border-(--error)"
                      : "border-(--border_color) focus:border-(--Secondary)"
                  }`}
                />
                {!errors.email && emailValue && (
                  <CheckCircle
                    size={20}
                    className="absolute right-3 top-3 text-(--success)"
                  />
                )}
                {errors.email && (
                  <AlertCircle
                    size={20}
                    className="absolute right-3 top-3 text-(--error)"
                  />
                )}
              </div>
              {errors.email && (
                <p className="text-(--error) text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isloading}
              className="w-full rounded-lg py-3 font-semibold text-xl transition-all bg-(--Secondary) text-(--Primary) hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isloading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Reset Password"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full text-center text-(--font_primary) hover:text-(--Secondary) transition-all font-medium"
            >
              Back to Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
