import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ================= TYPES ================= */
export interface Task {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  status: "overdue" | "in-progress" | "todo" | "completed";
  assignees: string[];
}

export interface WeeklyPlan {
  title: string;
  subtitle: string;
  completionPercentage: number;
  tasksDone: number;
  inProgress: number;
  overdue: number;
}

export interface WeeklyStats {
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface HomeState {
  userName: string;
  greeting: string;
  totalTasksToday: number;
  overdueCount: number;
  weeklyPlan: WeeklyPlan;
  weeklyStats: WeeklyStats;
  dailyFocusTasks: Task[];
  notificationsOpen: boolean;
  loading: boolean;
  error: string | null;
}

/* ================= MOCK DATA ================= */
const mockHomeData: Omit<HomeState, "loading" | "error" | "notificationsOpen"> =
  {
    userName: "Ahmed Hassan",
    greeting: "Good Morning",
    totalTasksToday: 3,
    overdueCount: 2,
    weeklyPlan: {
      title: "Marketing Plan",
      subtitle: "completed this week",
      completionPercentage: 12,
      tasksDone: 3,
      inProgress: 2,
      overdue: 2,
    },
    weeklyStats: {
      inProgress: 2,
      completed: 3,
      overdue: 2,
    },
    dailyFocusTasks: [
      {
        id: "1",
        title: "Design campaign materials",
        project: "Q1 Brand Awareness",
        dueDate: "Was due: Mar 10 at 5 PM",
        status: "overdue",
        assignees: ["user1"],
      },
      {
        id: "2",
        title: "Complete market research",
        project: "Q1 Brand Awareness",
        dueDate: "Was due: Mar 10 at 5 PM",
        status: "overdue",
        assignees: ["user1", "user2"],
      },
      {
        id: "3",
        title: "Create content strategy",
        project: "Q1 Brand Awareness",
        dueDate: "Due today at 5 PM",
        status: "todo",
        assignees: ["user1", "user2"],
      },
    ],
  };

/* ================= ASYNC THUNKS ================= */
// Ready to connect to API - just uncomment and update
export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Connect to API
      // const response = await client.get("/home");
      // return response.data;

      // Mock data for now
      return mockHomeData;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch home data",
      );
    }
  },
);

/* ================= SLICE ================= */
const initialState: HomeState = {
  ...mockHomeData,
  notificationsOpen: false,
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    toggleNotifications: (state) => {
      state.notificationsOpen = !state.notificationsOpen;
    },
    closeNotifications: (state) => {
      state.notificationsOpen = false;
    },
    markNotificationRead: (state) => state,
    markAllNotificationsRead: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  toggleNotifications,
  closeNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = homeSlice.actions;

export const HomeReducer = homeSlice.reducer;
