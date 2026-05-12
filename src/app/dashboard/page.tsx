import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import { TaskBoard } from "@/components/tasks/task-board";
import { Button } from "@/components/ui/button";
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
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <header className="mx-auto mb-6 flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-wide text-moss">Eisenhower Planner</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Priority workspace</h1>
          <p className="mt-1 text-sm text-ink/60">{user.email}</p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="secondary">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </header>
      <div className="mx-auto max-w-7xl">
        <TaskBoard initialTasks={(tasks ?? []) as Task[]} userId={user.id} />
      </div>
    </main>
  );
}
