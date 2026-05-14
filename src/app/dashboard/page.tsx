import { redirect } from "next/navigation";
import { Grid3X3 } from "lucide-react";
import { DashboardIntro } from "@/components/tasks/dashboard-intro";
import { NewTaskButton } from "@/components/tasks/new-task-button";
import { TaskBoard } from "@/components/tasks/task-board";
import { UserMenu } from "@/components/user-menu";
import { I18nProvider } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/types/task";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <I18nProvider>
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Grid3X3 className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold tracking-tight text-foreground">Eisenhower Planner</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NewTaskButton />
              <UserMenu email={user.email ?? "user@example.com"} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <DashboardIntro />

          <TaskBoard initialTasks={(tasks ?? []) as Task[]} userId={user.id} />
        </main>
      </I18nProvider>
    </div>
  );
}
