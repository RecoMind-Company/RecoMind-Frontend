// ================= ENUMS =================
export type ProposalStatus =
  | "accepted"
  | "rejected"
  | "under_review"
  | "draft"
  | "pending";
export type FilterType =
  | "all"
  | "accepted"
  | "rejected"
  | "under_review"
  | "draft";

// ================= MODELS =================
export interface ProposalComment {
  id: string;
  author: string;
  authorAvatar?: string;
  time: string;
  text: string;
}

export interface RejectionFeedback {
  reviewer: string;
  reviewerAvatar?: string;
  time: string;
  message: string;
}

export interface ValidationStep {
  label: string;
  done: boolean;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  plan: string; // raw plan text user entered
  validationReport: string; // AI-generated report
  status: ProposalStatus;
  progress: number; // 0-100
  rejectionFeedback?: RejectionFeedback[];
  comments: ProposalComment[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// ================= STATE =================
export interface ProposalsState {
  proposals: Proposal[];
  activeFilter: FilterType;
  // Input form
  planInput: string;
  isInputExpanded: boolean;
  // Validation process
  isValidating: boolean;
  validationSteps: ValidationStep[];
  validationDone: boolean;
  currentValidationReport: string | null;
  // Modals
  selectedProposal: Proposal | null;
  showProposalModal: boolean;
  showSuccessModal: "saved" | "sent" | null;
  // Loading / Error
  loading: boolean;
  error: string | null;
}
