import check from "../assets/images/check.png";
import { useNavigate } from "react-router-dom";

const Completed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center text-[var(--font_primary)] bg-[var(--bg_primary)] p-6">
      {/* Main Container */}
      <div className="flex flex-col items-center text-center gap-8 w-full">
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-medium text-[var(--font_primary)]">
          Setup Complete!
        </h1>

        {/* Checkmark Image */}
        <img
          src={check}
          alt="Setup Complete"
          className="w-[150px] md:w-[392px] "
        />

        {/* Subtitle */}
        <p className="text-lg sm:text-3xl font-medium text-[var(--font_primary)]">
          Let’s make your company thrive!
        </p>

        {/* Button */}
        <button
          className="w-full md:w-[495px] rounded-lg py-3 font-medium text-xl bg-[var(--Secondary)] text-[var(--Primary)] hover:opacity-80 transition-all"
          onClick={() => {
            navigate("/home");
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Completed;
