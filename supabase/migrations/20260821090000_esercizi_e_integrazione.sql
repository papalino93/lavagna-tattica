-- ============================================================================
-- Fase 4: libreria estesa (esercizi), preferiti, blocchi allenamento,
-- chiusura seduta, estensione presenze con "ritardo".
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Esercizi: contenuto testuale/parametrico, distinto dagli schemi tattici
-- (che restano posizioni su campo). Vedi tactical_schemes per il confronto.
-- ---------------------------------------------------------------------------
create table exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in (
    'riscaldamento','tecnica_individuale','passaggi','rondo','possesso','pressing',
    'costruzione','attacco','finalizzazione','transizione_offensiva','transizione_difensiva',
    'difesa','superiorita_numerica','inferiorita_numerica','small_sided_game','partita_a_tema'
  )),
  description text,
  objective text,
  players_min int,
  players_max int,
  duration_minutes int,
  intensity text check (intensity in ('bassa','media','alta')),
  field_size text,
  equipment text,
  coaching_points text,
  variants text,
  tags text[] not null default '{}',
  is_template boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table exercises enable row level security;
create policy "exercises: solo admin" on exercises for all using (is_admin()) with check (is_admin());
create trigger exercises_set_updated_at before update on exercises
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Preferiti: schema tattico o esercizio, mai entrambi sulla stessa riga.
-- ---------------------------------------------------------------------------
create table favorites (
  id uuid primary key default gen_random_uuid(),
  tactical_scheme_id uuid references tactical_schemes(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorites_one_reference check (
    (tactical_scheme_id is not null)::int + (exercise_id is not null)::int = 1
  )
);
create unique index favorites_unique_scheme on favorites (tactical_scheme_id) where tactical_scheme_id is not null;
create unique index favorites_unique_exercise on favorites (exercise_id) where exercise_id is not null;

alter table favorites enable row level security;
create policy "favorites: solo admin" on favorites for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Blocchi di un allenamento: riferiscono UNO tra schema tattico ed esercizio,
-- in ordine esplicito (position).
-- ---------------------------------------------------------------------------
create table session_blocks (
  id uuid primary key default gen_random_uuid(),
  training_session_id uuid not null references training_sessions(id) on delete cascade,
  position int not null,
  tactical_scheme_id uuid references tactical_schemes(id) on delete set null,
  exercise_id uuid references exercises(id) on delete set null,
  duration_minutes int,
  sets int,
  reps int,
  rest_seconds int,
  intensity text check (intensity in ('bassa','media','alta')),
  notes text,
  created_at timestamptz not null default now(),
  constraint session_blocks_one_reference check (
    (tactical_scheme_id is not null)::int + (exercise_id is not null)::int = 1
  )
);

alter table session_blocks enable row level security;
create policy "session_blocks: solo admin" on session_blocks for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Chiusura seduta: programmato -> svolto. Un log per allenamento, uno per
-- blocco (fatto/saltato/modificato).
-- ---------------------------------------------------------------------------
create table training_session_logs (
  training_session_id uuid primary key references training_sessions(id) on delete cascade,
  actual_duration_minutes int,
  actual_intensity text check (actual_intensity in ('bassa','media','alta')),
  notes text,
  closed_at timestamptz not null default now()
);

alter table training_session_logs enable row level security;
create policy "training_session_logs: solo admin" on training_session_logs for all using (is_admin()) with check (is_admin());

create table session_block_logs (
  session_block_id uuid primary key references session_blocks(id) on delete cascade,
  status text not null check (status in ('fatto', 'saltato', 'modificato')),
  note text
);

alter table session_block_logs enable row level security;
create policy "session_block_logs: solo admin" on session_block_logs for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Presenze: aggiunge "ritardo" agli stati esistenti.
-- ---------------------------------------------------------------------------
alter table attendances drop constraint attendances_status_check;
alter table attendances add constraint attendances_status_check
  check (status in ('presente', 'assente', 'giustificato', 'ritardo'));
