import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";

const ProfileCompletionModal = ({ onClose }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobTitle.trim() || !phoneNumber.trim()) {
      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-4 bg-[#030E21] border border-red-500/50 rounded-[24px] px-6 py-5 w-full max-w-[625px] h-[69px] transition-opacity duration-300 ${
              t.visible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              boxShadow: "0px 4px 36px 0px #ACACAC40",
            }}
          >
            <MdError size={24} className="text-red-500 flex-shrink-0" />
            <span className="text-white text-base font-normal">
              Please fill in all fields
            </span>
          </div>
        ),
        {
          duration: 3000,
          position: "top-center",
        }
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);

      toast.custom(
        (t) => (
          <div
            className={`flex items-center gap-4 bg-[#030E21] border border-[#64B883] rounded-[24px] px-6 py-5 w-full max-w-[625px] h-[69px] transition-opacity duration-300 ${
              t.visible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              boxShadow: "0px 4px 36px 0px #ACACAC40",
            }}
          >
            <FaCheckCircle size={24} className="text-[#64B883] flex-shrink-0" />
            <span className="text-white text-base font-normal">
              Your profile has been updated successfully
            </span>
          </div>
        ),
        {
          duration: 4000,
          position: "top-center",
        }
      );
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div
        className="w-[88%] md:w-full mx-auto mt-[76px] max-w-[575px] rounded-3xl border border-[#64B883] p-8 md:p-10 bg-[#030E21] relative overflow-hidden"
        style={{
          boxShadow: "0px 4px 36px 0px rgba(100, 184, 131, 0.3)",
        }}
      >
        {/* Confetti Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="confetti-container">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor:
                    i % 3 === 0
                      ? "#64B883"
                      : i % 3 === 1
                      ? "#7EE3FF"
                      : "#FFC107",
                }}
              />
            ))}
          </div>
        </div>

        {/* <button
          className="absolute top-4 right-4 bg-white/5 border border-white/10 text-white w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-[#64B883]/30 hover:rotate-90 z-10"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button> */}

        <div className="text-center relative z-10">
          {/* Success Icon with Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#64B883]/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-[#64B883]/10 rounded-full p-6 border-2 border-[#64B883] animate-[scaleIn_0.5s_ease-out]">
                <FaCheckCircle size={64} className="text-[#64B883]" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
            Profile Complete!
          </h2>

          <p className="text-base md:text-lg text-white/80 mb-6 animate-[fadeInUp_0.6s_ease-out_0. 3s_both]">
            Your profile is now{" "}
            <span className="text-[#64B883] font-semibold">100% complete</span>
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-3 mb-6 overflow-hidden animate-[fadeInUp_0.6s_ease-out_0. 4s_both]">
            <div
              className="h-full bg-gradient-to-r from-[#64B883] to-[#7EE3FF] rounded-full animate-[progressFill_1. 5s_ease-out_0.5s_both]"
              style={{ width: "100%" }}
            ></div>
          </div>

          {/* Success Description */}
          <p className="text-sm md:text-base text-white/60 mb-8 animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
            You're all set! Your profile information has been saved
            successfully.
          </p>
        </div>

        <style jsx>{`
          @keyframes scaleIn {
            from {
              transform: scale(0);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes progressFill {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          . confetti {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: confettiFall 3s linear infinite;
          }

          @keyframes confettiFall {
            0% {
              top: -10%;
              transform: translateX(0) rotateZ(0deg);
              opacity: 1;
            }
            100% {
              top: 110%;
              transform: translateX(${Math.random() * 100 - 50}px)
                rotateZ(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="w-[88%] md:w-full mx-auto mt-[76px] max-w-[575px] rounded-3xl border border-[#7EE3FF]/30 p-8 md:p-10 bg-[#030E21] relative"
      style={{
        boxShadow: "0px 4px 36px 0px #ACACAC40",
      }}
    >
      <button
        className="absolute top-4 right-4 bg-white/5 border border-white/10 text-white w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-[#7EE3FF]/30 hover:rotate-90"
        onClick={onClose}
      >
        <IoClose size={24} />
      </button>

      <div className="mt-2">
        <h2 className="text-xl md:text-2xl font-medium text-white mb-6 md:mb-8 text-center">
          Let's Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="jobTitle"
              className="text-sm font-medium text-white ml-1"
            >
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              className="bg-white/[0. 03] border border-[#7EE3FF]/30 rounded-xl px-4 md:px-[18px] py-3 md:py-[14px] text-sm md:text-[15px] text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:bg-white/5 focus:border-[#7EE3FF] focus:shadow-[0_0_0_3px_rgba(126,227,255,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="e.g., Product Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="phoneNumber"
              className="text-sm font-medium text-white ml-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className="bg-white/[0.03] border border-[#7EE3FF]/30 rounded-xl px-4 md:px-[18px] py-3 md:py-[14px] text-sm md:text-[15px] text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:bg-white/5 focus:border-[#7EE3FF] focus:shadow-[0_0_0_3px_rgba(126,227,255,0. 1)] disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="e. g., +20 100 *** ****"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="bg-[#7EE3FF] text-[#060B1B] border-none rounded-xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold cursor-pointer transition-all duration-300 mt-2 hover:bg-[#6DD4EE] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
            style={{
              boxShadow: "0 4px 16px rgba(126, 227, 255, 0.3)",
            }}
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
