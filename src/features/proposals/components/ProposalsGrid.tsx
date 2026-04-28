import React from "react";
import { ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import type { FilterType } from "../types";
import { setActiveFilter } from "../redux/proposalsSlice";
import ProposalCard from "../components/ProposalCard/ProposalCard";

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Under Review", value: "under_review" },
  { label: "Drafts", value: "draft" },
];

const ProposalsGrid: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { proposals, activeFilter } = useSelector(
    (s: RootState) => s.proposals,
  );

  const isDraftsView = activeFilter === "draft";

  const filtered = proposals.filter((p) => {
    if (activeFilter === "all") return p.status !== "draft";
    return p.status === activeFilter;
  });

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-bold text-base">
          {isDraftsView ? "Your Drafts" : "Your Proposals"}
        </h2>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          {/* All dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background:
                  activeFilter !== "draft"
                    ? "rgba(126,227,255,0.08)"
                    : "rgba(255,255,255,0.04)",
                color: activeFilter !== "draft" ? "#7ee3ff" : "#7f7f7f",
                border:
                  activeFilter !== "draft"
                    ? "1px solid rgba(126,227,255,0.2)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
              onClick={() => {
                // Cycle through non-draft filters
                const nonDraft = FILTERS.filter((f) => f.value !== "draft");
                if (nonDraft.length === 0) return;
                const idx = nonDraft.findIndex((f) => f.value === activeFilter);
                const next = nonDraft[(idx + 1) % nonDraft.length];
                if (!next) return;
                dispatch(setActiveFilter(next.value));
              }}
            >
              {FILTERS.find(
                (f) => f.value === activeFilter && f.value !== "draft",
              )?.label || "All"}
              <ChevronDown size={11} />
            </button>
          </div>

          {/* Drafts tab */}
          <button
            onClick={() =>
              dispatch(
                setActiveFilter(activeFilter === "draft" ? "all" : "draft"),
              )
            }
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
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
      {filtered.length === 0 ? (
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
