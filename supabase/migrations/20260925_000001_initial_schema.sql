create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  locale text not null default 'en' check (locale in ('en', 'ru')),
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled room',
  room_type text not null,
  original_image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  style_id text not null,
  settings jsonb not null default '{}'::jsonb,
  idempotency_key text,
  result_image_path text,
  error_code text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.styles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  prompt_description text not null,
  image_path text,
  enabled boolean not null default true
);

insert into public.styles (slug, name, prompt_description)
values
  ('japandi', 'Japandi', 'Calm Japandi restraint with natural wood, tactile linen and quiet asymmetry.'),
  ('scandinavian', 'Scandinavian', 'Light Scandinavian warmth with practical forms, pale wood and lived-in softness.'),
  ('industrial', 'Industrial Loft', 'Refined industrial character with honest materials, warm metal and structured contrast.'),
  ('modern', 'Modern', 'Warm modern clarity with clean lines, considered contrast and soft architectural details.'),
  ('classic', 'Classic', 'Timeless classic proportion with crafted details, balanced symmetry and subtle texture.'),
  ('minimalist', 'Minimalist', 'Quiet minimalist composition with fewer objects, generous negative space and precise details.')
on conflict (slug) do update set
  name = excluded.name,
  prompt_description = excluded.prompt_description,
  enabled = true;

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  generation_id uuid references public.generations(id) on delete set null,
  event_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  generation_limit integer,
  enabled boolean not null default true
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  status text not null,
  period_end timestamptz
);

create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_updated_at_idx on public.projects(updated_at desc);
create index if not exists generations_project_id_idx on public.generations(project_id);
create index if not exists generations_status_created_at_idx on public.generations(status, created_at desc);
create unique index if not exists generations_project_idempotency_key_idx on public.generations(project_id, idempotency_key) where idempotency_key is not null;
create index if not exists usage_events_user_id_idx on public.usage_events(user_id);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.generations enable row level security;
alter table public.styles enable row level security;
alter table public.usage_events enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "projects_owner_all" on public.projects;
create policy "projects_owner_all" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "generations_project_owner_all" on public.generations;
create policy "generations_project_owner_all" on public.generations for all using (
  exists (select 1 from public.projects where projects.id = generations.project_id and projects.user_id = auth.uid())
) with check (
  exists (select 1 from public.projects where projects.id = generations.project_id and projects.user_id = auth.uid())
);

drop policy if exists "styles_read_enabled" on public.styles;
create policy "styles_read_enabled" on public.styles for select using (enabled = true);
drop policy if exists "usage_events_owner_read" on public.usage_events;
create policy "usage_events_owner_read" on public.usage_events for select using (auth.uid() = user_id);
drop policy if exists "usage_events_owner_insert" on public.usage_events;
create policy "usage_events_owner_insert" on public.usage_events for insert with check (auth.uid() = user_id);
drop policy if exists "plans_read_enabled" on public.plans;
create policy "plans_read_enabled" on public.plans for select using (enabled = true);
drop policy if exists "subscriptions_owner_read" on public.subscriptions;
create policy "subscriptions_owner_read" on public.subscriptions for select using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', false)
on conflict (id) do update set public = false;

drop policy if exists "project_images_owner_read" on storage.objects;
create policy "project_images_owner_read" on storage.objects for select to authenticated using (
  bucket_id = 'project-images' and (storage.foldername(name))[1] = (select auth.uid()::text)
);
drop policy if exists "project_images_owner_insert" on storage.objects;
create policy "project_images_owner_insert" on storage.objects for insert to authenticated with check (
  bucket_id = 'project-images' and (storage.foldername(name))[1] = (select auth.uid()::text)
);
drop policy if exists "project_images_owner_update" on storage.objects;
create policy "project_images_owner_update" on storage.objects for update to authenticated using (
  bucket_id = 'project-images' and (storage.foldername(name))[1] = (select auth.uid()::text)
);
drop policy if exists "project_images_owner_delete" on storage.objects;
create policy "project_images_owner_delete" on storage.objects for delete to authenticated using (
  bucket_id = 'project-images' and (storage.foldername(name))[1] = (select auth.uid()::text)
);
