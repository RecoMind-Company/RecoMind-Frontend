import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import type { FilterType, Proposal } from "../types";
import {
  useGetDraftProposalsQuery,
  useGetAcceptedPlansQuery,
  useGetRejectedProposalsQuery,
  useGetUnderReviewProposalsQuery,
} from "../../tasksBoard/redux/tasksSlice";
import { setActiveFilter } from "../redux/proposalsSlice";
import ProposalCard from "../components/ProposalCard/ProposalCard";

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Under Review", value: "under_review" },
];

interface ValidationReportApiItem {
  id: string;
  userQuestion: string;
  content: {
    executive_summary: string;
    validation_decision: string;
    confidence_score: number;
    key_findings: {
      precedent_analysis: string;
      resource_assessment: string;
      market_trends: string;
    };
    recommendations: string[];
    risk_factors: string[];
    next_steps: string[];
  };
  createdBy: string;
  createdAt: string;
  status: string;
}

// ── شكل الـ Accepted (endpoint: /api/Plan/GetByStatus/Accepted) ──
interface AcceptedPlanWrapper {
  value: {
    id: string;
    description: string | null;
    goal: string;
    planType: string | null;
    status: string;
    isApproved: boolean;
    feedback: string | null;
    duration: string;
    modules: unknown[];
  };
  isSuccess: boolean;
  isFailure: boolean;
  error: string | null;
}

const mapValidationReportToProposal = (
  item: ValidationReportApiItem,
  status: "draft" | "rejected" | "under_review",
): Proposal => ({
  id: item.id,
  title: item.userQuestion,
  userQuestion: item.userQuestion,
  description: item.content?.executive_summary || "",
  content: item.content,
  status,
  createdAt: item.createdAt,
  createdBy: item.createdBy,
  comments: [],
  progress: 0,
  plan: item.userQuestion,
  validationReport: item.content?.executive_summary || "",
});

const mapAcceptedToProposal = (wrapper: AcceptedPlanWrapper): Proposal => {
  const item = wrapper.value;
  return {
    id: item.id,
    title: item.goal,
    description: item.description || `Duration: ${item.duration} days`,
    status: "accepted",
    createdAt: new Date().toISOString(),
    comments: [],
    progress: 0,
    plan: item.goal,
    validationReport: "",
  };
};

