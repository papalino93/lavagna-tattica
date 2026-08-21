-- Kit personalizzato: maglia = primary_color, pantaloncini = secondary_color (gia'
-- esistente ma mai esposto in UI), calzettoni = questa nuova colonna.
alter table team_settings
  add column if not exists kit_socks_color text;
