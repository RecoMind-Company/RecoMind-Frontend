import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import client from "@/api/client";
import type {
  Proposal,
  ProposalsState,
  FilterType,
  ProposalComment,
  ValidationStep,
  PlanData,
  PlanApiResponse,
  ProposalStatus,
  ValidationReportData,
  GenerateReportResponse,
} from "../types";

// ================= VALIDATION STEPS =================
const VALIDATION_STEPS: ValidationStep[] = [
  { label: "Similar Companies Benchmarking", done: false },
  { label: "Market Trend Validation", done: false },
  { label: "Company Resources Validation", done: false },
];

// ================= VALIDATION REPORT HELPERS =================
function formatValidationReport(data: ValidationReportData): string {
  let report = "";
  report += "Executive Summary\n";
  report += `${data.executive_summary}\n\n`;
  report += "Validation Decision\n";
  report += `${data.validation_decision}\n\n`;
  report += `Confidence Score: ${data.confidence_score}\n\n`;
  report += "Key Findings\n\n";
  report += `1. Precedent Analysis\n${data.key_findings.precedent_analysis}\n\n`;
  report += `2. Resource Assessment\n${data.key_findings.resource_assessment}\n\n`;
  report += `3. Market Trends\n${data.key_findings.market_trends}\n\n`;
  report += "Recommendations\n";
  data.recommendations.forEach((r, i) => {
    report += `${i + 1}. ${r}\n`;
  });
  report += "\nRisk Factors\n";
  data.risk_factors.forEach((r, i) => {
    report += `${i + 1}. ${r}\n`;
  });
  report += "\nNext Steps\n";
  data.next_steps.forEach((s, i) => {
    report += `${i + 1}. ${s}\n`;
  });
  return report;
}

async function pollValidationReport(
  taskId: string,
  dispatch: (action: unknown) => void,
): Promise<ValidationReportData> {
  const maxAttempts = 60;
  const delay = 5000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await client.get(
        `/ValidationReport/generated/${taskId}`,
        { validateStatus: (status: number) => status === 200 || status === 202 },
      );

      if (response.status === 200 && response.data?.executive_summary) {
        dispatch(markValidationStep(0));
        dispatch(markValidationStep(1));
        dispatch(markValidationStep(2));
        return response.data as ValidationReportData;
      }

      if (attempt >= 2) dispatch(markValidationStep(0));
      if (attempt >= 8) dispatch(markValidationStep(1));
      if (attempt >= 16) dispatch(markValidationStep(2));

      await new Promise((r) => setTimeout(r, delay));
    } catch {
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Validation timed out. Please try again.");
}

// ================= API MAPPING =================
function mapPlanToProposal(plan: PlanData): Proposal {
  const rawStatus = plan.status?.toLowerCase();

  let status: ProposalStatus;
  if (rawStatus === "accepted") {
    status = "accepted";
  } else if (rawStatus === "rejected") {
    status = "rejected";
  } else if (plan.isApproved || plan.feedback) {
    status = "under_review";
  } else {
    status = "draft";
  }

  const proposal: Proposal = {
    id: plan.id,
    title: plan.goal || plan.description || "Untitled Plan",
    description: plan.description || plan.goal || "",
    plan: plan.description || plan.goal || "",
    validationReport: "",
    status,
    progress: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    goal: plan.goal,
    isApproved: plan.isApproved,
    feedback: plan.feedback,
    duration: plan.duration,
    modules: plan.modules,
  };

  if (plan.planType) {
    proposal.planType = plan.planType;
  }

  if (plan.feedback) {
    proposal.rejectionFeedback = [
      { reviewer: "Reviewer", time: "", message: plan.feedback },
    ];
  }

  return proposal;
}

// ================= ASYNC THUNKS =================
export const fetchProposals = createAsyncThunk(
  "proposals/fetchProposals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await client.get<PlanApiResponse[]>("/Plan/GetAll");
      const proposals = response.data
        .filter((item) => item.isSuccess && item.value)
        .map((item) => mapPlanToProposal(item.value));
      return proposals;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch proposals",
      );
    }
  },
);

