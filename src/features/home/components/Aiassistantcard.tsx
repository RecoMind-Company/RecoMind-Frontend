import React from "react";
import { useNavigate } from "react-router-dom";
import Ai_asst_logo from "../../../assets/images/ai_asst_logo.png";

const AIAssistantCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl p-5 mt-4"
      style={{
        background: "linear-gradient(180deg, rgba(126, 227, 255, 0.125) 0%, rgba(42, 58, 90, 0.34) 100%)",
        border: "1px solid rgba(126,227,255,0.15)",
      }}
    > 
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex items-center justify-center"
        >
          <img src={Ai_asst_logo} alt="AI Assistant" />
        </div>
        <span className="text-[#7ee3ff] font-bold text-lg">AI Assistant</span>
      </div>

      <p className="text-white text-xs leading-relaxed mb-4">
        Need help prioritizing your tasks or getting unstuck? I'm here to help.
      </p>

      <button
        id="ai-assistant-btn"
        aria-label="Ask AI Assistant for help"
        onClick={() => navigate("/home/chatbot")}
        className="w-full py-2.5 rounded-[14px] text-sm bg-(--Secondary) text-(--Primary) font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
 
      >
        Ask AI Assistant
      </button>
    </div>
  );
};

export default AIAssistantCard;