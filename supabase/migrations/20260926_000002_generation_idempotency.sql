alter table public.generations add column if not exists idempotency_key text;
create unique index if not exists generations_project_idempotency_key_idx on public.generations(project_id, idempotency_key) where idempotency_key is not null;
