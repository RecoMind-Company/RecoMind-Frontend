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

// ================= API RESPONSE TYPES =================
export interface PlanData {
  id: string;
  description: string | null;
  goal: string;
  planType: string | null;
  status: string;
  isApproved: boolean;
  feedback: string | null;
  duration: string;
  modules: unknown[];
}

export interface PlanApiResponse {
  value: PlanData;
  isSuccess: boolean;
  isFailure: boolean;
  error: string | null;
}

// ================= VALIDATION REPORT API TYPES =================
export interface KeyFindings {
  precedent_analysis: string;
  resource_assessment: string;
  market_trends: string;
}

export interface ValidationReportData {
  executive_summary: string;
  validation_decision: string;
  confidence_score: number;
  key_findings: KeyFindings;
  recommendations: string[];
  risk_factors: string[];
  next_steps: string[];
}

export interface GenerateReportResponse {
  task_id: string;
  status: string;
  message: string;
}

export type ValidationReportStatus = 0 | 1 | 2 | 3; // UnderReview | Draft | Rejected | Accepted

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
  updatedAt?: string; // ISO
  // API fields
  goal?: string;
  planType?: string;
  isApproved?: boolean;
  feedback?: string | null;
  duration?: string;
  modules?: unknown[];
  validationReportData?: ValidationReportData;
  userQuestion?: string;
  createdBy?: string;
  content?: ValidationReportData;
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
