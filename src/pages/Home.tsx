import { Toaster } from "react-hot-toast";
import { useState } from "react";
import ProfileCompletionBanner from "../UI/ProfileCompletionBanner";
import { FaRocket } from "react-icons/fa";

const Home = () => {
  const [showBanner, setShowBanner] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const profileData = {
    name: storedUser.name || "",
    email: storedUser.email || "",
  };

  return (
    <>
      <Toaster position="top-center" />

      {showBanner && (
        <ProfileCompletionBanner
          userName={profileData.name || "User"}
          completionPercentage={50}
          onClose={() => setShowBanner(false)}
        />
      )}

      {/* Placeholder Section */}
      <div className="w-[88%] md:w-full mx-auto mt-12 max-w-[900px] px-4">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#7EE3FF]/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-[#7EE3FF]/10 rounded-full p-8 border-2 border-[#7EE3FF]/30">
                <FaRocket size={64} className="text-[#7EE3FF]" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Coming Soon
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg text-white/70 mb-6 max-w-[500px]">
            We're working on exciting new features for you. Stay tuned for
            amazing updates!
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-[700px]">
            <div className="bg-[#030E21] border border-[#7EE3FF]/20 rounded-2xl p-6 hover:border-[#7EE3FF]/40 transition-all duration-300">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-white font-medium mb-2">Smart Analytics</h3>
              <p className="text-white/60 text-sm">
                Advanced insights and reporting tools
              </p>
            </div>

            <div className="bg-[#030E21] border border-[#7EE3FF]/20 rounded-2xl p-6 hover:border-[#7EE3FF]/40 transition-all duration-300">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-white font-medium mb-2">AI Features</h3>
              <p className="text-white/60 text-sm">
                Powered by cutting-edge AI technology
              </p>
            </div>

            <div className="bg-[#030E21] border border-[#7EE3FF]/20 rounded-2xl p-6 hover:border-[#7EE3FF]/40 transition-all duration-300">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-white font-medium mb-2">More Tools</h3>
              <p className="text-white/60 text-sm">
                Enhanced productivity features
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-12 flex items-center gap-2">
            <div
              className="w-2 h-2 bg-[#7EE3FF] rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#7EE3FF] rounded-full animate-bounce"
              style={{ animationDelay: "0. 2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#7EE3FF] rounded-full animate-bounce"
              style={{ animationDelay: "0. 4s" }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
