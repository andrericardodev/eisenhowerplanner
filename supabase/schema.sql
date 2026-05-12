create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'personal',
  is_urgent boolean not null default false,
  is_important boolean not null default false,
  status text not null default 'pending',
  due_date date,
  position integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint tasks_category_check check (category in ('personal', 'work')),
  constraint tasks_status_check check (status in ('pending', 'completed', 'archived'))
);

create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_user_category_status_idx on public.tasks(user_id, category, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_set_updated_at on public.tasks;

create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

alter table public.tasks enable row level security;

drop policy if exists "Users can view own tasks" on public.tasks;
drop policy if exists "Users can insert own tasks" on public.tasks;
drop policy if exists "Users can update own tasks" on public.tasks;
drop policy if exists "Users can delete own tasks" on public.tasks;

create policy "Users can view own tasks"
on public.tasks
for select
using (auth.uid() = user_id);

create policy "Users can insert own tasks"
on public.tasks
for insert
with check (auth.uid() = user_id);

create policy "Users can update own tasks"
on public.tasks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own tasks"
on public.tasks
for delete
using (auth.uid() = user_id);
