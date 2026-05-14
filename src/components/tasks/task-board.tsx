"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AlertTriangle, Calendar, Check, Clock, Inbox, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";
import { getQuadrantById, getQuadrantId, quadrants } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/browser";
import type { QuadrantId, Task, TaskCategory } from "@/types/task";

type TaskBoardProps = {
  initialTasks: Task[];
  userId: string;
};

type StatusFilter = "pending" | "completed";

type TaskFormState = {
  title: string;
  description: string;
  category: TaskCategory;
  is_urgent: boolean;
  is_important: boolean;
  due_date: string;
};

const emptyForm: TaskFormState = {
  title: "",
  description: "",
  category: "personal",
  is_urgent: true,
  is_important: true,
  due_date: ""
};

const quadrantStyles: Record<
  QuadrantId,
  {
    icon: ReactNode;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    titleKey: TranslationKey;
    subtitleKey: TranslationKey;
    emptyKey: TranslationKey;
  }
> = {
  "do-now": {
    icon: <AlertTriangle className="size-4" />,
    colorClass: "text-quadrant-do",
    bgClass: "bg-quadrant-do-bg",
    borderClass: "border-quadrant-do/20",
    titleKey: "doNow",
    subtitleKey: "doNowDesc",
    emptyKey: "doNowEmpty"
  },
  schedule: {
    icon: <Calendar className="size-4" />,
    colorClass: "text-quadrant-schedule",
    bgClass: "bg-quadrant-schedule-bg",
    borderClass: "border-quadrant-schedule/20",
    titleKey: "schedule",
    subtitleKey: "scheduleDesc",
    emptyKey: "scheduleEmpty"
  },
  delegate: {
    icon: <Users className="size-4" />,
    colorClass: "text-quadrant-delegate",
    bgClass: "bg-quadrant-delegate-bg",
    borderClass: "border-quadrant-delegate/20",
    titleKey: "delegate",
    subtitleKey: "delegateDesc",
    emptyKey: "delegateEmpty"
  },
  eliminate: {
    icon: <Inbox className="size-4" />,
    colorClass: "text-quadrant-eliminate",
    bgClass: "bg-quadrant-eliminate-bg",
    borderClass: "border-quadrant-eliminate/20",
    titleKey: "eliminate",
    subtitleKey: "eliminateDesc",
    emptyKey: "eliminateEmpty"
  }
};

