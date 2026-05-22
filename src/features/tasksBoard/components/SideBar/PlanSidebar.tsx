import "./planSidebar.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Target, ClipboardList, Clock } from "lucide-react";
import { useGetAllPlansQuery } from "../../redux/plansSlice";
import type { RootState } from "@/app/store";
import type { Plan } from "../../types";
import { assets } from "@/assets/assets";

const hasToken = () =>
  typeof window !== "undefined" && !!localStorage.getItem("token");

// ── helpers ──────────────────────────────────────────────────────────────────

/** Compute progress % from tasks in the Redux store that match this plan's goal */
function usePlanProgress(plan: Plan): number {
  const tasks = useSelector((s: RootState) => s.tasks.tasks);
  // Match tasks whose project name loosely matches the plan goal
  const related = tasks.filter(
    (t) =>
      t.boardType === "plans" &&
      t.project.toLowerCase().includes(plan.goal.toLowerCase().slice(0, 8)),
  );
  if (related.length === 0) return 0;
  const done = related.filter((t) => t.completed).length;
  return Math.round((done / related.length) * 100);
}

// ── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="ps-skeleton-card">
      <div className="ps-skel-line wide" />
      <div className="ps-skel-line medium" />
      <div className="ps-skel-line thin" />
      <div className="ps-skel-line bar" />
    </div>
  );
}

// ── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({ plan }: { plan: Plan }) {
  const progress = usePlanProgress(plan);
  const days = parseInt(plan.duration, 10);
  const durationLabel = isNaN(days)
    ? plan.duration
    : days >= 30
      ? `${Math.round(days / 30)}mo`
      : `${days}d`;

  return (
    <div className="ps-plan-card">
      <div className="ps-card-header">
        <p className="ps-card-name">{plan.goal || "Unnamed Plan"}</p>
        <span className="ps-status-badge">{plan.status || "Unknown"}</span>
      </div>

      <div className="ps-card-meta">
        {plan.planType && (
          <span className="ps-meta-chip">
            <ClipboardList size={10} />
            {plan.planType}
          </span>
        )}
        {plan.planType && durationLabel && <span className="ps-meta-dot" />}
        {durationLabel && (
          <span className="ps-meta-chip">
            <Clock size={10} />
            {durationLabel}
          </span>
        )}
      </div>

      <div className="ps-progress-row">
        <p className="ps-progress-label">Progress</p>
        <p className="ps-progress-pct">{progress}%</p>
      </div>
      <div className="ps-progress-track">
        <div className="ps-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

// ── Main Sidebar ─────────────────────────────────────────────────────────────
export default function PlanSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    data: plans = [],
    isLoading,
    isError,
  } = useGetAllPlansQuery(undefined, { skip: !hasToken() });

  return (
    <div className={`plan-sidebar${collapsed ? " ps-closed" : ""}`}>
      {/* ── TOP ── */}
      <div className="ps-top">
        {/* Header */}
        <div className="ps-header">
          <div className="ps-header-info">
            <p className="ps-title">My Plans</p>
            <p className="ps-subtitle">Active Plans</p>
          </div>
          <button
            className="ps-toggle-btn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <img
              className={`ps-menu ${collapsed ? "ps-rotated" : ""}`}
              src={assets.menu_icon}
              alt="Menu"
            />
          </button>
        </div>

        <div className="ps-divider" />

        {/* Section label */}
        <p className="ps-section-label">All Plans</p>

        {/* List */}
        <div className="ps-list">
          {isLoading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {isError && !isLoading && (
            <div className="ps-empty">
              <Target size={28} className="ps-empty-icon" />
              <p className="ps-empty-text">Failed to load plans</p>
            </div>
          )}

          {!isLoading && !isError && plans.length === 0 && (
            <div className="ps-empty">
              <Target size={28} className="ps-empty-icon" />
              <p className="ps-empty-text">No active plans yet</p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </div>
      </div>
    </div>
  );
}
