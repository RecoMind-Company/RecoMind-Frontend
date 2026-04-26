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
  dueDate: string;     // ISO string
  dueDateDisplay: string; // "Due in 6h" | "Feb 28" etc.
  isLate?: boolean;
  lateDisplay?: string; // "6 hours Late"
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
  selectedDate: string; // ISO date string
  selectedTask: Task | null;
  showTaskModal: boolean;
  showAddTaskModal: boolean;
  showInviteModal: boolean;
  dragOverColumn: TaskStatus | null;
  loading: boolean;
  error: string | null;
}