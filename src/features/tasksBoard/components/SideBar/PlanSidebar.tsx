import "./planSidebar.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Megaphone, Target } from "lucide-react";
import { useGetAcceptedPlansQuery, useGetAllTasksQuery } from "../../redux/tasksSlice";
import type { Plan } from "../../types";
import { assets } from "@/assets/assets";

const hasToken = () =>
  typeof window !== "undefined" && !!localStorage.getItem("token");

// ── helpers ──────────────────────────────────────────────────────────────────

interface AcceptedPlanWrapper {
  value: Plan;
  isSuccess: boolean;
  isFailure: boolean;
  error: string | null;
}

interface ApiTask {
  questId: string;
  status?: string;
  deadLine?: string;
  deadline?: string;
  dueDate?: string;
}

const unwrapAcceptedPlan = (item: AcceptedPlanWrapper | Plan): Plan | null => {
  if ("value" in item) return item.isSuccess && item.value ? item.value : null;
  return item;
};

const isTaskOverdue = (task: ApiTask) => {
  const deadlineStr = task.deadLine || task.deadline || task.dueDate;
  if (!deadlineStr || task.status === "completed") return false;
  return new Date(deadlineStr) < new Date();
};

const isTaskDone = (task: ApiTask) => task.status === "completed";

const planTitle = (plan: Plan) => plan.goal || plan.description || "Unnamed Plan";

function usePlanTaskStats(planId: string) {
  const { data = [], isLoading } = useGetAllTasksQuery(planId, { skip: !planId });
  const tasks = data as ApiTask[];
  const total = tasks.length;
  const completed = tasks.filter(isTaskDone).length;
  const overdue = tasks.filter(isTaskOverdue).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, overdue, progress, isLoading };
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
function PlanCard({
  plan,
  active,
  onClick,
}: {
  plan: Plan;
  active: boolean;
  onClick?: () => void;
}) {
  const { total, overdue, progress, isLoading } = usePlanTaskStats(plan.id);

  if (!isLoading && total === 0) return null;

  return (
    <div 
      className={`ps-plan-card ${active ? "ps-active-card" : ""}`}
      onClick={onClick}
      title="Click to view plan tasks"
    >
      <p className="ps-card-name">{planTitle(plan)}</p>

      <div className="ps-card-meta">
        <span>{isLoading ? "..." : total} Tasks</span>
        {overdue > 0 ? (
          <span className="ps-status-badge ps-overdue">{overdue} Overdue</span>
        ) : (
          <span className="ps-status-badge ps-on-track">On Track</span>
        )}
      </div>

      <div className="ps-progress-row">
        <p className="ps-progress-label">Progress</p>
        <p className="ps-progress-pct">{isLoading ? "--" : progress}%</p>
      </div>

      <div className="ps-progress-track">
        <div className="ps-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

interface PlanSidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

// ── Main Sidebar ─────────────────────────────────────────────────────────────
export default function PlanSidebar({ onCollapsedChange }: PlanSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    data: acceptedPlansResponse = [],
    isLoading,
    isError,
  } = useGetAcceptedPlansQuery(undefined, { skip: !hasToken() });

  useEffect(() => {
    onCollapsedChange?.(false);
  }, []);

  const activePlanId = searchParams.get("planId") || "";
  const plans = (acceptedPlansResponse as (AcceptedPlanWrapper | Plan)[])
    .map(unwrapAcceptedPlan)
    .filter((plan): plan is Plan => Boolean(plan));

  const handlePlanClick = (plan: Plan) => {
    navigate(`/home/plan-tasks?planId=${plan.id}&planName=${encodeURIComponent(planTitle(plan))}`);
  };

  return (
    <div className={`plan-sidebar${collapsed ? " ps-closed" : ""}`}>
      {/* ── TOP ── */}
      <div className="ps-top">
        {/* Header */}
        <div className="ps-header">
          <div className="ps-header-info">
            <div className="ps-title-row">
              <span className="ps-title-icon">
                <Megaphone size={19} />
              </span>
              <p className="ps-title">Marketing</p>
            </div>
            <p className="ps-subtitle">Active Plans</p>
          </div>
          <button
            className="ps-toggle-btn"
            onClick={() => {
              setCollapsed((current) => {
                const next = !current;
                onCollapsedChange?.(next);
                return next;
              });
            }}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <img
              className={`ps-menu ${collapsed ? "ps-rotated" : ""}`}
              src={assets.menu_icon}
              alt="Menu"
            />
          </button>
        </div>

        {/* Section label */}
        <button className="ps-section-label" type="button">
          All Plans
        </button>

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
            plans.map((plan) => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                active={activePlanId === plan.id}
                onClick={() => handlePlanClick(plan)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
