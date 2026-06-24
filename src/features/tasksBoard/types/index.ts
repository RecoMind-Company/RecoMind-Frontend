// ================= ENUMS =================
export type TaskStatus = "overdue" | "todo" | "review" | "done";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type BoardType = "plans" | "personal";
export type ViewMode = "board" | "calendar";

// ================= MODELS =================
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  time: string;
  text: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO string — full date used for calendar matching
  dueDateDisplay: string; // "Due in 6h" | "Feb 28" etc.
  isLate: boolean | undefined;
  lateDisplay: string | undefined;
  assignees: TeamMember[];
  comments: Comment[];
  boardType: BoardType;
  completed: boolean;
}

// ================= STATE =================
export interface TasksState {
  tasks: Task[];
  activeBoard: BoardType;
  viewMode: ViewMode;
  selectedDate: string; // board date strip — ISO date "YYYY-MM-DD"
  calendarSelectedDate: string | null; // calendar clicked day — ISO date "YYYY-MM-DD" | null
  calendarMonth: string; // "YYYY-MM" for the displayed calendar month
  selectedTask: Task | null;
  showTaskModal: boolean;
  showAddTaskModal: boolean;
  showInviteModal: boolean;
  dragOverColumn: TaskStatus | null;
  loading: boolean;
  error: string | null;
}

// ================= PLAN TYPES =================
export interface Plan {
  id: string;
  description: string;
  goal: string;
  planType: string;
  status: string;
  isApproved: boolean;
  duration: string;
}

export interface PlanApiResponse {
  value: Plan;
  isSuccess: boolean;
  isFailure: boolean;
  error: string | null;
}
