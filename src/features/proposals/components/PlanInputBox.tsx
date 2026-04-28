import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { setPlanInput, startValidation } from "../redux/proposalsSlice";

const PlanInputBox: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    planInput,
    isInputExpanded,
    isValidating,
    validationSteps,
    validationDone,
  } = useSelector((s: RootState) => s.proposals);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setPlanInput(e.target.value));
  };

  const handleValidate = () => {
    if (!planInput.trim() || isValidating) return;
    dispatch(startValidation(planInput));
  };

  const allDone = validationSteps.every((s) => s.done);

  return (
    <div className="mb-10">
      {/* Heading */}
      <h1 className="text-center text-2xl font-bold text-white mb-6">
        Turn ideas into{" "}
        <span style={{ color: "#7ee3ff" }}>real results...</span>
      </h1>

      {/* Input container */}
      <div
        className="rounded-2xl transition-all duration-300 overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1.5px solid ${isInputExpanded || isValidating ? "rgba(126,227,255,0.35)" : "rgba(255,255,255,0.09)"}`,
          boxShadow:
            isInputExpanded || isValidating
              ? "0 0 24px rgba(126,227,255,0.07)"
              : "none",
        }}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={planInput}
          onChange={handleChange}
          disabled={isValidating}
          placeholder="Enter your plan and key goals..."
          rows={isInputExpanded ? 3 : 1}
          className="w-full bg-transparent px-5 py-4 text-sm resize-none outline-none transition-all duration-300"
          style={{
            color: "#eeeeee",
            caretColor: "#7ee3ff",
            lineHeight: "1.6",
          }}
        />

        {/* Validation steps (shown during validating) */}
        {isValidating && (
          <div
            className="px-5 pb-3 space-y-1.5 text-xs"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {validationSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                {step.done ? (
                  <span style={{ color: "#64b883" }}>✓</span>
                ) : (
                  <span
                    className="inline-block w-3 h-3 rounded-full border-2 border-t-transparent animate-spin"
                    style={{
                      borderColor: "#7ee3ff",
                      borderTopColor: "transparent",
                    }}
                  />
                )}
                <span style={{ color: step.done ? "#64b883" : "#b8adad" }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Start Validating button — shown when expanded */}
        {(isInputExpanded || isValidating) && (
          <div className="px-4 pb-4 pt-1">
            <button
              onClick={handleValidate}
              disabled={isValidating || !planInput.trim()}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: isValidating
                  ? "rgba(126,227,255,0.1)"
                  : "rgba(126,227,255,0.12)",
                color: "#7ee3ff",
                border: "1px solid rgba(126,227,255,0.25)",
              }}
            >
              {isValidating ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{
                      borderColor: "#7ee3ff",
                      borderTopColor: "transparent",
                    }}
                  />
                  Start Validating
                </>
              ) : (
                "Start Validating"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanInputBox;
