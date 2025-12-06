import { useState, useEffect } from "react";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import {
  ForgotPasswordFunction,
  resetState,
} from "../redux/features/ForgotPassword/ForgotPasswordSlice";
import Lock from "../assets/images/Lock.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const dispatch = useDispatch();
  const { isloading, success } = useSelector((state) => state.forgotPassword);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const valid = isEmailValid(email);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!valid) {
      return;
    }

    dispatch(ForgotPasswordFunction(email));
  };

  // Handle success
  useEffect(() => {
    if (success) {
      setEmail("");
      setTouched(false);

      // Reset state after showing success message
      setTimeout(() => {
        dispatch(resetState());
      }, 2000);
    }
  }, [success, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  return (
    <>
      {/* Toaster Component */}
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
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center w-full">
          <img
            src={Lock}
            alt="Lock Illustration"
            className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[547px] h-auto md:ml-12"
          />
        </div>

        {/* Right Section (Forgot Password Form) */}
        <div className="flex-1 flex flex-col justify-center items-center gap-4 w-full max-w-[550px] min-h-[550px] bg-[var(--Primary)] p-6 sm:p-10 md:p-[74px] rounded-lg shadow-2xl">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Email Input */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[var(--font_primary)] font-medium w-full text-xl">
                Enter your Email address to Reset Your Password
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[var(--border_color)] w-5 h-5" />

                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  disabled={isloading}
                  className={`w-full bg-transparent border rounded-md py-2 pl-10 pr-10 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    touched && !valid
                      ? "border-[var(--error)] focus:border-[var(--error)]"
                      : "border-[var(--border_color)] focus:border-[var(--Secondary)]"
                  }`}
                />

                {touched && valid && (
                  <CheckCircle
                    size={20}
                    className="absolute right-3 top-3 text-[var(--success)]"
                  />
                )}
                {touched && !valid && email.length > 0 && (
                  <AlertCircle
                    size={20}
                    className="absolute right-3 top-3 text-[var(--error)]"
                  />
                )}
              </div>

              {touched && !valid && email.length > 0 && (
                <p className="text-[var(--error)] text-sm flex items-center gap-1 mt-1">
                  <AlertCircle size={14} /> Please enter a valid email address.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!valid || isloading}
              className={`w-full rounded-lg py-2 font-medium text-[22px] transition-all flex items-center justify-center gap-2 ${
                valid && !isloading
                  ? "bg-[var(--Secondary)] text-[var(--Primary)] hover:opacity-80"
                  : "bg-gray-400 text-[var(--Primary)] cursor-not-allowed"
              }`}
            >
              {isloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
