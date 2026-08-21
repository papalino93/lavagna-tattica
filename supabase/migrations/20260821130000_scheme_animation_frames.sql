-- Fotogrammi per l'animazione dei movimenti (tasto "play" in modalita presentazione).
-- Ogni elemento dell'array e' uno snapshot completo dei giocatori (stessi id/team/label
-- del fotogramma base, solo x/y cambiano). Null = nessuna animazione, comportamento
-- identico a prima.
alter table tactical_schemes
  add column if not exists animation_frames jsonb;
