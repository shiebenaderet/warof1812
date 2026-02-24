-- War of 1812 Game — Supabase Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Create the scores table
create table if not exists scores (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  player_name text not null,
  class_period text not null,
  faction text not null check (faction in ('us', 'british', 'native')),
  final_score integer not null,
  base_score integer default 0,
  objective_bonus integer default 0,
  faction_multiplier real default 1.0,
  nationalism_meter integer default 0,
  native_resistance integer default 0,
  naval_dominance integer default 0,
  knowledge_correct integer default 0,
  knowledge_total integer default 0,
  battles_won integer default 0,
  battles_fought integer default 0,
  territories_held integer default 0,
  rounds_played integer default 12,
  game_over_reason text default 'treaty' check (game_over_reason in ('treaty', 'domination', 'elimination'))
);

-- 2. Enable Row Level Security
alter table scores enable row level security;

-- 3. Allow anyone to INSERT scores (students submitting)
create policy "Anyone can submit scores"
  on scores for insert
  with check (true);

-- 4. Allow anyone to SELECT scores (leaderboard is public)
create policy "Anyone can read scores"
  on scores for select
  using (true);

-- 5. Create an index for leaderboard queries
create index if not exists idx_scores_final_score on scores (final_score desc);
create index if not exists idx_scores_class_period on scores (class_period);
create index if not exists idx_scores_faction on scores (faction);

-- ── Migration ──────────────────────────────────────────────
-- If your table already exists, run this instead:
-- ALTER TABLE scores ADD COLUMN IF NOT EXISTS game_over_reason text DEFAULT 'treaty'
--   CHECK (game_over_reason IN ('treaty', 'domination', 'elimination'));
