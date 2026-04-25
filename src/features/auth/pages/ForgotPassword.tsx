import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  ForgotPasswordFunction,
  resetState,
} from "../redux/features/ForgotPassword/ForgotPasswordSlice";
import Forget from "../assets/images/Key.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isloading, success } = useAppSelector(
    (state) => state.forgotPassword
  );

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsTouched(true);

    if (isEmailValid(email)) {
      dispatch(ForgotPasswordFunction(email));
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetState());
        navigate("/Verification", { state: { email } });
      }, 2000);
    }
  }, [success, dispatch, navigate, email]);

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
            src={Forget}
            alt="ForgotPassword Illustration"
            className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[547px] h-auto "
          />
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-4 w-full max-w-[600px] bg-[var(--Primary)] p-6 sm:p-10 md:p-[74px] rounded-lg shadow-2xl">
          <h1 className="text-5xl font-normal mb-4 text-[var(--Secondary)]">
            ForgotPassword
          </h1>
          <p className="text-start font-medium text-xl text-[var(--font_primary)] mb-4">
            A verification code will be sent to your email. Enter your email and
            follow the instructions.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[var(--font_primary)] font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[var(--border_color)] w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setIsTouched(true)}
                  disabled={isloading}
                  className={`w-full bg-transparent border rounded-md py-2 pl-10 pr-10 focus:outline-none transition-all disabled:opacity-50 ${
                    isTouched && !isEmailValid(email)
                      ? "border-[var(--error)]"
                      : "border-[var(--border_color)] focus:border-[var(--Secondary)]"
                  }`}
                />
                {isTouched && isEmailValid(email) && (
                  <CheckCircle
                    size={20}
                    className="absolute right-3 top-3 text-[var(--success)]"
                  />
                )}
                {isTouched && !isEmailValid(email) && email.length > 0 && (
                  <AlertCircle
                    size={20}
                    className="absolute right-3 top-3 text-[var(--error)]"
                  />
                )}
              </div>
              {isTouched && !isEmailValid(email) && email.length > 0 && (
                <p className="text-[var(--error)] text-sm mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isloading || !isEmailValid(email)}
              className="w-full rounded-lg py-3 font-semibold text-xl transition-all bg-[var(--Secondary)] text-[var(--Primary)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isloading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Reset Password"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="w-full text-center text-[var(--font_primary)] hover:text-[var(--Secondary)] transition-all font-medium"
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
