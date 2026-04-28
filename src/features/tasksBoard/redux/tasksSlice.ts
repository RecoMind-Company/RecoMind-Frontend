import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  Task,
  TasksState,
  TaskStatus,
  BoardType,
  ViewMode,
  TeamMember,
  Comment,
} from "../types";

// ================= HELPERS =================
/** Build ISO string for a day in the current month */
const thisMonth = (day: number, hour = 12) => {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), day, hour, 0, 0);
  return d.toISOString();
};

const today = new Date();
const todayISO = today.toISOString().split("T")[0] ?? today.toISOString();

// ================= MOCK DATA =================
const mockMembers: TeamMember[] = [
  { id: "m1", name: "Ahmed Mohammed", role: "Developer" },
  { id: "m2", name: "Magdy Mohammed", role: "Designer" },
  { id: "m3", name: "Samy Ahmed", role: "Manager" },
  { id: "m4", name: "Sara Ali", role: "Developer" },
];

const mockComments: Comment[] = [
  {
    id: "c1",
    author: "Magdy Mohammed",
    time: "Sat 3:00 pm",
    text: "Great job on the report, Ahmed! Your work on the brand awareness campaign is really making an impact.",
  },
  {
    id: "c2",
    author: "Samy Ahmed",
    time: "Sat 3:00 pm",
    text: "Great job on the report, Ahmed! Your work on the brand awareness campaign is really making an impact.",
  },
  {
    id: "c3",
    author: "Magdy Mohammed",
    time: "Sat 3:00 pm",
    text: "Great job on the report, Ahmed! Your work on the brand.",
  },
];

const member1 = mockMembers[0]!;
const member2 = mockMembers[1]!;
const member3 = mockMembers[2]!;

