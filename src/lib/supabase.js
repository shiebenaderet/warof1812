import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Submit a game score to the leaderboard.
 */
export async function submitScore({
  playerName,
  classPeriod,
  faction,
  finalScore,
  baseScore,
  objectiveBonus,
  factionMultiplier,
  nationalismMeter,
  nativeResistance,
  navalDominance,
  knowledgeCorrect,
  knowledgeTotal,
  battlesWon,
  battlesFought,
  territoriesHeld,
  roundsPlayed,
  gameOverReason,
  difficulty,
  sessionId,
  classId,
}) {
  if (!supabase) return { error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('scores')
    .insert([{
      player_name: playerName,
      class_period: classPeriod,
      faction,
      final_score: finalScore,
      base_score: baseScore,
      objective_bonus: objectiveBonus,
      faction_multiplier: factionMultiplier,
      nationalism_meter: nationalismMeter,
      native_resistance: nativeResistance,
      naval_dominance: navalDominance,
      knowledge_correct: knowledgeCorrect,
      knowledge_total: knowledgeTotal,
      battles_won: battlesWon,
      battles_fought: battlesFought,
      territories_held: territoriesHeld,
      rounds_played: roundsPlayed,
      game_over_reason: gameOverReason || 'treaty',
      difficulty: difficulty || 'medium',
      session_id: sessionId || null,
      class_id: classId || null,
    }])
    .select();

  return { data, error };
}

/**
 * Submit quiz gate retry data after a student completes the pre-game quiz.
 * Inserts one row per question (8 rows total).
 */
export async function submitQuizGateResults({
  sessionId,
  playerName,
  classPeriod,
  gameMode,
  retries,
  classId,
}) {
  if (!supabase) return { error: 'Supabase not configured' };

  const rows = Object.entries(retries).map(([questionId, retryCount]) => ({
    session_id: sessionId,
    player_name: playerName,
    class_period: classPeriod || '',
    game_mode: gameMode || 'historian',
    question_id: questionId,
    retries: retryCount,
    class_id: classId || null,
  }));

  const { data, error } = await supabase
    .from('quiz_gate_results')
    .insert(rows)
    .select();

  return { data, error };
}

/**
 * Fetch quiz gate analytics, scoped to given class IDs.
 */
export async function fetchQuizGateStats(classIds) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  let query = supabase
    .from('quiz_gate_results')
    .select('*')
    .order('created_at', { ascending: false });

  if (classIds && classIds.length > 0) {
    query = query.in('class_id', classIds);
  }

  const { data, error } = await query;

  if (error) return { data: null, error };

  return { data: data || [], error: null };
}

/**
 * Fetch leaderboard scores. Optionally filter by class period and/or faction.
 */
export async function fetchLeaderboard({ classPeriod, faction, limit = 25 } = {}) {
  if (!supabase) return { data: [], error: 'Supabase not configured' };

  let query = supabase
    .from('scores')
    .select('*')
    .order('final_score', { ascending: false })
    .limit(limit);

  if (classPeriod) query = query.eq('class_period', classPeriod);
  if (faction) query = query.eq('faction', faction);

  const { data, error } = await query;
  return { data: data || [], error };
}

// ============================================
// Auth Functions
// ============================================

/**
 * Sign up a new teacher with email and password.
 */
export async function signUpTeacher(email, password) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

/**
 * Sign in a teacher with email and password.
 */
export async function signInWithPassword(email, password) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

/**
 * Send a magic link to the teacher's email.
 */
export async function signInWithMagicLink(email) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/` },
  });
  return { data, error };
}

/**
 * Send a password reset email to set/change password.
 */
export async function resetPassword(email) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/#teacher`,
  });
  return { data, error };
}

/**
 * Update the current user's password (called after reset link click).
 */
export async function updatePassword(newPassword) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  return { data, error };
}

/**
 * Sign out the current teacher.
 */
