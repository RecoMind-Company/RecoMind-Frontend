import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  VerificationFunction,
  ResendCodeFunction,
  resetState,
} from "../redux/features/Verification/VerificationSlice";
import Key from "../assets/images/Key.png";

interface LocationState {
  email?: string;
}

const Verification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [touched, setTouched] = useState({
    email: false,
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const { isloading, success } = useAppSelector((state) => state.verification);

  const [counter, setCounter] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (state?.email) {
      setEmail(state.email);
    }
  }, [state]);

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

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    const digit = value.slice(-1);
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < otp.length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();
    if (/^\d{4}$/.test(pasted)) {
      setOtp(pasted.split(""));
      inputRefs.current[otp.length - 1]?.focus();
    }
  };

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isOtpFilled = otp.join("").length === 4;
  const isFormValid = isEmailValid(email) && isOtpFilled;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    const code = otp.join("");
    const data = {
      email,
      code,
    };

    dispatch(VerificationFunction(data));
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetState());
        navigate("/reset-password", { state: { email } });
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
            src={Key}
            alt="Key Illustration"
            className="w-75 sm:w-100 md:w-125 lg:w-136.75 h-auto "
          />
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-4 w-full max-w-150 bg-(--Primary) p-6 sm:p-10 md:p-18.5 rounded-lg shadow-2xl">
          <h1 className="text-5xl font-normal mb-4 text-(--Secondary)">
            Verification Code
          </h1>
          <p className="text-start font-medium text-xl text-(--font_primary) mb-4">
            A verification code has been sent to your Email. Enter the code to
            continue.
          </p>

          <form onSubmit={handleVerify} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-(--font_primary) font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-(--border_color) w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  disabled={isloading}
                  className={`w-full bg-transparent border rounded-md py-2 pl-10 pr-10 focus:outline-none transition-all disabled:opacity-50 ${
                    touched.email && !isEmailValid(email)
                      ? "border-(--error)"
                      : "border-(--border_color) focus:border-(--Secondary)"
                  }`}
                />
                {touched.email && isEmailValid(email) && (
                  <CheckCircle
                    size={20}
                    className="absolute right-3 top-3 text-(--success)"
                  />
                )}
                {touched.email && !isEmailValid(email) && email.length > 0 && (
                  <AlertCircle
                    size={20}
                    className="absolute right-3 top-3 text-(--error)"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-(--font_primary) font-medium">
                Verification Code
              </label>
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    disabled={isloading}
                    className="w-15 h-15 text-center text-3xl font-medium rounded-lg border-2 bg-transparent text-(--font_primary) transition duration-150 focus:ring-0 outline-none border-(--border_color) focus:border-(--Secondary)"
                  />
                ))}
              </div>
            </div>

            <div className="text-base font-normal text-(--font_Primary) mb-2">
              Didn't receive a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || !email}
                className={`font-medium underline transition-all ${
                  canResend && email
                    ? "text-(--Secondary) hover:opacity-80"
                    : "text-gray-500 cursor-not-allowed no-underline"
                }`}
              >
                Resend Code
              </button>
              {!canResend && (
                <span className="text-(--Secondary)">
                  {" "}
                  in <strong>{counter}</strong> second{counter !== 1 && "s"}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isloading || !isFormValid}
              className="w-full rounded-lg py-3 font-semibold text-xl transition-all bg-(--Secondary) text-(--Primary) hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isloading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Verification;
