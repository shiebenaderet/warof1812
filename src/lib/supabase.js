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
    }])
    .select();

  return { data, error };
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

/**
 * Fetch aggregate stats for the teacher dashboard.
 */
export async function fetchTeacherStats() {
  if (!supabase) return { data: null, error: 'Supabase not configured' };

  // Fetch all scores for aggregation
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };

  const scores = data || [];

  // Aggregate by class period
  const byPeriod = {};
  const byFaction = { us: [], british: [], native: [] };

  for (const s of scores) {
    const period = s.class_period || 'Unknown';
    if (!byPeriod[period]) byPeriod[period] = [];
    byPeriod[period].push(s);
    if (byFaction[s.faction]) byFaction[s.faction].push(s);
  }

  // Compute averages
  const periodStats = Object.entries(byPeriod).map(([period, entries]) => ({
    period,
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
      periodStats,
      factionStats,
    },
    error: null,
  };
}

/**
 * Verify teacher password (simple check against env var).
 */
export function verifyTeacherPassword(password) {
  const expected = process.env.REACT_APP_TEACHER_PASSWORD || 'teacher1812';
  return password === expected;
}