// ===== Build mock tasks with REAL dates spread across the month =====
const mockTasks: Task[] = [
  // ---- Day 1 (SAT) ----
  {
    id: "t_d1_1",
    title: "Target audience",
    description:
      "Define and document the primary target audience for Q1 campaign.",
    project: "Q1 Brand Awareness",
    status: "review",
    priority: "HIGH",
    dueDate: thisMonth(1),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} 1`,
    assignees: [member1],
    comments: mockComments,
    boardType: "plans",
    completed: true,
  },
  // ---- Day 7 (FRI) ----
  {
    id: "t_d7_1",
    title: "Competitor analysis",
    description: "Analyze top 5 competitors' marketing strategies.",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "MEDIUM",
    dueDate: thisMonth(7),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} 7`,
    assignees: [member1, member2],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  {
    id: "t_d7_2",
    title: "Banner ads",
    description: "Create banner ads for the social media campaign.",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "LOW",
    dueDate: thisMonth(7, 16),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} 7`,
    assignees: [member2],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  // ---- Day 8 (SAT) ----
  {
    id: "t_d8_1",
    title: "Competitor analysis",
    description: "Deep-dive competitor analysis report.",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "HIGH",
    dueDate: thisMonth(8),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} 8`,
    assignees: [member3],
    comments: mockComments,
    boardType: "plans",
    completed: false,
  },
  {
    id: "t_d8_2",
    title: "Banner ads",
    description: "Design banner ad variants A/B.",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "MEDIUM",
    dueDate: thisMonth(8, 15),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} 8`,
    assignees: [member2],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  // ---- Day 9 (SUN) ----
  {
    id: "t_d9_1",
    title: "Competitor analysis",
    description: "Final competitor analysis documentation.",
    project: "Q1 Brand Awareness",
    status: "overdue",
    priority: "HIGH",
    dueDate: thisMonth(9),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} 9`,
    isLate: true,
    lateDisplay: "1 day Late",
    assignees: [member1, member2],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  {
    id: "t_d9_2",
    title: "Banner ads",
    description: "Finalize and export banner ads.",
    project: "Q1 Brand Awareness",
    status: "overdue",
    priority: "MEDIUM",
    dueDate: thisMonth(9, 14),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} 9`,
    isLate: true,
    lateDisplay: "1 day Late",
    assignees: [member2],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  {
    id: "t_d9_3",
    title: "Meeting with stakeholders",
    description: "Quarterly review meeting with all stakeholders.",
    project: "Personal",
    status: "overdue",
    priority: "HIGH",
    dueDate: thisMonth(9, 10),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} 9`,
    isLate: true,
    lateDisplay: "1 day Late",
    assignees: [],
    comments: [],
    boardType: "personal",
    completed: false,
  },
  // ---- Today ----
  {
    id: "t_today_1",
    title: "Prepare product demo presentation",
    description:
      "Conduct a comprehensive code review for the authentication module and ensure all API endpoints are secured before the production deployment.",
    project: "Q1 Brand Awareness",
    status: "overdue",
    priority: "HIGH",
    dueDate: today.toISOString(),
    dueDateDisplay: "6 hours Late",
    isLate: true,
    lateDisplay: "6 hours Late",
    assignees: [member1, member2],
    comments: mockComments,
    boardType: "plans",
    completed: false,
  },
  {
    id: "t_today_2",
    title: "Prepare product demo presentation",
    description:
      "Conduct a comprehensive code review for the authentication module.",
    project: "Q1 Brand Awareness",
    status: "overdue",
    priority: "HIGH",
    dueDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      14,
    ).toISOString(),
    dueDateDisplay: "6 hours Late",
    isLate: true,
    lateDisplay: "6 hours Late",
    assignees: [member1, member2],
    comments: mockComments,
    boardType: "plans",
    completed: false,
  },
  {
    id: "t_today_3",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "overdue",
    priority: "HIGH",
    dueDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      16,
    ).toISOString(),
    dueDateDisplay: "6 hours Late",
    isLate: true,
    lateDisplay: "6 hours Late",
    assignees: [member1, member2],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  {
    id: "t_today_4",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "HIGH",
    dueDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      17,
    ).toISOString(),
    dueDateDisplay: "Due in 6h",
    assignees: [member1, member2],
    comments: mockComments,
    boardType: "plans",
    completed: false,
  },
  {
    id: "t_today_5",
    title: "Prepare product demo presentation",
    project: "Brand Awareness",
    status: "todo",
    priority: "MEDIUM",
    dueDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      18,
    ).toISOString(),
    dueDateDisplay: "Due in 6h",
    assignees: [member1, member2],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  {
    id: "t_today_6",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "LOW",
    dueDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      20,
    ).toISOString(),
    dueDateDisplay: "Due in 6h",
    assignees: [member1, member2],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  // ---- Day today+1 (Blog post & Competitor) ----
  {
    id: "t_d13_1",
    title: "Blog post",
    description: "Write and publish Q1 awareness blog post.",
    project: "Q1 Brand Awareness",
    status: "overdue",
    priority: "HIGH",
    dueDate: thisMonth(today.getDate() + 1),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} ${today.getDate() + 1}`,
    isLate: true,
    lateDisplay: "Overdue",
    assignees: [member3],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  {
    id: "t_d13_2",
    title: "Competitor analysis",
    description: "Update competitor analysis with new data.",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "MEDIUM",
    dueDate: thisMonth(today.getDate() + 1, 17),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} ${today.getDate() + 1}`,
    assignees: [member1],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  // ---- Day 18 ----
  {
    id: "t_d18_1",
    title: "Blog post",
    description: "Draft second blog post for the month.",
    project: "Q1 Brand Awareness",
    status: "overdue",
    priority: "HIGH",
    dueDate: thisMonth(18),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} 18`,
    isLate: true,
    lateDisplay: "Overdue",
    assignees: [member2],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  {
    id: "t_d18_2",
    title: "Competitor analysis",
    description: "Monthly competitor analysis update.",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "MEDIUM",
    dueDate: thisMonth(18, 15),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} 18`,
    assignees: [member1, member2],
    comments: [],
    boardType: "plans",
    completed: false,
  },
  // ---- PERSONAL BOARD tasks ----
  {
    id: "t_p1",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "overdue",
    priority: "HIGH",
    dueDate: today.toISOString(),
    dueDateDisplay: "Due in 6h",
    assignees: [],
    comments: [],
    boardType: "personal",
    completed: false,
  },
  {
    id: "t_p2",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "overdue",
    priority: "HIGH",
    dueDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      14,
    ).toISOString(),
    dueDateDisplay: "Due in 6h",
    assignees: [],
    comments: [],
    boardType: "personal",
    completed: false,
  },
  {
    id: "t_p3",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "overdue",
    priority: "HIGH",
    dueDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      16,
    ).toISOString(),
    dueDateDisplay: "Due in 6h",
    assignees: [],
    comments: [],
    boardType: "personal",
    completed: false,
  },
  {
    id: "t_p4",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "LOW",
    dueDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      17,
    ).toISOString(),
    dueDateDisplay: "Due in 6h",
    assignees: [],
    comments: [],
    boardType: "personal",
    completed: false,
  },
  {
    id: "t_p5",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "LOW",
    dueDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      18,
    ).toISOString(),
    dueDateDisplay: "Due in 6h",
    assignees: [],
    comments: [],
    boardType: "personal",
    completed: false,
  },
  {
    id: "t_p6",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "LOW",
    dueDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      20,
    ).toISOString(),
    dueDateDisplay: "Due in 6h",
    assignees: [],
    comments: [],
    boardType: "personal",
    completed: false,
  },
  {
    id: "t_p7",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "done",
    priority: "HIGH",
    dueDate: thisMonth(Math.max(today.getDate() - 5, 1)),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} ${Math.max(today.getDate() - 5, 1)}`,
    assignees: [],
    comments: [],
    boardType: "personal",
    completed: true,
  },
  {
    id: "t_p8",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "done",
    priority: "MEDIUM",
    dueDate: thisMonth(Math.max(today.getDate() - 5, 1), 15),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} ${Math.max(today.getDate() - 5, 1)}`,
    assignees: [],
    comments: [],
    boardType: "personal",
    completed: true,
  },
  {
    id: "t_p9",
    title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness",
    status: "done",
    priority: "LOW",
    dueDate: thisMonth(Math.max(today.getDate() - 3, 1)),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} ${Math.max(today.getDate() - 3, 1)}`,
    assignees: [],
    comments: [],
    boardType: "personal",
    completed: true,
  },
  // End-of-month task
  {
    id: "t_eom_1",
    title: "Banner ads",
    description: "Final banner ads delivery.",
    project: "Q1 Brand Awareness",
    status: "todo",
    priority: "LOW",
    dueDate: thisMonth(today.getDate() + 3 <= 31 ? today.getDate() + 3 : 28),
    dueDateDisplay: `${today.toLocaleString("en-US", { month: "short" })} ${today.getDate() + 3 <= 31 ? today.getDate() + 3 : 28}`,
    assignees: [member2],
    comments: [],
    boardType: "plans",
    completed: false,
  },
];

// ================= ASYNC THUNKS =================
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Connect to API
      // const response = await client.get("/tasks");
      // return response.data;
      return mockTasks;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks",
      );
    }
  },
);

export const fetchTeamMembers = createAsyncThunk(
  "tasks/fetchTeamMembers",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Connect to API
      // const response = await client.get("/team-members");
      // return response.data;
      return mockMembers;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch members",
      );
    }
  },
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (
    task: Omit<Task, "id" | "comments" | "completed">,
    { rejectWithValue },
  ) => {
    try {
      // TODO: Connect to API
      // const response = await client.post("/tasks", task);
      // return response.data;
      return {
        ...task,
        id: `t${Date.now()}`,
        comments: [],
        completed: false,
      } as Task;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task",
      );
    }
  },
);

export const addComment = createAsyncThunk(
  "tasks/addComment",
  async (
    { taskId, text }: { taskId: string; text: string },
    { rejectWithValue },
  ) => {
    try {
      // TODO: Connect to API
      // const response = await client.post(`/tasks/${taskId}/comments`, { text });
      // return { taskId, comment: response.data };
      const comment: Comment = {
        id: `c${Date.now()}`,
        author: "Ahmed Hassan",
        time: new Date().toLocaleTimeString("en-US", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        text,
      };
      return { taskId, comment };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment",
      );
    }
  },
);

export const moveTask = createAsyncThunk(
  "tasks/moveTask",
  async (
    { taskId, newStatus }: { taskId: string; newStatus: TaskStatus },
    { rejectWithValue },
  ) => {
    try {
      // TODO: Connect to API
      // await client.patch(`/tasks/${taskId}`, { status: newStatus });
      return { taskId, newStatus };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to move task",
      );
    }
  },
);

export const toggleTaskComplete = createAsyncThunk(
  "tasks/toggleComplete",
  async (
    { taskId, completed }: { taskId: string; completed: boolean },
    { rejectWithValue },
  ) => {
    try {
      // TODO: Connect to API
      // await client.patch(`/tasks/${taskId}`, { completed });
      return { taskId, completed };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task",
      );
    }
  },
);

// ================= SLICE =================
const nowMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

const initialState: TasksState = {
  tasks: mockTasks,
  activeBoard: "plans",
  viewMode: "board",
  selectedDate: todayISO,
  calendarSelectedDate: null,
  calendarMonth: nowMonth,
  selectedTask: null,
  showTaskModal: false,
  showAddTaskModal: false,
  showInviteModal: false,
  dragOverColumn: null,
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setActiveBoard: (state, action: PayloadAction<BoardType>) => {
      state.activeBoard = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    // Board date strip
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    // Calendar day click
    setCalendarSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.calendarSelectedDate = action.payload;
    },
    // Calendar month navigation
    setCalendarMonth: (state, action: PayloadAction<string>) => {
      state.calendarMonth = action.payload;
    },
    openTaskModal: (state, action: PayloadAction<Task>) => {
      state.selectedTask = action.payload;
      state.showTaskModal = true;
    },
    closeTaskModal: (state) => {
      state.selectedTask = null;
      state.showTaskModal = false;
    },
    openAddTaskModal: (state) => {
      state.showAddTaskModal = true;
    },
    closeAddTaskModal: (state) => {
      state.showAddTaskModal = false;
      state.showInviteModal = false;
    },
    openInviteModal: (state) => {
      state.showInviteModal = true;
    },
    closeInviteModal: (state) => {
      state.showInviteModal = false;
    },
    setDragOver: (state, action: PayloadAction<TaskStatus | null>) => {
      state.dragOverColumn = action.payload;
    },
    localMoveTask: (
      state,
      action: PayloadAction<{ taskId: string; newStatus: TaskStatus }>,
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.newStatus;
        task.completed =
          action.payload.newStatus === "done" ||
          action.payload.newStatus === "review";
      }
    },
    localToggleComplete: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed
          ? task.boardType === "plans"
            ? "review"
            : "done"
          : "todo";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.showAddTaskModal = false;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const task = state.tasks.find((t) => t.id === action.payload.taskId);
        if (task) task.comments.push(action.payload.comment);
        if (state.selectedTask?.id === action.payload.taskId) {
          state.selectedTask = task || null;
        }
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        const task = state.tasks.find((t) => t.id === action.payload.taskId);
        if (task) task.status = action.payload.newStatus;
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        const task = state.tasks.find((t) => t.id === action.payload.taskId);
        if (task) task.completed = action.payload.completed;
      });
  },
});

export const {
  setActiveBoard,
  setViewMode,
  setSelectedDate,
  setCalendarSelectedDate,
  setCalendarMonth,
  openTaskModal,
  closeTaskModal,
  openAddTaskModal,
  closeAddTaskModal,
  openInviteModal,
  closeInviteModal,
  setDragOver,
  localMoveTask,
  localToggleComplete,
} = tasksSlice.actions;

export const TasksReducer = tasksSlice.reducer;
