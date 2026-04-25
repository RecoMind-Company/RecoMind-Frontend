import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Toaster } from "react-hot-toast";
import {
  VerificationFunction,
  ResendCodeFunction,
  resetState,
} from "../redux/features/Verification/VerificationSlice";
import Key from "../assets/images/Key.png";

const Verification = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isloading, success } = useSelector((state) => state.verification);

  const [counter, setCounter] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [counter]);

  const handleResend = () => {
    if (!canResend || !email) return;
    setCounter(30);
    setCanResend(false);
    dispatch(ResendCodeFunction(email));
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    const digit = value.slice(-1);
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < otp.length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();
    if (/^\d{4}$/.test(pasted)) {
      setOtp(pasted.split(""));
      inputRefs.current[otp.length - 1]?.focus();
    }
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  const doPasswordsMatch = () => {
    return newPassword === confirmNewPassword && newPassword.length > 0;
  };

  const isOtpFilled = otp.join("").length === 4;
  const isFormValid =
    isEmailValid(email) &&
    isPasswordValid(newPassword) &&
    doPasswordsMatch() &&
    isOtpFilled;

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    const code = otp.join("");
    const data = {
      email,
      code,
      newPassword,
      confirmNewPassword,
    };

    dispatch(VerificationFunction(data));
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetState());
        navigate("/completed");
      }, 2000);
    }
  }, [success, dispatch, navigate]);

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
            src={Key}
            alt="Key Illustration"
            className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[547px] h-auto "
          />
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-4 w-full max-w-[600px] bg-[var(--Primary)] p-6 sm:p-10 md:p-[74px] rounded-lg shadow-2xl">
          <h1 className="text-5xl font-normal mb-4 text-[var(--Secondary)]">
            Verification Code
          </h1>
          <p className="text-start font-medium text-xl text-[var(--font_primary)] mb-4">
            A verification code has been sent to your Email. Enter the code and
            set your new password.
          </p>

          <form onSubmit={handleVerify} className="w-full flex flex-col gap-4">
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
                  onBlur={() => setTouched({ ...touched, email: true })}
                  disabled={isloading}
                  className={`w-full bg-transparent border rounded-md py-2 pl-10 pr-10 focus:outline-none transition-all disabled:opacity-50 ${
                    touched.email && !isEmailValid(email)
                      ? "border-[var(--error)]"
                      : "border-[var(--border_color)] focus:border-[var(--Secondary)]"
                  }`}
                />
                {touched.email && isEmailValid(email) && (
                  <CheckCircle
                    size={20}
                    className="absolute right-3 top-3 text-[var(--success)]"
                  />
                )}
                {touched.email && !isEmailValid(email) && email.length > 0 && (
                  <AlertCircle
                    size={20}
                    className="absolute right-3 top-3 text-[var(--error)]"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-[var(--font_primary)] font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, newPassword: true })}
                  disabled={isloading}
                  className={`w-full bg-transparent border rounded-md py-2 px-4 pr-10 focus:outline-none transition-all disabled:opacity-50 ${
                    touched.newPassword && !isPasswordValid(newPassword)
                      ? "border-[var(--error)]"
                      : "border-[var(--border_color)] focus:border-[var(--Secondary)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[var(--border_color)]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.newPassword &&
                !isPasswordValid(newPassword) &&
                newPassword.length > 0 && (
                  <p className="text-[var(--error)] text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> Password must be at least 8
                    characters
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-[var(--font_primary)] font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  onBlur={() =>
                    setTouched({ ...touched, confirmNewPassword: true })
                  }
                  disabled={isloading}
                  className={`w-full bg-transparent border rounded-md py-2 px-4 pr-10 focus:outline-none transition-all disabled:opacity-50 ${
                    touched.confirmNewPassword && !doPasswordsMatch()
                      ? "border-[var(--error)]"
                      : "border-[var(--border_color)] focus:border-[var(--Secondary)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-[var(--border_color)]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {touched.confirmNewPassword &&
                !doPasswordsMatch() &&
                confirmNewPassword.length > 0 && (
                  <p className="text-[var(--error)] text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> Passwords do not match
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[var(--font_primary)] font-medium">
                Verification Code
              </label>
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    ref={(el) => (inputRefs.current[i] = el)}
                    disabled={isloading}
                    className="w-[60px] h-[60px] text-center text-3xl font-medium rounded-lg border-2 bg-transparent text-[var(--font_primary)] transition duration-150 focus:ring-0 outline-none border-[var(--border_color)] focus:border-[var(--Secondary)]"
                  />
                ))}
              </div>
            </div>

            <div className="text-base font-normal text-[var(--font_Primary)] mb-2">
              Didn't receive a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || !email}
                className={`font-medium underline transition-all ${
                  canResend && email
                    ? "text-[var(--Secondary)] hover:opacity-80"
                    : "text-gray-500 cursor-not-allowed no-underline"
                }`}
              >
                Resend Code
              </button>
              {!canResend && (
                <span className="text-[var(--Secondary)]">
                  {" "}
                  in <strong>{counter}</strong> second{counter !== 1 && "s"}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isloading || !isFormValid}
              className="w-full rounded-lg py-3 font-semibold text-xl transition-all bg-[var(--Secondary)] text-[var(--Primary)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isloading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Verify & Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Verification;
