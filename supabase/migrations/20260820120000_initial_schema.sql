-- ============================================================================
-- Schema iniziale: Lavagna Tattica + Gestione Squadra
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Controllo accessi: unico "utente vero" ammesso (l'allenatore).
-- Le policy RLS di tutte le tabelle sotto controllano l'appartenenza a questa
-- tabella invece di limitarsi a "auth.uid() is not null", così anche una
-- registrazione pubblica accidentale non dà accesso ai dati.
-- ---------------------------------------------------------------------------
create table app_admins (
  email text primary key
);

alter table app_admins enable row level security;

create policy "app_admins: solo lettura da sé stessi"
  on app_admins for select
  using (email = auth.jwt() ->> 'email');

-- Nessuna policy insert/update/delete: la tabella si popola solo da dashboard
-- Supabase (service_role), mai da client.

-- Funzione helper: l'utente corrente è un admin?
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from app_admins where email = auth.jwt() ->> 'email'
  );
$$;

-- ---------------------------------------------------------------------------
-- Rosa giocatori
-- ---------------------------------------------------------------------------
create table players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  jersey_number int,
  photo_url text,
  status text not null default 'attivo'
    check (status in ('attivo', 'infortunato', 'squalificato', 'altro')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table players enable row level security;
create policy "players: solo admin" on players for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Allenamenti e presenze
-- ---------------------------------------------------------------------------
create table training_sessions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table training_sessions enable row level security;
create policy "training_sessions: solo admin" on training_sessions for all using (is_admin()) with check (is_admin());

create table attendances (
  training_session_id uuid not null references training_sessions(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  status text not null check (status in ('presente', 'assente', 'giustificato')),
  primary key (training_session_id, player_id)
);

alter table attendances enable row level security;
create policy "attendances: solo admin" on attendances for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Partite, convocati, formazione
-- ---------------------------------------------------------------------------
create table matches (
  id uuid primary key default gen_random_uuid(),
  date timestamptz not null,
  opponent text not null,
  notes text,
  result text,
  created_at timestamptz not null default now()
);

alter table matches enable row level security;
create policy "matches: solo admin" on matches for all using (is_admin()) with check (is_admin());

create table match_call_ups (
  match_id uuid not null references matches(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  called_up boolean not null default true,
  primary key (match_id, player_id)
);

alter table match_call_ups enable row level security;
create policy "match_call_ups: solo admin" on match_call_ups for all using (is_admin()) with check (is_admin());

create table formations (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null unique references matches(id) on delete cascade,
  module text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table formations enable row level security;
create policy "formations: solo admin" on formations for all using (is_admin()) with check (is_admin());

create table formation_slots (
  formation_id uuid not null references formations(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  is_starter boolean not null,
  slot_code text,
  bench_order int,
  primary key (formation_id, player_id)
);

alter table formation_slots enable row level security;
create policy "formation_slots: solo admin" on formation_slots for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Valutazioni giocatori
-- ---------------------------------------------------------------------------
create table evaluations (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  date date not null,
  tecnica int not null check (tecnica between 1 and 10),
  tattica int not null check (tattica between 1 and 10),
  fisica int not null check (fisica between 1 and 10),
  mentale int not null check (mentale between 1 and 10),
  notes text,
  created_at timestamptz not null default now()
);

alter table evaluations enable row level security;
create policy "evaluations: solo admin" on evaluations for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Lavagna tattica (schemi + template)
-- ---------------------------------------------------------------------------
create table tactical_schemes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('palla_inattiva', 'offensivo', 'difensivo')),
  subcategory text,
  field_data jsonb not null default '{}'::jsonb,
  is_template boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table tactical_schemes enable row level security;
create policy "tactical_schemes: solo admin" on tactical_schemes for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- updated_at automatico
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger players_set_updated_at before update on players
  for each row execute function set_updated_at();
create trigger formations_set_updated_at before update on formations
  for each row execute function set_updated_at();
create trigger tactical_schemes_set_updated_at before update on tactical_schemes
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Storage: foto giocatori
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('player-photos', 'player-photos', true)
on conflict (id) do nothing;

create policy "player-photos: lettura pubblica"
  on storage.objects for select
  using (bucket_id = 'player-photos');

create policy "player-photos: scrittura solo admin"
  on storage.objects for insert
  with check (bucket_id = 'player-photos' and is_admin());

create policy "player-photos: update solo admin"
  on storage.objects for update
  using (bucket_id = 'player-photos' and is_admin());

create policy "player-photos: delete solo admin"
  on storage.objects for delete
  using (bucket_id = 'player-photos' and is_admin());
