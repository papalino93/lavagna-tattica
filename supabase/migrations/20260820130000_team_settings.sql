-- ============================================================================
-- Impostazioni squadra: nome e logo, riga singola.
-- ============================================================================

create table team_settings (
  id boolean primary key default true,
  name text,
  logo_url text,
  updated_at timestamptz not null default now(),
  constraint team_settings_singleton check (id)
);

alter table team_settings enable row level security;
create policy "team_settings: solo admin" on team_settings for all using (is_admin()) with check (is_admin());

create trigger team_settings_set_updated_at before update on team_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Storage: logo squadra
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('team-assets', 'team-assets', true)
on conflict (id) do nothing;

create policy "team-assets: lettura pubblica"
  on storage.objects for select
  using (bucket_id = 'team-assets');

create policy "team-assets: scrittura solo admin"
  on storage.objects for insert
  with check (bucket_id = 'team-assets' and is_admin());

create policy "team-assets: update solo admin"
  on storage.objects for update
  using (bucket_id = 'team-assets' and is_admin());

create policy "team-assets: delete solo admin"
  on storage.objects for delete
  using (bucket_id = 'team-assets' and is_admin());
