-- v2.0.0: Class Code System
-- Run this in the Supabase SQL Editor before deploying v2.0.0 code
--
-- PREREQUISITES (do these in Supabase Dashboard first):
--   1. Authentication > Providers > Email: Ensure enabled
--   2. Authentication > URL Configuration:
--      - Site URL: https://1812.mrbsocialstudies.org
--      - Redirect URLs: add https://1812.mrbsocialstudies.org

-- ============================================
-- NEW TABLES
-- ============================================

-- Teachers table (linked to Supabase auth.users)
CREATE TABLE teachers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes table (teacher creates classes, students join via code)
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_classes_code ON classes(code);

-- ============================================
-- ALTER EXISTING TABLES
-- ============================================

-- Add class_id to scores (nullable — existing rows and standalone students have no class)
ALTER TABLE scores ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES classes(id);
CREATE INDEX IF NOT EXISTS idx_scores_class_id ON scores(class_id);

-- Add class_id to quiz_gate_results (nullable — same reason)
ALTER TABLE quiz_gate_results ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES classes(id);
CREATE INDEX IF NOT EXISTS idx_qgr_class_id ON quiz_gate_results(class_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Teachers: only own row
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can insert own row" ON teachers
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Teachers can read own row" ON teachers
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Teachers can update own row" ON teachers
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Classes: teachers manage own, anyone can read (for code validation)
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can insert own classes" ON classes
  FOR INSERT TO authenticated
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can read own classes" ON classes
  FOR SELECT TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own classes" ON classes
  FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own classes" ON classes
  FOR DELETE TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Anyone can read classes by code" ON classes
  FOR SELECT TO public
  USING (true);

-- Scores: add teacher scoped read + anon update for late join
CREATE POLICY "Teachers can read class scores" ON scores
  FOR SELECT TO authenticated
  USING (class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid()));

CREATE POLICY "Anon can update class_id on scores" ON scores
  FOR UPDATE TO public
  USING (true)
  WITH CHECK (true);

-- Quiz gate results: add teacher scoped read + anon update for late join
CREATE POLICY "Teachers can read class quiz results" ON quiz_gate_results
  FOR SELECT TO authenticated
  USING (class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid()));

CREATE POLICY "Anon can update class_id on quiz results" ON quiz_gate_results
  FOR UPDATE TO public
  USING (true)
  WITH CHECK (true);

-- ============================================
-- GRANTS
-- ============================================

GRANT ALL ON teachers TO authenticated;
GRANT ALL ON classes TO authenticated;
GRANT SELECT ON classes TO anon;
GRANT UPDATE ON scores TO anon;
GRANT UPDATE ON quiz_gate_results TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
