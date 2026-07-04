import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAllPlansQuery } from "../../redux/plansSlice";
import "../SideBar/planSidebar.css";

const PlanTaskSidebar: React.FC = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("planId") || "";
  const { data: allPlans } = useGetAllPlansQuery();
  const [collapsed, setCollapsed] = useState(false);

  const currentPlan = (allPlans || []).find((p) => p.id === planId);

  return (
    <div className={`plan-sidebar ${collapsed ? "ps-closed" : "ps-open"}`}>
      <div className="ps-top">
        <div className="ps-header">
          <div className="ps-header-info">
            <h3 className="ps-title">Current Plan</h3>
          </div>
          <button
            className="ps-toggle-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="ps-divider" />

        <div className="ps-section-label">Plan Details</div>

        <div className="ps-list">
          {currentPlan ? (
            <div className="ps-plan-card ps-active-card">
              <div className="ps-card-header">
                <p className="ps-card-name">{currentPlan.goal || "Untitled Plan"}</p>
                <span className="ps-status-badge">{currentPlan.status}</span>
              </div>
              <div className="ps-card-meta">
                <span className="ps-meta-chip">
                  Duration: {currentPlan.duration} days
                </span>
              </div>
            </div>
          ) : (
            <div className="ps-plan-card">
              <p className="ps-card-name">Loading plan...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanTaskSidebar;
