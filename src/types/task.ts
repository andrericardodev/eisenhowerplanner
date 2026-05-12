export type TaskCategory = "personal" | "work";
export type TaskStatus = "pending" | "completed" | "archived";

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: TaskCategory;
  is_urgent: boolean;
  is_important: boolean;
  status: TaskStatus;
  due_date: string | null;
  position: number | null;
  created_at: string;
  updated_at: string;
};

export type QuadrantId = "do-now" | "schedule" | "delegate" | "eliminate";

export type Quadrant = {
  id: QuadrantId;
  title: string;
  subtitle: string;
  isUrgent: boolean;
  isImportant: boolean;
};
