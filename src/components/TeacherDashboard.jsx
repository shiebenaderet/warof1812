import React, { useState, useEffect } from 'react';
import { fetchTeacherStats, verifyTeacherPassword, supabase } from '../lib/supabase';

const factionLabels = {
  us: 'United States',
  british: 'British/Canada',
  native: 'Native Coalition',
};

function LoginGate({ onAuthenticated }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyTeacherPassword(password)) {
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
        <input
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

  useEffect(() => {
    fetchTeacherStats().then(({ data }) => {
      setStats(data);
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

  const exportCSV = () => {
    const headers = ['Name', 'Period', 'Faction', 'Score', 'Quiz Correct', 'Quiz Total', 'Quiz %', 'Battles Won', 'Battles Fought', 'Territories', 'Date'];
    const rows = filteredScores.map((s) => [
      s.player_name,
      s.class_period,
      factionLabels[s.faction] || s.faction,
      s.final_score,
      s.knowledge_correct,
      s.knowledge_total,
      s.knowledge_total > 0 ? Math.round((s.knowledge_correct / s.knowledge_total) * 100) : 0,
      s.battles_won,
      s.battles_fought,
      s.territories_held,
      new Date(s.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `war1812_scores${selectedPeriod ? `_${selectedPeriod}` : ''}.csv`;
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
