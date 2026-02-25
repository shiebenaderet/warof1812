-- v1.7.0: Quiz Gate Analytics
-- Run this in the Supabase SQL Editor before deploying v1.7.0 code

-- New table for quiz gate retry tracking
CREATE TABLE quiz_gate_results (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  player_name TEXT NOT NULL,
  class_period TEXT DEFAULT '',
  game_mode TEXT DEFAULT 'historian',
  question_id TEXT NOT NULL,
  retries INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for teacher dashboard queries (filter by period, aggregate by question)
CREATE INDEX idx_qgr_class_period ON quiz_gate_results(class_period);
CREATE INDEX idx_qgr_question_id ON quiz_gate_results(question_id);
CREATE INDEX idx_qgr_session_id ON quiz_gate_results(session_id);

-- Enable Row Level Security (match existing scores table pattern)
ALTER TABLE quiz_gate_results ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (students submit without auth)
CREATE POLICY "Allow anonymous inserts" ON quiz_gate_results
  FOR INSERT WITH CHECK (true);

-- Allow anonymous reads (teacher dashboard reads without auth)
CREATE POLICY "Allow anonymous reads" ON quiz_gate_results
  FOR SELECT USING (true);

-- Add session_id to existing scores table (nullable for existing rows)
ALTER TABLE scores ADD COLUMN IF NOT EXISTS session_id UUID;
CREATE INDEX IF NOT EXISTS idx_scores_session_id ON scores(session_id);
