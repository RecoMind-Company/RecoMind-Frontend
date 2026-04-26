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

const mockTasks: Task[] = [
  // PLANS BOARD - Overdue
  {
    id: "t1", title: "Prepare product demo presentation", description: "Conduct a comprehensive code review for the authentication module and ensure all API endpoints are secured before the production deployment.",
    project: "Q1 Brand Awareness", status: "overdue", priority: "HIGH", dueDate: new Date().toISOString(),
    dueDateDisplay: "6 hours Late", isLate: true, lateDisplay: "6 hours Late",
    assignees: [mockMembers[0]!, mockMembers[1]!], comments: mockComments, boardType: "plans", completed: false,
  },
  {
    id: "t2", title: "Prepare product demo presentation", description: "Conduct a comprehensive code review for the authentication module.",
    project: "Q1 Brand Awareness", status: "overdue", priority: "HIGH", dueDate: new Date().toISOString(),
    dueDateDisplay: "6 hours Late", isLate: true, lateDisplay: "6 hours Late",
    assignees: [mockMembers[0]!, mockMembers[1]!], comments: mockComments, boardType: "plans", completed: false,
  },
  {
    id: "t3", title: "Prepare product demo presentation", description: "Review and finalize the brand campaign assets.",
    project: "Q1 Brand Awareness", status: "overdue", priority: "HIGH", dueDate: new Date().toISOString(),
    dueDateDisplay: "6 hours Late", isLate: true, lateDisplay: "6 hours Late",
    assignees: [mockMembers[0]!, mockMembers[1]!], comments: [], boardType: "plans", completed: false,
  },
  // PLANS BOARD - Todo
  {
    id: "t4", title: "Prepare product demo presentation", description: "Prepare the product demo slides for the upcoming client meeting.",
    project: "Q1 Brand Awareness", status: "todo", priority: "HIGH", dueDate: new Date().toISOString(),
    dueDateDisplay: "Due in 6h", assignees: [mockMembers[0]!, mockMembers[1]!], comments: mockComments, boardType: "plans", completed: false,
  },
  {
    id: "t5", title: "Prepare product demo presentation",
    project: "Brand Awareness", status: "todo", priority: "MEDIUM", dueDate: new Date().toISOString(),
    dueDateDisplay: "Due in 6h", assignees: [mockMembers[0]!, mockMembers[1]!], comments: [], boardType: "plans", completed: false,
  },
  {
    id: "t6", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "todo", priority: "LOW", dueDate: new Date().toISOString(),
    dueDateDisplay: "Due in 6h", assignees: [mockMembers[0]!, mockMembers[1]!], comments: [], boardType: "plans", completed: false,
  },
  // PLANS BOARD - Review/Done
  {
    id: "t7", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "review", priority: "HIGH", dueDate: "2025-02-28T00:00:00Z",
    dueDateDisplay: "Feb 28", assignees: [mockMembers[0]!, mockMembers[1]!], comments: mockComments, boardType: "plans", completed: true,
  },
  {
    id: "t8", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "review", priority: "MEDIUM", dueDate: "2025-02-28T00:00:00Z",
    dueDateDisplay: "Feb 28", assignees: [mockMembers[0]!], comments: [], boardType: "plans", completed: true,
  },
  {
    id: "t9", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "review", priority: "LOW", dueDate: "2025-02-28T00:00:00Z",
    dueDateDisplay: "Feb 28", assignees: [mockMembers[1]!], comments: [], boardType: "plans", completed: true,
  },
  // PERSONAL BOARD - Overdue
  {
    id: "t10", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "overdue", priority: "HIGH", dueDate: new Date().toISOString(),
    dueDateDisplay: "Due in 6h", assignees: [], comments: [], boardType: "personal", completed: false,
  },
  {
    id: "t11", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "overdue", priority: "HIGH", dueDate: new Date().toISOString(),
    dueDateDisplay: "Due in 6h", assignees: [], comments: [], boardType: "personal", completed: false,
  },
  {
    id: "t12", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "overdue", priority: "HIGH", dueDate: new Date().toISOString(),
    dueDateDisplay: "Due in 6h", assignees: [], comments: [], boardType: "personal", completed: false,
  },
  // PERSONAL BOARD - Todo
  {
    id: "t13", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "todo", priority: "LOW", dueDate: new Date().toISOString(),
    dueDateDisplay: "Due in 6h", assignees: [], comments: [], boardType: "personal", completed: false,
  },
  {
    id: "t14", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "todo", priority: "LOW", dueDate: new Date().toISOString(),
    dueDateDisplay: "Due in 6h", assignees: [], comments: [], boardType: "personal", completed: false,
  },
  {
    id: "t15", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "todo", priority: "LOW", dueDate: new Date().toISOString(),
    dueDateDisplay: "Due in 6h", assignees: [], comments: [], boardType: "personal", completed: false,
  },
  // PERSONAL BOARD - Done
  {
    id: "t16", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "done", priority: "HIGH", dueDate: "2025-02-28T00:00:00Z",
    dueDateDisplay: "Feb 28", assignees: [], comments: [], boardType: "personal", completed: true,
  },
  {
    id: "t17", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "done", priority: "MEDIUM", dueDate: "2025-02-28T00:00:00Z",
    dueDateDisplay: "Feb 28", assignees: [], comments: [], boardType: "personal", completed: true,
  },
  {
    id: "t18", title: "Prepare product demo presentation",
    project: "Q1 Brand Awareness", status: "done", priority: "LOW", dueDate: "2025-02-28T00:00:00Z",
    dueDateDisplay: "Feb 28", assignees: [], comments: [], boardType: "personal", completed: true,
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
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks");
    }
  }
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
      return rejectWithValue(error.response?.data?.message || "Failed to fetch members");
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task: Omit<Task, "id" | "comments" | "completed">, { rejectWithValue }) => {
    try {
      // TODO: Connect to API
      // const response = await client.post("/tasks", task);
      // return response.data;
      return { ...task, id: `t${Date.now()}`, comments: [], completed: false } as Task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create task");
    }
  }
);

