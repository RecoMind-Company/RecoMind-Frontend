import { useState } from "react";
import { Mail, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import googleIcon from "../assets/images/google.png";
import microsoftIcon from "../assets/images/microsoft.png";
import Ai from "../assets/images/Ai.png";
import password from "../assets/images/password.png";
import { Link, useNavigate } from "react-router-dom";
import { schemaLogin, schemaRegister } from "../validation/Schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/store";
import { SignupFunction } from "../redux/features/SignUp/SignupSlice";
import { LoginFunction } from "../redux/features/SignIn/SigninSlice";
import { Toaster } from "react-hot-toast";

const LogRegForm = ({ title }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const isSignUp = title.toLowerCase().includes("sign");

  const schema = isSignUp ? schemaRegister : schemaLogin;
  const dispatch = useAppDispatch();

  const { isloading: signupLoading } = useSelector((state) => state.signup);
  const { isloading: signinLoading } = useSelector((state) => state.signin);

  const isloading = isSignUp ? signupLoading : signinLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    if (isSignUp) {
      dispatch(SignupFunction(data));
    } else {
      dispatch(LoginFunction(data));
    }
  };

  const isPasswordValid = (pass) => {
    const minLength = pass.length >= 8;
    const upper = /[A-Z]/.test(pass);
    const lower = /[a-z]/.test(pass);
    const number = /[0-9]/.test(pass);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && upper && lower && number && special;
  };

  const passwordValid = isPasswordValid(passwordValue);

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

      <div className="container flex flex-col md:flex-row md:justify-center gap-12 mt-12 md:mt-12 mx-auto h-[90vh] items-center">
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center w-full gap-12">
          <svg
            width="140"
            height="40"
            viewBox="0 0 299 105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG content - same as before */}
          </svg>

          <img
            src={Ai}
            alt="RecoMind Illustration"
            className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[547px] h-auto md:ml-12"
          />
        </div>

        {/* Right Section (Form) */}
        <div className="flex-1 flex flex-col gap-4 w-full max-w-[550px] bg-[var(--Primary)] p-6 sm:p-10 md:px-[74px] md:py-[34px] rounded-3xl shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-normal mb-4 text-center text-[var(--Secondary)]">
            {title}
          </h1>

          {/* Social Buttons */}
          <div className="flex flex-col gap-3">
            <button
              className="flex items-center justify-center gap-2 font-normal text-base md:text-sm lg:text-lg rounded-md py-2 hover:bg-[rgba(126,227,255,0.1)] transition-all relative"
              style={{ border: "1px solid var(--Secondary)" }}
            >
              <img
                src={googleIcon}
                alt="Google"
                className="w-5 h-5 absolute left-4"
              />
              {title} with Google
            </button>

            <button
              className="flex items-center justify-center gap-2 font-normal text-base md:text-sm lg:text-lg rounded-md py-2 hover:bg-[rgba(126,227,255,0.1)] transition-all relative"
              style={{ border: "1px solid var(--Secondary)" }}
            >
              <img
                src={microsoftIcon}
                alt="Microsoft"
                className="w-5 h-5 absolute left-4"
              />
              {title} with Microsoft
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 text-[var(--font_primary)] text-sm mt-4 mb-4 w-full">
            <div className="flex-1 h-px bg-[var(--font_primary)] opacity-40"></div>
            <span className="whitespace-nowrap">Or You Can {title} With</span>
            <div className="flex-1 h-px bg-[var(--font_primary)] opacity-40"></div>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Name Input (Only for Sign Up) */}
            {isSignUp && (
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--font_primary)] font-medium">
                  Name
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-[var(--border_color)] w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    {...register("fullName", { required: true })}
                    className="w-full bg-transparent border border-[var(--border_color)] rounded-md py-2 pl-10 pr-3 focus:outline-none focus:border-[var(--Secondary)] transition-all"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[var(--font_primary)] font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[var(--border_color)] w-5 h-5" />
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full bg-transparent border border-[var(--border_color)] rounded-md py-2 pl-10 pr-3 focus:outline-none focus:border-[var(--Secondary)] transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[var(--font_primary)] font-medium">
                Password
              </label>
              <div className="relative">
                <img
                  src={password}
                  alt="Lock Icon"
                  className="absolute left-3 top-3 w-5 h-5"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  value={passwordValue}
                  {...register("password", { required: true, minLength: 6 })}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  className="w-full bg-transparent border border-[var(--border_color)] rounded-md py-2 pl-10 pr-10 focus:outline-none focus:border-[var(--Secondary)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[var(--font_secondary)]"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Password Info (Only for Sign Up) */}
              {passwordValue && (
                <div
                  className={`flex items-center gap-2 mt-2 text-xs ${
                    passwordValid
                      ? "text-[var(--success)]"
                      : "text-[var(--error)]"
                  }`}
                >
                  {passwordValid ? (
                    <CheckCircle size={16} className="mt-[2px]" />
                  ) : (
                    <AlertCircle size={16} className="mt-[2px]" />
                  )}
                  <p>
                    {passwordValid
                      ? "Your password meets all requirements"
                      : "Password must be at least 8 characters, include uppercase, lowercase letters, numbers, and special characters."}
                  </p>
                </div>
              )}
            </div>

            {isSignUp && (
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--font_primary)] font-medium">
                  Role
                </label>

                <div className="flex items-center gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      className="h-4 w-4 accent-[var(--Secondary)]"
                      {...register("role")}
                    />
                    <span className="text-sm text-[var(--font_primary)]">
                      Admin
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="teamleader"
                      className="h-4 w-4 accent-[var(--Secondary)]"
                      {...register("role")}
                    />
                    <span className="text-sm text-[var(--font_primary)]">
                      Team Leader
                    </span>
                  </label>
                </div>

                {errors.role && (
                  <p className="text-red-500 text-xs">{errors.role.message}</p>
                )}
              </div>
            )}

            {/* Remember & Forgot (Only for Log In) */}
            {!isSignUp && (
              <div className="flex items-center justify-between text-sm text-[var(--font_primary)] flex-wrap gap-2">
                <label className="flex items-center gap-2 font-normal text-base">
                  <input
                    type="checkbox"
                    className="accent-[var(--Secondary)]"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgotpassword"
                  className="text-[var(--Secondary)] font-normal text-base hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isloading}
              className="mt-4 w-full bg-[var(--Secondary)] text-[var(--Primary)] rounded-lg py-2 font-medium text-[22px] hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isloading ? (
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-neutral-tertiary animate-spin fill-brand"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  ></path>
                </svg>
              ) : (
                title
              )}
            </button>

            {/* Switch Between Log In / Sign Up */}
            <div className="text-center text-sm mt-3 text-[var(--font_primary)]">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/"
                    className="text-[var(--Secondary)] font-normal text-lg ! underline"
                  >
                    Log In
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-[var(--Secondary)] font-normal text-lg !underline"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LogRegForm;