export function TaskBoard({ initialTasks, userId }: TaskBoardProps) {
  const { t } = useI18n();
  const supabase = createClient();
  const [tasks, setTasks] = useState(initialTasks);
  const [category, setCategory] = useState<TaskCategory | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [form, setForm] = useState<TaskFormState>(emptyForm);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    function openNewTaskModal() {
      setEditingTask(null);
      setForm(emptyForm);
      setError(null);
      setIsFormOpen(true);
    }

    window.addEventListener("eisenhower:new-task", openNewTaskModal);
    return () => window.removeEventListener("eisenhower:new-task", openNewTaskModal);
  }, []);

  const visibleTasks = useMemo(() => {
    return tasks
      .filter((task) => task.status !== "archived")
      .filter((task) => category === "all" || task.category === category)
      .filter((task) => (status === "completed" ? task.status === "completed" : task.status !== "completed"))
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [category, status, tasks]);

  const taskCounts = useMemo(() => {
    const activeTasks = tasks.filter((task) => task.status !== "archived");

    return {
      total: activeTasks.length,
      pending: activeTasks.filter((task) => task.status !== "completed").length,
      completed: activeTasks.filter((task) => task.status === "completed").length
    };
  }, [tasks]);

  function startEditing(task: Task) {
    setError(null);
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description ?? "",
      category: task.category,
      is_urgent: task.is_urgent,
      is_important: task.is_important,
      due_date: task.due_date ?? ""
    });
    setIsFormOpen(true);
  }

  function resetForm() {
    setEditingTask(null);
    setForm(emptyForm);
    setError(null);
    setIsFormOpen(false);
  }

  async function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category,
      is_urgent: form.is_urgent,
      is_important: form.is_important,
      due_date: form.due_date || null
    };

    if (!payload.title) return;

    if (editingTask) {
      const { data, error: updateError } = await supabase
        .from("tasks")
        .update(payload)
        .eq("id", editingTask.id)
        .select()
        .single();

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setTasks((current) => current.map((task) => (task.id === data.id ? (data as Task) : task)));
      resetForm();
      return;
    }

    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert({
        ...payload,
        user_id: userId,
        position: tasks.length
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setTasks((current) => [data as Task, ...current]);
    resetForm();
  }

  async function toggleCompleted(task: Task) {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    const { data, error: updateError } = await supabase
      .from("tasks")
      .update({ status: nextStatus })
      .eq("id", task.id)
      .select()
      .single();

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setTasks((current) => current.map((item) => (item.id === task.id ? (data as Task) : item)));
  }

  async function deleteTask(taskId: string) {
    const { error: deleteError } = await supabase.from("tasks").delete().eq("id", taskId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setTasks((current) => current.filter((task) => task.id !== taskId));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id);
    const quadrantId = event.over?.id as QuadrantId | undefined;
    const quadrant = quadrantId ? getQuadrantById(quadrantId) : undefined;

    if (!quadrant) return;

    const task = tasks.find((item) => item.id === taskId);
    if (!task || getQuadrantId(task) === quadrantId) return;

    setTasks((current) =>
      current.map((item) =>
        item.id === taskId
          ? { ...item, is_urgent: quadrant.isUrgent, is_important: quadrant.isImportant }
          : item
      )
    );

    const { data, error: updateError } = await supabase
      .from("tasks")
      .update({ is_urgent: quadrant.isUrgent, is_important: quadrant.isImportant })
      .eq("id", taskId)
      .select()
      .single();

    if (updateError) {
      setError(updateError.message);
      setTasks((current) => current.map((item) => (item.id === taskId ? task : item)));
      return;
    }

    setTasks((current) => current.map((item) => (item.id === taskId ? (data as Task) : item)));
  }

  return (
    <>
      <section className="grid gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("matrix")}</h2>
            <p className="text-sm text-muted-foreground">
              {visibleTasks.length} {t("visibleTasks")}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <SegmentedControl
              label={t("category")}
              options={["all", "personal", "work"]}
              labels={{ all: t("all"), personal: t("personal"), work: t("work") }}
              value={category}
              onChange={(option) => setCategory(option)}
            />
            <SegmentedControl
              label={t("status")}
              options={["pending", "completed"]}
              labels={{ pending: t("pending"), completed: t("completed") }}
              value={status}
              onChange={(option) => setStatus(option)}
            />
          </div>
        </div>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid min-h-[640px] grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
            {quadrants.map((quadrant) => (
              <QuadrantColumn
                key={quadrant.id}
                quadrantId={quadrant.id}
                tasks={visibleTasks.filter((task) => getQuadrantId(task) === quadrant.id)}
                onEdit={startEditing}
                onDelete={deleteTask}
                onToggleCompleted={toggleCompleted}
                t={t}
              />
            ))}
          </div>
        </DndContext>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-center text-sm text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">{taskCounts.total}</span> {t("totalTasks")}
          </div>
          <div>
            <span className="font-semibold text-foreground">{taskCounts.pending}</span> {t("pendingTasks")}
          </div>
          <div>
            <span className="font-semibold text-foreground">{taskCounts.completed}</span> {t("completedTasks")}
          </div>
        </div>
      </section>

      {isFormOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/35 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-card-foreground">
                  {editingTask ? t("editTask") : t("newTask")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("pageDescription")}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="size-9 rounded-full px-0"
                onClick={resetForm}
                title="Close"
              >
                <X className="size-4" />
              </Button>
            </div>

            <form className="mt-5 grid gap-4" onSubmit={saveTask}>
              <Field label={t("taskTitle")}>
                <Input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder={t("taskTitlePlaceholder")}
                  required
                  autoFocus
                />
              </Field>
              <Field label={t("description")}>
                <Textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder={t("descriptionPlaceholder")}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("category")}>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, category: event.target.value as TaskCategory }))
                    }
                    className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  >
                    <option value="personal">{t("personal")}</option>
                    <option value="work">{t("work")}</option>
                  </select>
                </Field>
                <Field label={t("dueDate")}>
                  <Input
                    type="date"
                    value={form.due_date}
                    onChange={(event) => setForm((current) => ({ ...current, due_date: event.target.value }))}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={form.is_urgent}
                    onChange={(event) => setForm((current) => ({ ...current, is_urgent: event.target.checked }))}
                  />
                  {t("urgent")}
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={form.is_important}
                    onChange={(event) => setForm((current) => ({ ...current, is_important: event.target.checked }))}
                  />
                  {t("important")}
                </label>
              </div>
              {error ? <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="size-4" />
                {editingTask ? t("saveChanges") : t("addTask")}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

type SegmentedControlProps<T extends string> = {
  label: string;
  options: readonly T[];
  labels: Record<T, string>;
  value: T;
  onChange: (value: T) => void;
};

function SegmentedControl<T extends string>({ label, options, labels, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">{label}:</span>
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "h-8 rounded-md px-3 text-sm font-medium text-muted-foreground transition-all hover:text-foreground",
              value === option && "bg-card text-foreground shadow-sm"
            )}
          >
            {labels[option]}
          </button>
        ))}
      </div>
    </div>
  );
}

