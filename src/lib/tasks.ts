import type { Quadrant, QuadrantId, Task } from "@/types/task";

export const quadrants: Quadrant[] = [
  {
    id: "do-now",
    title: "Do Now",
    subtitle: "Urgent and important",
    isUrgent: true,
    isImportant: true
  },
  {
    id: "schedule",
    title: "Schedule",
    subtitle: "Important, not urgent",
    isUrgent: false,
    isImportant: true
  },
  {
    id: "delegate",
    title: "Delegate",
    subtitle: "Urgent, not important",
    isUrgent: true,
    isImportant: false
  },
  {
    id: "eliminate",
    title: "Eliminate",
    subtitle: "Not urgent or important",
    isUrgent: false,
    isImportant: false
  }
];

export function getQuadrantId(task: Pick<Task, "is_urgent" | "is_important">): QuadrantId {
  if (task.is_urgent && task.is_important) return "do-now";
  if (!task.is_urgent && task.is_important) return "schedule";
  if (task.is_urgent && !task.is_important) return "delegate";
  return "eliminate";
}

export function getQuadrantById(id: QuadrantId) {
  return quadrants.find((quadrant) => quadrant.id === id);
}
