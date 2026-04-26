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

export interface Notification {
  id: string;
  sender: string;
  senderAvatar?: string;
  message: string;
  time: string;
  project: string;
  isRead: boolean;
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
  notifications: Notification[];
  notificationsOpen: boolean;
  loading: boolean;
  error: string | null;
}

/* ================= MOCK DATA ================= */
const mockHomeData: Omit<HomeState, "loading" | "error" | "notificationsOpen"> = {
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
  notifications: [
    {
      id: "1",
      sender: "Magdy Mohammed",
      message: "Great job on the report, Ahmed! Your work on the brand aware.......",
      time: "Sat 3:00 pm",
      project: "Q1 Brand Awareness",
      isRead: false,
    },
    {
      id: "2",
      sender: "Magdy Mohammed",
      message: "Great job on the report, Ahmed! Your work on the brand aware.......",
      time: "Sat 3:00 pm",
      project: "Q1 Brand Awareness",
      isRead: false,
    },
    {
      id: "3",
      sender: "Magdy Mohammed",
      message: "Great job on the report, Ahmed! Your work on the brand aware.......",
      time: "Sat 3:00 pm",
      project: "Q1 Brand Awareness",
      isRead: false,
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
      return rejectWithValue(error.response?.data?.message || "Failed to fetch home data");
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  "home/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Connect to API
      // const response = await client.get("/notifications");
      // return response.data;
      return mockHomeData.notifications;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
    }
  }
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
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) notification.isRead = true;
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
    },
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
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
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