export const addComment = createAsyncThunk(
  "tasks/addComment",
  async ({ taskId, text }: { taskId: string; text: string }, { rejectWithValue }) => {
    try {
      // TODO: Connect to API
      // const response = await client.post(`/tasks/${taskId}/comments`, { text });
      // return { taskId, comment: response.data };
      const comment: Comment = {
        id: `c${Date.now()}`,
        author: "Ahmed Hassan",
        time: new Date().toLocaleTimeString("en-US", { weekday: "short", hour: "2-digit", minute: "2-digit" }),
        text,
      };
      return { taskId, comment };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add comment");
    }
  }
);

export const moveTask = createAsyncThunk(
  "tasks/moveTask",
  async ({ taskId, newStatus }: { taskId: string; newStatus: TaskStatus }, { rejectWithValue }) => {
    try {
      // TODO: Connect to API
      // await client.patch(`/tasks/${taskId}`, { status: newStatus });
      return { taskId, newStatus };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to move task");
    }
  }
);

export const toggleTaskComplete = createAsyncThunk(
  "tasks/toggleComplete",
  async ({ taskId, completed }: { taskId: string; completed: boolean }, { rejectWithValue }) => {
    try {
      // TODO: Connect to API
      // await client.patch(`/tasks/${taskId}`, { completed });
      return { taskId, completed };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update task");
    }
  }
);

// ================= SLICE =================
const today = new Date().toISOString().split("T")[0]!;

const initialState: TasksState = {
  tasks: mockTasks,
  activeBoard: "plans",
  viewMode: "board",
  selectedDate: today,
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
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
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
    // Optimistic local move for drag & drop
    localMoveTask: (state, action: PayloadAction<{ taskId: string; newStatus: TaskStatus }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.newStatus;
        if (action.payload.newStatus === "done" || action.payload.newStatus === "review") {
          task.completed = true;
        } else {
          task.completed = false;
        }
      }
    },
    localToggleComplete: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        if (task.completed) {
          task.status = task.boardType === "plans" ? "review" : "done";
        } else {
          task.status = "todo";
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; })
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
  setActiveBoard, setViewMode, setSelectedDate,
  openTaskModal, closeTaskModal,
  openAddTaskModal, closeAddTaskModal,
  openInviteModal, closeInviteModal,
  setDragOver, localMoveTask, localToggleComplete,
} = tasksSlice.actions;

export const TasksReducer = tasksSlice.reducer;