"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export function NewTaskButton() {
  const t = useTranslations("Tasks");

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("eisenhower:new-task"))}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
    >
      <Plus className="size-4" />
      <span className="hidden sm:inline">{t("form.newTitle")}</span>
    </button>
  );
}
