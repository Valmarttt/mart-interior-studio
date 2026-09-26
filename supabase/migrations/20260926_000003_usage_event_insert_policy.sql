drop policy if exists "usage_events_owner_insert" on public.usage_events;
create policy "usage_events_owner_insert" on public.usage_events for insert with check (auth.uid() = user_id);
