import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { fetchProposals } from "../redux/proposalsSlice";
import PlanInputBox from "../components/PlanInputBox";
import ProposalsGrid from "../components/ProposalsGrid";
import ProposalDetailModal from "../components/Modals/ProposalDetailModal";
import SuccessModal from "../components/Modals/SuccessModal";

const ProposalsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, showProposalModal, showSuccessModal } = useSelector(
    (s: RootState) => s.proposals,
  );

  useEffect(() => {
    dispatch(fetchProposals());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: "#7ee3ff", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-8 md:px-10"
      style={{ maxWidth: "1000px", margin: "0 auto" }}
    >
      {/* Plan input */}
      <PlanInputBox />

      {/* Proposals / Drafts grid */}
      <ProposalsGrid />

      {/* Modals */}
      {showProposalModal && <ProposalDetailModal />}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
};

export default ProposalsPage;