export async function signOut() {
  if (!supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get current auth session.
 */
export async function getSession() {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}

/**
 * Subscribe to auth state changes. Returns an unsubscribe function.
 */
export function onAuthStateChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
}

// ============================================
// Teacher Profile Functions
// ============================================

/**
 * Get teacher profile for the current authenticated user.
 */
export async function getTeacherProfile(userId) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

/**
 * Create teacher profile (called on first login).
 */
export async function createTeacherProfile({ userId, displayName, email }) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('teachers')
    .insert([{ id: userId, display_name: displayName, email }])
    .select()
    .single();
  return { data, error };
}

// ============================================
// Class Management Functions
// ============================================

/**
 * Generate a random 6-character alphanumeric class code.
 */
function generateClassCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I/1/O/0 to avoid confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create a new class for the authenticated teacher.
 */
export async function createClass({ teacherId, name }) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  // Try up to 3 times in case of code collision
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateClassCode();
    const { data, error } = await supabase
      .from('classes')
      .insert([{ teacher_id: teacherId, name, code }])
      .select()
      .single();

    if (!error) return { data, error: null };
    if (!error.message?.includes('duplicate')) return { data: null, error };
  }
  return { data: null, error: { message: 'Failed to generate unique code' } };
}

/**
 * Fetch all classes for the authenticated teacher.
 */
export async function fetchTeacherClasses(teacherId) {
  if (!supabase) return { data: [], error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: true });
  return { data: data || [], error };
}

/**
 * Validate a class code entered by a student.
 * Returns the class record if valid, null if not found.
 */
export async function validateClassCode(code) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('classes')
    .select('id, name, code')
    .eq('code', code.toUpperCase().trim())
    .single();

  if (error?.code === 'PGRST116') return { data: null, error: null }; // Not found
  return { data, error };
}

/**
 * Retroactively link a student's quiz gate results and score to a class
 * via their session_id. Used when a student enters a class code at score submission.
 */
export async function linkSessionToClass({ sessionId, classId }) {
  if (!supabase || !sessionId || !classId) return { error: 'Missing params' };

  // Update quiz_gate_results
  await supabase
    .from('quiz_gate_results')
    .update({ class_id: classId })
    .eq('session_id', sessionId);

  // Update scores
  await supabase
    .from('scores')
    .update({ class_id: classId })
    .eq('session_id', sessionId);

  return { error: null };
}

/**
 * Fetch aggregate stats for the teacher dashboard, scoped to given class IDs.
 */
export async function fetchTeacherStats(classIds) {
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  let query = supabase
    .from('scores')
    .select('*')
    .order('created_at', { ascending: false });

  if (classIds && classIds.length > 0) {
    query = query.in('class_id', classIds);
  }

  const { data, error } = await query;

  if (error) return { data: null, error };

  const scores = data || [];

  // Aggregate by class_id (replaces old period aggregation for scoped view)
  const byClass = {};
  const byFaction = { us: [], british: [], native: [] };

  for (const s of scores) {
    const classId = s.class_id || 'unassigned';
    if (!byClass[classId]) byClass[classId] = [];
    byClass[classId].push(s);
    if (byFaction[s.faction]) byFaction[s.faction].push(s);
  }

  const classStats = Object.entries(byClass).map(([classId, entries]) => ({
    classId,
    count: entries.length,
    avgScore: Math.round(entries.reduce((a, e) => a + e.final_score, 0) / entries.length),
    avgQuizPercent: entries.filter(e => e.knowledge_total > 0).length > 0
      ? Math.round(
          entries.filter(e => e.knowledge_total > 0)
            .reduce((a, e) => a + (e.knowledge_correct / e.knowledge_total) * 100, 0)
          / entries.filter(e => e.knowledge_total > 0).length
        )
      : 0,
    topScore: Math.max(...entries.map(e => e.final_score)),
  }));

  const factionStats = Object.entries(byFaction).map(([faction, entries]) => ({
    faction,
    count: entries.length,
    avgScore: entries.length > 0
      ? Math.round(entries.reduce((a, e) => a + e.final_score, 0) / entries.length)
      : 0,
  }));

  return {
    data: {
      totalGames: scores.length,
      allScores: scores,
      classStats,
      factionStats,
    },
    error: null,
  };
}