type QuadrantColumnProps = {
  quadrantId: QuadrantId;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleCompleted: (task: Task) => void;
  t: (key: TranslationKey) => string;
};

function QuadrantColumn({ quadrantId, tasks, onEdit, onDelete, onToggleCompleted, t }: QuadrantColumnProps) {
  const quadrant = getQuadrantById(quadrantId)!;
  const style = quadrantStyles[quadrantId];
  const { isOver, setNodeRef } = useDroppable({ id: quadrantId });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition",
        isOver && "border-primary bg-primary/5"
      )}
    >
      <div className={cn("border-b px-5 py-4", style.bgClass, style.borderClass)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={cn("flex size-8 items-center justify-center rounded-lg", style.bgClass, style.colorClass)}>
              {style.icon}
            </div>
            <div>
              <h3 className={cn("text-sm font-semibold", style.colorClass)}>{t(style.titleKey)}</h3>
              <p className="text-xs text-muted-foreground">{t(style.subtitleKey)}</p>
            </div>
          </div>
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
              style.bgClass,
              style.colorClass
            )}
          >
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="flex-1 p-4">
        {tasks.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center">
            <div className={cn("mb-3 flex size-10 items-center justify-center rounded-full opacity-60", style.bgClass, style.colorClass)}>
              <Clock className="size-5" />
            </div>
            <p className="px-4 text-sm text-muted-foreground">{t(style.emptyKey)}</p>
          </div>
        ) : (
          <div className="flex min-h-40 flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleCompleted={onToggleCompleted}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleCompleted: (task: Task) => void;
  t: (key: TranslationKey) => string;
};

function TaskCard({ task, onEdit, onDelete, onToggleCompleted, t }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md",
        isDragging && "z-10 opacity-70",
        task.status === "completed" && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          className="min-w-0 flex-1 cursor-grab text-left active:cursor-grabbing"
          {...listeners}
          {...attributes}
        >
          <h4
            className={cn(
              "text-balance font-medium leading-snug text-foreground",
              task.status === "completed" && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h4>
          {task.description ? <p className="mt-2 text-sm leading-5 text-muted-foreground">{task.description}</p> : null}
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <IconButton
            title={task.status === "completed" ? t("markAsPending") : t("markAsCompleted")}
            onClick={() => onToggleCompleted(task)}
            className={cn(
              task.status === "completed"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Check className="size-4" />
          </IconButton>
          <IconButton title={t("editTask")} onClick={() => onEdit(task)} className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
            <Pencil className="size-4" />
          </IconButton>
          <IconButton title={t("deleteTask")} onClick={() => onDelete(task.id)} className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
            <Trash2 className="size-4" />
          </IconButton>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span
          className={cn(
            "rounded-md border px-2 py-1 font-normal capitalize",
            task.category === "personal"
              ? "border-quadrant-schedule/20 bg-quadrant-schedule-bg text-quadrant-schedule"
              : "border-quadrant-delegate/20 bg-quadrant-delegate-bg text-quadrant-delegate"
          )}
        >
          {task.category === "personal" ? t("personal") : t("work")}
        </span>
        {task.due_date ? (
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(task.due_date)}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function IconButton({
  title,
  children,
  onClick,
  className
}: {
  title: string;
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short"
  });
}
