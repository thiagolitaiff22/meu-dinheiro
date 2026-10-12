-- Meu Dinheiro: tabela única, protegida por login (RLS).
-- Já executado no projeto "meu-dinheiro". Guardado aqui como referência.

create table if not exists public.app_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

create policy "dono le"       on public.app_state for select using (auth.uid() = user_id);
create policy "dono insere"   on public.app_state for insert with check (auth.uid() = user_id);
create policy "dono atualiza" on public.app_state for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "dono apaga"    on public.app_state for delete using (auth.uid() = user_id);

grant select, insert, update, delete on public.app_state to authenticated;
