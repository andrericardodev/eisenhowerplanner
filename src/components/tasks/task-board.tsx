"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useFormatter, useTranslations } from "next-intl";
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
import { Calendar, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { getQuadrantById, getQuadrantId, quadrants } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/browser";
import type { QuadrantId, Task, TaskCategory } from "@/types/task";

type TaskBoardProps = {
  initialTasks: Task[];
  userId: string;
};

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

export function TaskBoard({ initialTasks, userId }: TaskBoardProps) {
  const supabase = createClient();
  const t = useTranslations("Tasks");
  const [tasks, setTasks] = useState(initialTasks);
  const [category, setCategory] = useState<TaskCategory | "all">("all");
  const [form, setForm] = useState<TaskFormState>(emptyForm);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const visibleTasks = useMemo(() => {
    return tasks
      .filter((task) => task.status !== "archived")
      .filter((task) => category === "all" || task.category === category)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [category, tasks]);

  function startEditing(task: Task) {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description ?? "",
      category: task.category,
      is_urgent: task.is_urgent,
      is_important: task.is_important,
      due_date: task.due_date ?? ""
    });
  }

  function resetForm() {
    setEditingTask(null);
    setForm(emptyForm);
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
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-ink">
              {editingTask ? t("form.editTitle") : t("form.newTitle")}
            </h2>
            <p className="mt-1 text-sm text-ink/60">{t("form.subtitle")}</p>
          </div>
          {editingTask ? (
            <Button type="button" variant="ghost" className="h-9 w-9 px-0" onClick={resetForm} title={t("form.cancel")}>
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>

        <form className="mt-5 grid gap-4" onSubmit={saveTask}>
          <Field label={t("form.title")}>
            <Input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder={t("form.titlePlaceholder")}
              required
            />
          </Field>
          <Field label={t("form.description")}>
            <Textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder={t("form.descriptionPlaceholder")}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("form.category")}>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value as TaskCategory }))
                }
                className="h-10 rounded-md border border-ink/15 bg-white px-3 text-sm outline-none focus:border-moss focus:ring-2 focus:ring-moss/15"
              >
                <option value="personal">{t("categories.personal")}</option>
                <option value="work">{t("categories.work")}</option>
              </select>
            </Field>
            <Field label={t("form.dueDate")}>
              <Input
                type="date"
                value={form.due_date}
                onChange={(event) => setForm((current) => ({ ...current, due_date: event.target.value }))}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 rounded-md border border-ink/10 px-3 py-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.is_urgent}
                onChange={(event) => setForm((current) => ({ ...current, is_urgent: event.target.checked }))}
              />
              {t("form.urgent")}
            </label>
            <label className="flex items-center gap-2 rounded-md border border-ink/10 px-3 py-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.is_important}
                onChange={(event) => setForm((current) => ({ ...current, is_important: event.target.checked }))}
              />
              {t("form.important")}
            </label>
          </div>
          {error ? <p className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}
          <Button type="submit">
            <Plus className="h-4 w-4" />
            {editingTask ? t("form.saveChanges") : t("form.addTask")}
          </Button>
        </form>
      </aside>

      <section className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ink">{t("matrix.title")}</h2>
            <p className="text-sm text-ink/60">{t("matrix.activeTasks", { count: visibleTasks.length })}</p>
          </div>
          <div className="flex rounded-md border border-ink/10 bg-white p-1">
            {(["all", "personal", "work"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                className={cn(
                  "h-8 rounded px-3 text-sm font-semibold capitalize text-ink/65",
                  category === option && "bg-graphite text-white"
                )}
              >
                {t(`filters.${option}`)}
              </button>
            ))}
          </div>
        </div>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid min-h-[640px] gap-4 lg:grid-cols-2">
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
      </section>
    </div>
  );
}

type QuadrantColumnProps = {
  quadrantId: QuadrantId;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleCompleted: (task: Task) => void;
  t: ReturnType<typeof useTranslations<"Tasks">>;
};

function QuadrantColumn({ quadrantId, tasks, onEdit, onDelete, onToggleCompleted, t }: QuadrantColumnProps) {
  const quadrant = getQuadrantById(quadrantId)!;
  const { isOver, setNodeRef } = useDroppable({ id: quadrantId });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg border border-ink/10 bg-white/80 p-4 shadow-soft transition",
        isOver && "border-moss bg-moss/10"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-ink">{t(`quadrants.${quadrant.id}.title`)}</h3>
          <p className="text-sm text-ink/55">{t(`quadrants.${quadrant.id}.subtitle`)}</p>
        </div>
        <span className="rounded bg-ink/5 px-2 py-1 text-xs font-bold text-ink/60">{tasks.length}</span>
      </div>
      <div className="mt-4 grid min-h-40 content-start gap-3">
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
    </div>
  );
}

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleCompleted: (task: Task) => void;
  t: ReturnType<typeof useTranslations<"Tasks">>;
};

function TaskCard({ task, onEdit, onDelete, onToggleCompleted, t }: TaskCardProps) {
  const format = useFormatter();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = {
    transform: CSS.Translate.toString(transform)
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition",
        isDragging && "z-10 opacity-70",
        task.status === "completed" && "bg-ink/[0.03]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          className="min-w-0 flex-1 cursor-grab text-left active:cursor-grabbing"
          {...listeners}
          {...attributes}
        >
          <h4 className={cn("font-semibold text-ink", task.status === "completed" && "line-through text-ink/45")}>
            {task.title}
          </h4>
          {task.description ? <p className="mt-2 text-sm leading-5 text-ink/60">{task.description}</p> : null}
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <IconButton title={t("actions.toggleCompleted")} onClick={() => onToggleCompleted(task)}>
            <Check className="h-4 w-4" />
          </IconButton>
          <IconButton title={t("actions.edit")} onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4" />
          </IconButton>
          <IconButton title={t("actions.delete")} onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink/55">
        <span className="rounded bg-moss/10 px-2 py-1 text-moss">{t(`categories.${task.category}`)}</span>
        {task.due_date ? (
          <span className="inline-flex items-center gap-1 rounded bg-ink/5 px-2 py-1">
            <Calendar className="h-3.5 w-3.5" />
            {format.dateTime(new Date(`${task.due_date}T00:00:00`), {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function IconButton({
  title,
  children,
  onClick
}: {
  title: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink/55 transition hover:bg-ink/5 hover:text-ink"
    >
      {children}
    </button>
  );
}
