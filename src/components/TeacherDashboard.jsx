import React, { useState, useEffect } from 'react';
import { fetchTeacherStats, fetchQuizGateStats, supabase } from '../lib/supabase';
import quizGateQuestions from '../data/quizGateQuestions';

const factionLabels = {
  us: 'United States',
  british: 'British/Canada',
  native: 'Native Coalition',
};

const questionLabels = {};
quizGateQuestions.forEach(q => {
  questionLabels[q.id] = q.question;
});

function LoginGate({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === (process.env.REACT_APP_TEACHER_PASSWORD || 'teacher1812')) {
      onAuthenticated();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      <form onSubmit={handleSubmit} className="bg-war-navy border border-war-gold/20 rounded-lg p-8 max-w-sm w-full shadow-modal animate-fadein">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
          <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">Administration</p>
          <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
        </div>
        <h1 className="text-war-gold font-display text-2xl mb-1 text-center tracking-wide">Teacher Dashboard</h1>
        <p className="text-parchment-dark/40 text-xs text-center mb-6 font-body">War of 1812 &mdash; Class Analytics</p>
        {error && <p className="text-red-400 text-sm text-center mb-3 font-body">{error}</p>}
        <label htmlFor="teacher-password" className="sr-only">Teacher password</label>
        <input
          id="teacher-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Teacher password"
          className="w-full px-4 py-3 bg-war-ink/50 border border-parchment-dark/15 rounded
                     text-parchment/80 font-body text-sm placeholder-parchment-dark/30 focus:border-war-gold/40
                     focus:outline-none mb-4"
          autoFocus
        />
        <button
          type="submit"
          className="w-full py-3 bg-war-gold text-war-ink font-display text-sm rounded
                     hover:bg-war-brass transition-colors cursor-pointer font-bold tracking-wide shadow-copper"
        >
          Enter
        </button>
        <a
          href={window.location.pathname}
          className="block text-center text-parchment-dark/40 text-xs mt-4 hover:text-war-gold/70 transition-colors font-body"
        >
          Back to Game
        </a>
      </form>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [quizGateData, setQuizGateData] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchTeacherStats(),
      fetchQuizGateStats(),
    ]).then(([statsResult, qgResult]) => {
      setStats(statsResult.data);
      setQuizGateData(qgResult.data || []);
    }).catch(() => {
      setStats(null);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
        <p className="text-parchment/60 font-body text-base italic">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
        <p className="text-red-400/80 font-body text-base">Failed to load data</p>
      </div>
    );
  }

  const filteredScores = selectedPeriod
    ? stats.allScores.filter((s) => s.class_period === selectedPeriod)
    : stats.allScores;

  // Quiz Gate Analytics — compute per-question aggregates
  const filteredQGData = selectedPeriod
    ? quizGateData.filter(r => r.class_period === selectedPeriod)
    : quizGateData;

  const qgSessions = new Set(filteredQGData.map(r => r.session_id));

  const qgQuestionStats = quizGateQuestions.map(q => {
    const rows = filteredQGData.filter(r => r.question_id === q.id);
    const totalStudents = rows.length;
    const totalRetries = rows.reduce((sum, r) => sum + r.retries, 0);
    const firstTryCount = rows.filter(r => r.retries === 0).length;
    return {
      id: q.id,
      question: q.question,
      totalStudents,
      avgRetries: totalStudents > 0 ? (totalRetries / totalStudents) : 0,
      firstTryPercent: totalStudents > 0 ? Math.round((firstTryCount / totalStudents) * 100) : 0,
      rows,
    };
  }).sort((a, b) => b.avgRetries - a.avgRetries);

  const exportCSV = () => {
    const headers = ['Name', 'Period', 'Faction', 'Difficulty', 'Score', 'Quiz Correct', 'Quiz Total', 'Quiz %', 'Battles Won', 'Battles Fought', 'Territories', 'Date'];
    const rows = filteredScores.map((s) => [
      s.player_name,
      s.class_period,
      factionLabels[s.faction] || s.faction,
      s.difficulty || 'medium',
      s.final_score,
      s.knowledge_correct,
      s.knowledge_total,
      s.knowledge_total > 0 ? Math.round((s.knowledge_correct / s.knowledge_total) * 100) : 0,
      s.battles_won,
      s.battles_fought,
      s.territories_held,
      new Date(s.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `war1812_scores${selectedPeriod ? `_${selectedPeriod}` : ''}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportQuizGateCSV = () => {
    const headers = ['Student', 'Period', 'Mode', 'Question', 'Retries', 'Date'];
    const rows = filteredQGData.map(r => [
      r.player_name,
      r.class_period,
      r.game_mode,
      questionLabels[r.question_id] || r.question_id,
      r.retries,
      new Date(r.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `war1812_quiz_gate${selectedPeriod ? `_${selectedPeriod}` : ''}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen text-parchment" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      {/* Header */}
      <header className="bg-war-navy/80 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 border-b border-war-gold/15 flex items-center justify-between gap-3 sticky top-0 z-10">
        <div>
          <h1 className="text-war-gold font-display text-lg md:text-xl tracking-wide">Teacher Dashboard</h1>
          <p className="text-parchment-dark/40 text-xs font-body">War of 1812 &mdash; {stats.totalGames} games played</p>
        </div>
        <a
          href={window.location.pathname}
          className="px-3 md:px-4 py-2 border border-parchment-dark/15 text-parchment-dark/50 rounded
                     hover:border-war-gold/40 hover:text-war-gold transition-colors text-xs font-body flex-shrink-0 cursor-pointer"
        >
          Back to Game
        </a>
      </header>

      <div className="p-3 md:p-6 max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Game Guide Summary */}
        <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-war-gold/80 font-display text-base tracking-wide">Game Guide</h2>
            <a
              href="#guide"
              className="text-war-gold/60 hover:text-war-gold text-xs font-body transition-colors"
            >
              Full Teacher Guide &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-2 border-war-gold/20 pl-3">
              <p className="text-parchment/80 text-sm font-body font-bold mb-1">How It Works</p>
              <p className="text-parchment/50 text-xs font-body leading-relaxed">
                Students choose a faction, manage territories on an interactive map, and answer knowledge checks while learning about the War of 1812. Games take 30-45 minutes with save/resume support.
              </p>
            </div>
            <div className="border-l-2 border-war-copper/20 pl-3">
              <p className="text-parchment/80 text-sm font-body font-bold mb-1">What Students Learn</p>
              <p className="text-parchment/50 text-xs font-body leading-relaxed">
                Causes and events of the war, multiple perspectives (U.S., British, Native), diverse experiences (women, African Americans), geographic reasoning, and connections to later American history.
              </p>
            </div>
            <div className="border-l-2 border-parchment-dark/15 pl-3">
              <p className="text-parchment/80 text-sm font-body font-bold mb-1">Using This Dashboard</p>
              <p className="text-parchment/50 text-xs font-body leading-relaxed">
                Monitor quiz scores, compare class periods, track faction choices, and export CSV data. Use quiz performance to identify topics needing additional instruction.
              </p>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-war-navy/50 rounded-lg p-4 text-center border border-parchment-dark/8">
            <p className="text-3xl font-bold text-war-gold font-display">{stats.totalGames}</p>
            <p className="text-xs text-parchment-dark/40 font-body">Total Games</p>
          </div>
          <div className="bg-war-navy/50 rounded-lg p-4 text-center border border-parchment-dark/8">
            <p className="text-3xl font-bold text-parchment/80 font-display">
              {stats.totalGames > 0
                ? Math.round(stats.allScores.reduce((a, s) => a + s.final_score, 0) / stats.totalGames)
                : 0}
            </p>
            <p className="text-xs text-parchment-dark/40 font-body">Avg Score</p>
          </div>
          <div className="bg-war-navy/50 rounded-lg p-4 text-center border border-parchment-dark/8">
            <p className="text-3xl font-bold text-green-400 font-display">
              {stats.allScores.filter((s) => s.knowledge_total > 0).length > 0
                ? Math.round(
                    stats.allScores
                      .filter((s) => s.knowledge_total > 0)
                      .reduce((a, s) => a + (s.knowledge_correct / s.knowledge_total) * 100, 0)
                    / stats.allScores.filter((s) => s.knowledge_total > 0).length
                  )
                : 0}%
            </p>
            <p className="text-xs text-parchment-dark/40 font-body">Avg Quiz Score</p>
          </div>
          <div className="bg-war-navy/50 rounded-lg p-4 text-center border border-parchment-dark/8">
            <p className="text-3xl font-bold text-parchment/80 font-display">{stats.periodStats.length}</p>
            <p className="text-xs text-parchment-dark/40 font-body">Class Periods</p>
          </div>
        </div>

        {/* Class Period Breakdown */}
        <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
          <h2 className="text-war-gold/80 font-display text-base mb-4 tracking-wide">By Class Period</h2>
          {stats.periodStats.length === 0 ? (
            <p className="text-parchment-dark/40 italic font-body text-sm">No data yet</p>
          ) : (
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-parchment-dark/40 border-b border-parchment-dark/15 text-left">
                  <th className="py-2 font-normal">Period</th>
                  <th className="py-2 text-right font-normal">Games</th>
                  <th className="py-2 text-right font-normal">Avg Score</th>
                  <th className="py-2 text-right font-normal">Top Score</th>
                  <th className="py-2 text-right font-normal">Avg Quiz %</th>
                </tr>
              </thead>
              <tbody>
                {stats.periodStats.map((p) => (
                  <tr key={p.period} className="border-b border-parchment-dark/8">
                    <td className="py-2 font-bold text-parchment/80">{p.period}</td>
                    <td className="py-2 text-right text-parchment-dark/60">{p.count}</td>
                    <td className="py-2 text-right text-war-gold font-bold font-display">{p.avgScore}</td>
                    <td className="py-2 text-right text-parchment-dark/60">{p.topScore}</td>
                    <td className="py-2 text-right text-parchment-dark/60">{p.avgQuizPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Faction Distribution */}
        <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
          <h2 className="text-war-gold/80 font-display text-base mb-4 tracking-wide">Faction Distribution</h2>
          <div className="grid grid-cols-3 gap-4">
            {stats.factionStats.map((f) => (
              <div key={f.faction} className="text-center">
                <p className="text-2xl font-bold text-parchment/80 font-display">{f.count}</p>
                <p className="text-xs text-parchment-dark/50 font-body">{factionLabels[f.faction]}</p>
                <p className="text-xs text-war-gold/60 font-body">Avg: {f.avgScore}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Gate Analytics */}
        <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-war-gold/80 font-display text-base tracking-wide">Quiz Gate Analytics</h2>
              <p className="text-parchment-dark/40 text-xs font-body mt-0.5">
                {qgSessions.size} students attempted the pre-game quiz
              </p>
            </div>
            {filteredQGData.length > 0 && (
              <button
                onClick={exportQuizGateCSV}
                className="px-4 py-1.5 text-xs border border-parchment-dark/15 text-parchment-dark/50 rounded
                           hover:border-war-gold/40 hover:text-war-gold transition-colors cursor-pointer font-body"
              >
                Export Quiz CSV
              </button>
            )}
          </div>

          {filteredQGData.length === 0 ? (
            <p className="text-parchment-dark/40 italic font-body text-sm">No quiz gate data yet</p>
          ) : (
            <div className="space-y-1">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-parchment-dark/40 border-b border-parchment-dark/15 text-left">
                    <th className="py-2 font-normal">#</th>
                    <th className="py-2 font-normal">Question</th>
                    <th className="py-2 text-right font-normal">Avg Retries</th>
                    <th className="py-2 text-right font-normal">First-Try %</th>
                    <th className="py-2 text-right font-normal">Students</th>
                  </tr>
                </thead>
                <tbody>
                  {qgQuestionStats.map((q, idx) => (
                    <React.Fragment key={q.id}>
                      <tr
                        className="border-b border-parchment-dark/8 cursor-pointer hover:bg-war-gold/5 transition-colors"
                        onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                      >
                        <td className="py-2 text-parchment-dark/50">{idx + 1}</td>
                        <td className="py-2 text-parchment/80 max-w-xs">
                          <span className="line-clamp-1">{q.question}</span>
                        </td>
                        <td className="py-2 text-right font-bold font-display text-parchment/80">
                          {q.avgRetries.toFixed(1)}
                        </td>
                        <td className="py-2 text-right">
                          <span className={`font-bold font-display ${
                            q.firstTryPercent >= 70 ? 'text-green-400' :
                            q.firstTryPercent >= 40 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {q.firstTryPercent}%
                          </span>
                        </td>
                        <td className="py-2 text-right text-parchment-dark/60">{q.totalStudents}</td>
                      </tr>
                      {expandedQuestion === q.id && q.rows.length > 0 && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            <div className="bg-black/20 border-l-2 border-war-gold/20 ml-4 mb-2 rounded-r">
                              <table className="w-full text-xs font-body">
                                <thead>
                                  <tr className="text-parchment-dark/40 border-b border-parchment-dark/10">
                                    <th className="py-1.5 px-3 font-normal text-left">Student</th>
                                    <th className="py-1.5 px-3 font-normal text-left">Period</th>
                                    <th className="py-1.5 px-3 font-normal text-left">Mode</th>
                                    <th className="py-1.5 px-3 font-normal text-right">Retries</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[...q.rows].sort((a, b) => b.retries - a.retries).map((r) => (
                                    <tr key={r.session_id} className="border-b border-parchment-dark/5">
                                      <td className="py-1.5 px-3 text-parchment/70">{r.player_name}</td>
                                      <td className="py-1.5 px-3 text-parchment-dark/50">{r.class_period}</td>
                                      <td className="py-1.5 px-3 text-parchment-dark/50 capitalize">{r.game_mode}</td>
                                      <td className="py-1.5 px-3 text-right">
                                        <span className={`font-bold ${r.retries === 0 ? 'text-green-400' : r.retries <= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                                          {r.retries}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Individual Scores */}
        <div className="bg-war-navy/50 rounded-lg p-5 border border-parchment-dark/8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-war-gold/80 font-display text-base tracking-wide">All Scores</h2>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-war-ink/50 text-parchment/80 border border-parchment-dark/15 rounded px-3 py-1.5 text-sm font-body cursor-pointer
                           focus:border-war-gold/40 focus:outline-none"
              >
                <option value="">All Periods</option>
                {stats.periodStats.map((p) => (
                  <option key={p.period} value={p.period}>{p.period}</option>
                ))}
              </select>
              <button
                onClick={exportCSV}
                className="px-4 py-1.5 text-xs border border-parchment-dark/15 text-parchment-dark/50 rounded
                           hover:border-war-gold/40 hover:text-war-gold transition-colors cursor-pointer font-body"
              >
                Export CSV
              </button>
            </div>
          </div>

          {filteredScores.length === 0 ? (
            <p className="text-parchment-dark/40 italic font-body text-sm">No scores found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-parchment-dark/40 border-b border-parchment-dark/15 text-left">
                    <th className="py-2 font-normal">Name</th>
                    <th className="py-2 font-normal">Period</th>
                    <th className="py-2 font-normal">Faction</th>
                    <th className="py-2 font-normal">Difficulty</th>
                    <th className="py-2 text-right font-normal">Score</th>
                    <th className="py-2 text-right font-normal">Quiz</th>
                    <th className="py-2 text-right font-normal">Battles</th>
                    <th className="py-2 text-right font-normal">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScores.map((s) => (
                    <tr key={s.id} className="border-b border-parchment-dark/8">
                      <td className="py-2 font-bold text-parchment/80">{s.player_name}</td>
                      <td className="py-2 text-parchment-dark/60">{s.class_period}</td>
                      <td className="py-2 text-parchment-dark/60">{factionLabels[s.faction]}</td>
                      <td className="py-2 text-parchment-dark/60 capitalize">{s.difficulty || 'medium'}</td>
                      <td className="py-2 text-right text-war-gold font-bold font-display">{s.final_score}</td>
                      <td className="py-2 text-right text-parchment-dark/60">
                        {s.knowledge_total > 0
                          ? `${s.knowledge_correct}/${s.knowledge_total} (${Math.round((s.knowledge_correct / s.knowledge_total) * 100)}%)`
                          : '-'}
                      </td>
                      <td className="py-2 text-right text-parchment-dark/60">{s.battles_won}/{s.battles_fought}</td>
                      <td className="py-2 text-right text-parchment-dark/40">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
        <div className="text-center">
          <h1 className="text-war-gold font-display text-2xl mb-4 tracking-wide">Teacher Dashboard</h1>
          <p className="text-parchment-dark/50 mb-4 font-body text-sm">
            Supabase is not configured. Add your credentials to .env to enable the leaderboard.
          </p>
          <a
            href={window.location.pathname}
            className="text-war-gold/70 hover:text-war-gold transition-colors font-body text-sm"
          >
            Back to Game
          </a>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <Dashboard />;
}
