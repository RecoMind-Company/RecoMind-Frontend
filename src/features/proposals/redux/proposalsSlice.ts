import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  Proposal,
  ProposalsState,
  FilterType,
  ProposalComment,
  ValidationStep,
} from "../types";

// ================= MOCK DATA =================
const mockReport = `Overview
This validation report evaluates the selected action plan before execution to ensure it is feasible, relevant, and aligned with business reality.

The validation process is designed to reduce execution risk and increase the likelihood of measurable impact by analyzing the plan across three critical dimensions:
1. Industry & Peer Benchmarking
2. Internal Company Resources
3. Market Trends & External Signals

Only validated plans proceed to AI task generation and execution.

1. Validation Scope
The validation focuses on answering the following key questions:
• Has a similar plan been successfully implemented before?
• Does the company have the required resources to execute this plan?
• Is the plan aligned with current and emerging market trends?

2. Validation Steps & Results
2.1 Industry & Peer Benchmarking
Objective:
Assess how similar companies or industry peers executed comparable plans and identify best practices and risks.
Methodology:
• Analysis of public case studies, industry reports, and comparable company actions.
• Identification of success factors and common failure points.`;

const mockComments: ProposalComment[] = [
  {
    id: "c1",
    author: "Samy Ahmed",
    time: "Sat 3:00 pm",
    text: "Great job on the report, Ahmed! Your work on the brand awareness campaign is really making an impact.",
  },
  {
    id: "c2",
    author: "Magdy Mohammed",
    time: "Sat 3:00 pm",
    text: "Great job on the report, Ahmed! Your work on the brand.",
  },
];

const mockRejection = [
  {
    id: "r1",
    reviewer: "Samy Ahmed",
    time: "Sat 3:00 pm",
    message:
      "The proposal is strategically sound; however, the projected $500K budget exceeds our current Q2 allocation. Please revise the plan to scale down initial costs by 20% or consider a phased implementation approach.",
  },
  {
    id: "r2",
    reviewer: "Magdy Mohammed",
    time: "Sat 3:00 pm",
    message:
      "Great job on the report, Ahmed! Your work on the brand awareness campaign is really making an impact.",
  },
];

const mockProposals: Proposal[] = [
  {
    id: "p1",
    title: "Social Media Growth",
    description:
      "This validation report evaluates the selected action plan before execution to ensure it is feasible, relevant, and aligned with business reality ...",
    plan: "Social Media Growth Social Media GrowthSocial Media Growth",
    validationReport: mockReport,
    status: "accepted",
    progress: 20,
    comments: mockComments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p2",
    title: "Social Media Growth",
    description:
      "This validation report evaluates the selected action plan before execution to ensure it is feasible, relevant, and aligned with business reality ...",
    plan: "Social Media Growth Social Media GrowthSocial Media Growth",
    validationReport: mockReport,
    status: "rejected",
    progress: 0,
    rejectionFeedback: mockRejection,
    comments: mockComments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p3",
    title: "Social Media Growth",
    description:
      "This validation report evaluates the selected action plan before execution to ensure it is feasible, relevant, and aligned with business reality ...",
    plan: "Social Media Growth Social Media GrowthSocial Media Growth",
    validationReport: mockReport,
    status: "under_review",
    progress: 50,
    comments: mockComments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p4",
    title: "Social Media Growth",
    description:
      "This validation report evaluates the selected action plan before execution to ensure it is feasible, relevant, and aligned with business reality ...",
    plan: "Social Media Growth Social Media GrowthSocial Media Growth",
    validationReport: mockReport,
    status: "accepted",
    progress: 20,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p5",
    title: "Social Media Growth",
    description:
      "This validation report evaluates the selected action plan before execution to ensure it is feasible, relevant, and aligned with business reality ...",
    plan: "Social Media Growth Social Media GrowthSocial Media Growth",
    validationReport: mockReport,
    status: "rejected",
    progress: 0,
    rejectionFeedback: mockRejection,
    comments: mockComments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p6",
    title: "Social Media Growth",
    description:
      "This validation report evaluates the selected action plan before execution to ensure it is feasible, relevant, and aligned with business reality ...",
    plan: "Social Media Growth Social Media GrowthSocial Media Growth",
    validationReport: mockReport,
    status: "under_review",
    progress: 50,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p7",
    title: "Social Media Growth",
    description:
      "This validation report evaluates the selected action plan ...",
    plan: "Draft plan 1",
    validationReport: "",
    status: "draft",
    progress: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p8",
    title: "Social Media Growth",
    description:
      "This validation report evaluates the selected action plan ...",
    plan: "Draft plan 2",
    validationReport: "",
    status: "draft",
    progress: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p9",
    title: "Social Media Growth",
    description:
      "This validation report evaluates the selected action plan ...",
    plan: "Draft plan 3",
    validationReport: "",
    status: "draft",
    progress: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const VALIDATION_STEPS: ValidationStep[] = [
  { label: "Similar Companies Benchmarking", done: false },
  { label: "Market Trend Validation", done: false },
  { label: "Company Resources Validation", done: false },
];

// ================= ASYNC THUNKS =================
export const fetchProposals = createAsyncThunk(
  "proposals/fetchProposals",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Connect to API
      // const response = await client.get("/proposals");
      // return response.data;
      return mockProposals;
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
      // TODO: Connect to real AI validation API
      // const response = await client.post("/proposals/validate", { plan: planText });
      // return response.data;

      // Simulate streaming validation steps
      for (let i = 0; i < VALIDATION_STEPS.length; i++) {
        await new Promise((r) => setTimeout(r, 1200));
        dispatch(markValidationStep(i));
      }
      await new Promise((r) => setTimeout(r, 600));

      return {
        report: mockReport,
        proposal: {
          id: `p${Date.now()}`,
          title: planText.slice(0, 30) || "New Proposal",
          description:
            "This validation report evaluates the selected action plan before execution to ensure it is feasible, relevant, and aligned with business reality ...",
          plan: planText,
          validationReport: mockReport,
          status: "pending" as const,
          progress: 0,
          comments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Proposal,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Validation failed",
      );
    }
  },
);

export const saveDraft = createAsyncThunk(
  "proposals/saveDraft",
  async (proposal: Proposal, { rejectWithValue }) => {
    try {
      // TODO: Connect to API
      // const response = await client.post("/proposals/draft", proposal);
      // return response.data;
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
      // TODO: Connect to API
      // const response = await client.post("/proposals/submit", proposal);
      // return response.data;
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
      // TODO: Connect to API
      // const response = await client.post(`/proposals/${proposal.id}/revalidate`);
      // return response.data;
      for (let i = 0; i < VALIDATION_STEPS.length; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        dispatch(markValidationStep(i));
      }
      await new Promise((r) => setTimeout(r, 500));
      return {
        ...proposal,
        status: "under_review" as const,
        rejectionFeedback: [],
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Revalidation failed",
      );
    }
  },
);

// ================= SLICE =================
const initialState: ProposalsState = {
  proposals: mockProposals,
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
      .addCase(saveDraft.fulfilled, (state, action) => {
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
      // sendForApproval
      .addCase(sendForApproval.fulfilled, (state, action) => {
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