export const startValidation = createAsyncThunk(
  "proposals/startValidation",
  async (planText: string, { dispatch, rejectWithValue }) => {
    try {
      // Step 1: Generate validation report
      const generateRes = await client.post<GenerateReportResponse>(
        "/ValidationReport/generate",
        { userRequest: planText },
      );
      const taskId = generateRes.data.task_id;

      // Step 2: Poll for the generated report
      const reportData = await pollValidationReport(taskId, dispatch);
      const formattedReport = formatValidationReport(reportData);

      return {
        report: formattedReport,
        proposal: {
          id: `p${Date.now()}`,
          title: planText.slice(0, 30) || "New Proposal",
          description: planText,
          plan: planText,
          validationReport: formattedReport,
          validationReportData: reportData,
          status: "pending" as const,
          progress: 0,
          comments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Proposal,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Validation failed",
      );
    }
  },
);

export const saveDraft = createAsyncThunk(
  "proposals/saveDraft",
  async (proposal: Proposal, { rejectWithValue }) => {
    try {
      const content = proposal.validationReportData || {
        executive_summary: proposal.description || proposal.plan || "",
        validation_decision: "",
        confidence_score: 0,
        key_findings: {
          precedent_analysis: "",
          resource_assessment: "",
          market_trends: "",
        },
        recommendations: [],
        risk_factors: [],
        next_steps: [],
      };
      await client.post("/ValidationReport/add", {
        userRequest: proposal.plan || proposal.description || "",
        content,
        status: 1,
      });
      return { ...proposal, status: "draft" as const };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save draft",
      );
    }
  },
);

export const sendForApproval = createAsyncThunk(
  "proposals/sendForApproval",
  async (proposal: Proposal, { rejectWithValue }) => {
    try {
      const content = proposal.validationReportData || {
        executive_summary: proposal.description || proposal.plan || "",
        validation_decision: "",
        confidence_score: 0,
        key_findings: {
          precedent_analysis: "",
          resource_assessment: "",
          market_trends: "",
        },
        recommendations: [],
        risk_factors: [],
        next_steps: [],
      };
      await client.post("/ValidationReport/send", {
        userRequest: proposal.plan || proposal.description || "",
        content,
      });
      return { ...proposal, status: "under_review" as const };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send proposal",
      );
    }
  },
);

export const addComment = createAsyncThunk(
  "proposals/addComment",
  async (
    { proposalId, text }: { proposalId: string; text: string },
    { rejectWithValue },
  ) => {
    try {
      // TODO: Connect to API
      // const response = await client.post(`/proposals/${proposalId}/comments`, { text });
      // return { proposalId, comment: response.data };
      const comment: ProposalComment = {
        id: `c${Date.now()}`,
        author: "Ahmed Hassan",
        time: new Date().toLocaleString("en-US", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        text,
      };
      return { proposalId, comment };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment",
      );
    }
  },
);

export const revalidateProposal = createAsyncThunk(
  "proposals/revalidate",
  async (proposal: Proposal, { dispatch, rejectWithValue }) => {
    try {
      // Step 1: Generate validation report
      const generateRes = await client.post<GenerateReportResponse>(
        "/ValidationReport/generate",
        { userRequest: proposal.plan },
      );
      const taskId = generateRes.data.task_id;

      // Step 2: Poll for the generated report
      const reportData = await pollValidationReport(taskId, dispatch);
      const formattedReport = formatValidationReport(reportData);

      return {
        ...proposal,
        validationReport: formattedReport,
        validationReportData: reportData,
        status: "pending" as const,
        rejectionFeedback: [],
      } as Proposal;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Revalidation failed",
      );
    }
  },
);

// ================= SLICE =================
const initialState: ProposalsState = {
  proposals: [],
  activeFilter: "all",
  planInput: "",
  isInputExpanded: false,
  isValidating: false,
  validationSteps: VALIDATION_STEPS,
  validationDone: false,
  currentValidationReport: null,
  selectedProposal: null,
  showProposalModal: false,
  showSuccessModal: null,
  loading: false,
  error: null,
  isSavingDraft: false,
  isSendingApproval: false,
};

const proposalsSlice = createSlice({
  name: "proposals",
  initialState,
  reducers: {
    setPlanInput: (state, action: PayloadAction<string>) => {
      state.planInput = action.payload;
      state.isInputExpanded = action.payload.length > 0;
    },
    setActiveFilter: (state, action: PayloadAction<FilterType>) => {
      state.activeFilter = action.payload;
    },
    openProposalModal: (state, action: PayloadAction<Proposal>) => {
      state.selectedProposal = action.payload;
      state.showProposalModal = true;
    },
    closeProposalModal: (state) => {
      state.selectedProposal = null;
      state.showProposalModal = false;
    },
    closeSuccessModal: (state) => {
      state.showSuccessModal = null;
      state.currentValidationReport = null;
      state.validationDone = false;
      state.planInput = "";
      state.isInputExpanded = false;
      state.validationSteps = VALIDATION_STEPS.map((s) => ({
        ...s,
        done: false,
      }));
    },
    markValidationStep: (state, action: PayloadAction<number>) => {
      const idx = action.payload;
      const steps = state.validationSteps;
      if (Array.isArray(steps) && idx >= 0 && idx < steps.length) {
        const step = steps[idx];
        if (step) step.done = true;
      }
    },
    resetValidation: (state) => {
      state.isValidating = false;
      state.validationDone = false;
      state.currentValidationReport = null;
      state.validationSteps = VALIDATION_STEPS.map((s) => ({
        ...s,
        done: false,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProposals
      .addCase(fetchProposals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals = action.payload;
      })
      .addCase(fetchProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // startValidation
      .addCase(startValidation.pending, (state) => {
        state.isValidating = true;
        state.validationDone = false;
        state.validationSteps = VALIDATION_STEPS.map((s) => ({
          ...s,
          done: false,
        }));
      })
      .addCase(startValidation.fulfilled, (state, action) => {
        state.isValidating = false;
        state.validationDone = true;
        state.currentValidationReport = action.payload.report;
        // temporarily store new proposal awaiting save/send
        state.selectedProposal = action.payload.proposal;
        state.showProposalModal = true;
      })
      .addCase(startValidation.rejected, (state, action) => {
        state.isValidating = false;
        state.error = action.payload as string;
      })
      // saveDraft
      .addCase(saveDraft.pending, (state) => {
        state.isSavingDraft = true;
      })
      .addCase(saveDraft.fulfilled, (state, action) => {
        state.isSavingDraft = false;
        const idx = state.proposals.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (idx >= 0) {
          state.proposals[idx] = action.payload;
        } else {
          state.proposals.unshift(action.payload);
        }
        state.showProposalModal = false;
        state.showSuccessModal = "saved";
        state.selectedProposal = null;
      })
      .addCase(saveDraft.rejected, (state, action) => {
        state.isSavingDraft = false;
        state.error = action.payload as string;
      })
      // sendForApproval
      .addCase(sendForApproval.pending, (state) => {
        state.isSendingApproval = true;
      })
      .addCase(sendForApproval.fulfilled, (state, action) => {
        state.isSendingApproval = false;
        const idx = state.proposals.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (idx >= 0) {
          state.proposals[idx] = action.payload;
        } else {
          state.proposals.unshift(action.payload);
        }
        state.showProposalModal = false;
        state.showSuccessModal = "sent";
        state.selectedProposal = null;
      })
      .addCase(sendForApproval.rejected, (state, action) => {
        state.isSendingApproval = false;
        state.error = action.payload as string;
      })
      // addComment
      .addCase(addComment.fulfilled, (state, action) => {
        const p = state.proposals.find(
          (p) => p.id === action.payload.proposalId,
        );
        if (p) p.comments.push(action.payload.comment);
        if (state.selectedProposal?.id === action.payload.proposalId) {
          state.selectedProposal = p || null;
        }
      })
      // revalidate
      .addCase(revalidateProposal.pending, (state) => {
        state.isValidating = true;
        state.validationSteps = VALIDATION_STEPS.map((s) => ({
          ...s,
          done: false,
        }));
      })
      .addCase(revalidateProposal.fulfilled, (state, action) => {
        state.isValidating = false;
        state.currentValidationReport = action.payload.validationReport;
        const idx = state.proposals.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (idx >= 0) state.proposals[idx] = action.payload;
        if (state.selectedProposal?.id === action.payload.id) {
          state.selectedProposal = action.payload;
        }
      })
      .addCase(revalidateProposal.rejected, (state, action) => {
        state.isValidating = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setPlanInput,
  setActiveFilter,
  openProposalModal,
  closeProposalModal,
  closeSuccessModal,
  markValidationStep,
  resetValidation,
} = proposalsSlice.actions;

export const ProposalsReducer = proposalsSlice.reducer;
