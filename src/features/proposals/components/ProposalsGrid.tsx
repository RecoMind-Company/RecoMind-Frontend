import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
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
];

const ProposalsGrid: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { proposals, activeFilter } = useSelector(
    (s: RootState) => s.proposals,
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDraftsView = activeFilter === "draft";

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

  const filtered = proposals.filter((p) => {
    if (activeFilter === "all") return p.status !== "draft";
    if (activeFilter === "draft") return p.status === "draft";
    return p.status === activeFilter;
  });

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
        <h2 className="text-white font-bold text-base">
          {isDraftsView ? "Your Drafts" : "Your Proposals"}
        </h2>

        <div className="flex items-center gap-2">
          {/* ── Dropdown filter ── */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
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
                className="absolute right-0 top-full mt-1.5 rounded-xl overflow-hidden z-30 min-w-[140px]"
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