const ProposalsGrid: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeFilter } = useSelector((s: RootState) => s.proposals);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDraftsView = activeFilter === "draft";

  const {
    data: draftsResponse,
    isLoading: isDraftsLoading,
    isError: isDraftsError,
  } = useGetDraftProposalsQuery(
    { limit: 4, status: 1 },
    { skip: !isDraftsView },
  );

  const {
    data: acceptedResponse,
    isLoading: isAcceptedLoading,
    isError: isAcceptedError,
  } = useGetAcceptedPlansQuery(undefined, { skip: isDraftsView });

  const {
    data: rejectedResponse,
    isLoading: isRejectedLoading,
    isError: isRejectedError,
  } = useGetRejectedProposalsQuery({ limit: 10 }, { skip: isDraftsView });

  const {
    data: underReviewResponse,
    isLoading: isUnderReviewLoading,
    isError: isUnderReviewError,
  } = useGetUnderReviewProposalsQuery({ limit: 10 }, { skip: isDraftsView });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── تحويل كل النتائج لشكل Proposal موحد ──
  const draftProposals: Proposal[] = isDraftsView
    ? ((draftsResponse ?? []) as ValidationReportApiItem[]).map((item) =>
        mapValidationReportToProposal(item, "draft"),
      )
    : [];

  const acceptedProposals: Proposal[] = !isDraftsView
    ? ((acceptedResponse ?? []) as AcceptedPlanWrapper[]).map(mapAcceptedToProposal)
    : [];

  const rejectedProposals: Proposal[] = !isDraftsView
    ? ((rejectedResponse ?? []) as ValidationReportApiItem[]).map((item) =>
        mapValidationReportToProposal(item, "rejected"),
      )
    : [];

  const underReviewProposals: Proposal[] = !isDraftsView
    ? ((underReviewResponse ?? []) as ValidationReportApiItem[]).map((item) =>
        mapValidationReportToProposal(item, "under_review"),
      )
    : [];

  const allNonDraftProposals: Proposal[] = [
    ...acceptedProposals,
    ...rejectedProposals,
    ...underReviewProposals,
  ];

  const filtered = isDraftsView
    ? draftProposals
    : activeFilter === "all"
      ? allNonDraftProposals
      : allNonDraftProposals.filter((p) => p.status === activeFilter);

  const isLoading = isDraftsView
    ? isDraftsLoading
    : isAcceptedLoading || isRejectedLoading || isUnderReviewLoading;

  const isError = isDraftsView
    ? isDraftsError
    : isAcceptedError || isRejectedError || isUnderReviewError;

  const activeLabel =
    FILTERS.find((f) => f.value === activeFilter)?.label ?? "All";

  const handleSelect = (value: FilterType) => {
    dispatch(setActiveFilter(value));
    setDropdownOpen(false);
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-white font-bold text-[28px]"
          style={{ fontFamily: "sans-serif" }}
        >
          {isDraftsView ? "Your Drafts" : "Your Proposals"}
        </h2>

        <div className="flex items-center gap-2">
          {/* ── Dropdown filter ── */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: !isDraftsView
                  ? "rgba(126,227,255,0.08)"
                  : "rgba(255,255,255,0.04)",
                color: !isDraftsView ? "#7ee3ff" : "#7f7f7f",
                border: !isDraftsView
                  ? "1px solid rgba(126,227,255,0.2)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {isDraftsView ? "All" : activeLabel}
              <ChevronDown
                size={11}
                style={{
                  transition: "transform 0.2s",
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 rounded-xl overflow-hidden z-30 min-w-35"
                style={{
                  background: "#0d1b3e",
                  border: "1px solid rgba(126,227,255,0.15)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  animation: "dropDown 0.15s ease",
                }}
              >
                <style>{`
                  @keyframes dropDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                {FILTERS.map((f) => {
                  const isActive = activeFilter === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => handleSelect(f.value)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium transition-colors"
                      style={{
                        color: isActive ? "#7ee3ff" : "#b8adad",
                        background: isActive
                          ? "rgba(126,227,255,0.07)"
                          : "transparent",
                      }}
                      onMouseEnter={(e) =>
                        !isActive &&
                        ((
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.04)")
                      }
                      onMouseLeave={(e) =>
                        !isActive &&
                        ((
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent")
                      }
                    >
                      {f.label}
                      {isActive && <Check size={11} color="#7ee3ff" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Drafts tab ── */}
          <button
            onClick={() =>
              dispatch(setActiveFilter(isDraftsView ? "all" : "draft"))
            }
            className="px-5 py-2 rounded-full text-xs font-semibold transition-all"
            style={{
              background: isDraftsView
                ? "rgba(184,173,173,0.1)"
                : "rgba(255,255,255,0.04)",
              color: isDraftsView ? "#b8adad" : "#7f7f7f",
              border: isDraftsView
                ? "1px solid rgba(184,173,173,0.2)"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Drafts
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-sm" style={{ color: "#7f7f7f" }}>
            {isDraftsView ? "Loading drafts..." : "Loading proposals..."}
          </p>
        </div>
      ) : isError ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(223,93,93,0.2)",
          }}
        >
          <p className="text-sm" style={{ color: "#df5d5d" }}>
            {isDraftsView ? "Failed to load drafts." : "Failed to load proposals."}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-sm" style={{ color: "#7f7f7f" }}>
            {isDraftsView ? "No drafts yet" : "No proposals found"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalsGrid;