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
    <div className="min-h-screen bg-war-navy flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-black bg-opacity-40 border border-war-gold rounded-xl p-8 max-w-sm w-full">
        <h1 className="text-war-gold font-serif text-2xl mb-2 text-center">Teacher Dashboard</h1>
        <p className="text-parchment-dark text-sm text-center mb-6">War of 1812 — Class Analytics</p>
        {error && <p className="text-red-300 text-sm text-center mb-3">{error}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Teacher password"
          className="w-full px-4 py-3 bg-war-navy border border-parchment-dark border-opacity-30 rounded-lg
                     text-parchment font-serif text-base placeholder-parchment-dark focus:border-war-gold
                     focus:outline-none mb-4"
          autoFocus
        />
        <button
          type="submit"
          className="w-full py-3 bg-war-gold text-war-navy font-serif text-base rounded-lg
                     hover:bg-yellow-500 transition-colors cursor-pointer font-bold"
        >
          Enter
        </button>
        <a
          href={window.location.pathname}
          className="block text-center text-parchment-dark text-sm mt-4 hover:text-war-gold transition-colors"
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
      <div className="min-h-screen bg-war-navy flex items-center justify-center">
        <p className="text-parchment font-serif text-xl">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-war-navy flex items-center justify-center">
        <p className="text-red-300 font-serif text-xl">Failed to load data</p>
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
    <div className="min-h-screen bg-war-navy text-parchment">
      {/* Header */}
      <header className="bg-black bg-opacity-50 px-4 md:px-6 py-3 md:py-4 border-b border-war-gold border-opacity-20 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-war-gold font-serif text-xl md:text-2xl">Teacher Dashboard</h1>
          <p className="text-parchment-dark text-xs md:text-sm">War of 1812 — {stats.totalGames} games played</p>
        </div>
        <a
          href={window.location.pathname}
          className="px-3 md:px-4 py-2 border border-parchment-dark text-parchment-dark rounded
                     hover:border-war-gold hover:text-war-gold transition-colors text-sm flex-shrink-0"
        >
          Back to Game
        </a>
      </header>

      <div className="p-3 md:p-6 max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black bg-opacity-40 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-war-gold">{stats.totalGames}</p>
            <p className="text-sm text-parchment-dark">Total Games</p>
          </div>
          <div className="bg-black bg-opacity-40 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-parchment">
              {stats.totalGames > 0
                ? Math.round(stats.allScores.reduce((a, s) => a + s.final_score, 0) / stats.totalGames)
                : 0}
            </p>
            <p className="text-sm text-parchment-dark">Avg Score</p>
          </div>
          <div className="bg-black bg-opacity-40 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-300">
              {stats.allScores.filter((s) => s.knowledge_total > 0).length > 0
                ? Math.round(
                    stats.allScores
                      .filter((s) => s.knowledge_total > 0)
                      .reduce((a, s) => a + (s.knowledge_correct / s.knowledge_total) * 100, 0)
                    / stats.allScores.filter((s) => s.knowledge_total > 0).length
                  )
                : 0}%
            </p>
            <p className="text-sm text-parchment-dark">Avg Quiz Score</p>
          </div>
          <div className="bg-black bg-opacity-40 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-parchment">{stats.periodStats.length}</p>
            <p className="text-sm text-parchment-dark">Class Periods</p>
          </div>
        </div>

        {/* Class Period Breakdown */}
        <div className="bg-black bg-opacity-40 rounded-lg p-5">
          <h2 className="text-war-gold font-serif text-lg mb-4">By Class Period</h2>
          {stats.periodStats.length === 0 ? (
            <p className="text-parchment-dark italic">No data yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-parchment-dark border-b border-parchment-dark border-opacity-20 text-left">
                  <th className="py-2">Period</th>
                  <th className="py-2 text-right">Games</th>
                  <th className="py-2 text-right">Avg Score</th>
                  <th className="py-2 text-right">Top Score</th>
                  <th className="py-2 text-right">Avg Quiz %</th>
                </tr>
              </thead>
              <tbody>
                {stats.periodStats.map((p) => (
                  <tr key={p.period} className="border-b border-parchment-dark border-opacity-10">
                    <td className="py-2 font-bold">{p.period}</td>
                    <td className="py-2 text-right">{p.count}</td>
                    <td className="py-2 text-right text-war-gold font-bold">{p.avgScore}</td>
                    <td className="py-2 text-right">{p.topScore}</td>
                    <td className="py-2 text-right">{p.avgQuizPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Faction Distribution */}
        <div className="bg-black bg-opacity-40 rounded-lg p-5">
          <h2 className="text-war-gold font-serif text-lg mb-4">Faction Distribution</h2>
          <div className="grid grid-cols-3 gap-4">
            {stats.factionStats.map((f) => (
              <div key={f.faction} className="text-center">
                <p className="text-2xl font-bold text-parchment">{f.count}</p>
                <p className="text-sm text-parchment-dark">{factionLabels[f.faction]}</p>
                <p className="text-xs text-war-gold">Avg: {f.avgScore}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Scores */}
        <div className="bg-black bg-opacity-40 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-war-gold font-serif text-lg">All Scores</h2>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-war-navy text-parchment border border-parchment-dark border-opacity-30
                           rounded px-3 py-1.5 text-sm font-serif cursor-pointer"
              >
                <option value="">All Periods</option>
                {stats.periodStats.map((p) => (
                  <option key={p.period} value={p.period}>{p.period}</option>
                ))}
              </select>
              <button
                onClick={exportCSV}
                className="px-4 py-1.5 text-sm border border-parchment-dark text-parchment-dark rounded
                           hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer"
              >
                Export CSV
              </button>
            </div>
          </div>

          {filteredScores.length === 0 ? (
            <p className="text-parchment-dark italic">No scores found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-parchment-dark border-b border-parchment-dark border-opacity-20 text-left">
                    <th className="py-2">Name</th>
                    <th className="py-2">Period</th>
                    <th className="py-2">Faction</th>
                    <th className="py-2 text-right">Score</th>
                    <th className="py-2 text-right">Quiz</th>
                    <th className="py-2 text-right">Battles</th>
                    <th className="py-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScores.map((s) => (
                    <tr key={s.id} className="border-b border-parchment-dark border-opacity-10">
                      <td className="py-2 font-bold">{s.player_name}</td>
                      <td className="py-2">{s.class_period}</td>
                      <td className="py-2">{factionLabels[s.faction]}</td>
                      <td className="py-2 text-right text-war-gold font-bold">{s.final_score}</td>
                      <td className="py-2 text-right">
                        {s.knowledge_total > 0
                          ? `${s.knowledge_correct}/${s.knowledge_total} (${Math.round((s.knowledge_correct / s.knowledge_total) * 100)}%)`
                          : '-'}
                      </td>
                      <td className="py-2 text-right">{s.battles_won}/{s.battles_fought}</td>
                      <td className="py-2 text-right text-parchment-dark">
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
      <div className="min-h-screen bg-war-navy flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-war-gold font-serif text-2xl mb-4">Teacher Dashboard</h1>
          <p className="text-parchment-dark mb-4">
            Supabase is not configured. Add your credentials to .env to enable the leaderboard.
          </p>
          <a
            href={window.location.pathname}
            className="text-war-gold hover:text-yellow-500 transition-colors"
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
