import React, { useState, useEffect, useCallback } from 'react';
import { fetchLeaderboard, supabase } from '../lib/supabase';

const factionLabels = {
  us: 'United States',
  british: 'British/Canada',
  native: 'Native Coalition',
};

const factionColors = {
  us: 'text-blue-300',
  british: 'text-red-300',
  native: 'text-yellow-600',
};

export default function Leaderboard({ onClose, currentClassPeriod }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState(currentClassPeriod || '');
  const [filterFaction, setFilterFaction] = useState('');
  const [periods, setPeriods] = useState([]);

  const loadScores = useCallback(async () => {
    setLoading(true);
    const { data } = await fetchLeaderboard({
      classPeriod: filterPeriod || undefined,
      faction: filterFaction || undefined,
      limit: 50,
    });
    setScores(data);
    setLoading(false);
  }, [filterPeriod, filterFaction]);

  // Load available class periods once
  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('scores')
      .select('class_period')
      .then(({ data }) => {
        if (data) {
          const unique = [...new Set(data.map((d) => d.class_period))].sort();
          setPeriods(unique);
        }
      });
  }, []);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  if (!supabase) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4" style={{ zIndex: 1000 }}>
        <div className="bg-war-navy border-2 border-war-gold rounded-xl max-w-md w-full p-6 text-center">
          <p className="text-parchment font-serif text-lg mb-4">
            Leaderboard is not available. Supabase has not been configured.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-war-gold text-war-navy font-serif rounded-lg
                       hover:bg-yellow-500 transition-colors cursor-pointer font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4" style={{ zIndex: 1000 }}>
      <div className="bg-war-navy border-2 border-war-gold rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-war-gold border-opacity-30 flex items-center justify-between flex-shrink-0">
          <h2 className="text-war-gold font-serif text-2xl">Leaderboard</h2>
          <button
            onClick={onClose}
            className="text-parchment-dark hover:text-war-gold transition-colors cursor-pointer text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-parchment-dark border-opacity-10 flex gap-3 flex-shrink-0 flex-wrap">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="bg-black bg-opacity-40 text-parchment border border-parchment-dark border-opacity-30
                       rounded px-3 py-1.5 text-sm font-serif cursor-pointer"
          >
            <option value="">All Periods</option>
            {periods.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={filterFaction}
            onChange={(e) => setFilterFaction(e.target.value)}
            className="bg-black bg-opacity-40 text-parchment border border-parchment-dark border-opacity-30
                       rounded px-3 py-1.5 text-sm font-serif cursor-pointer"
          >
            <option value="">All Factions</option>
            <option value="us">United States</option>
            <option value="british">British/Canada</option>
            <option value="native">Native Coalition</option>
          </select>
        </div>

        {/* Scores table */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {loading ? (
            <p className="text-parchment-dark text-center py-8 font-serif">Loading...</p>
          ) : scores.length === 0 ? (
            <p className="text-parchment-dark text-center py-8 font-serif">No scores yet. Be the first!</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-parchment-dark text-left border-b border-parchment-dark border-opacity-20">
                  <th className="py-2 w-8">#</th>
                  <th className="py-2">Commander</th>
                  <th className="py-2">Period</th>
                  <th className="py-2">Faction</th>
                  <th className="py-2 text-right">Score</th>
                  <th className="py-2 text-right">Quiz</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`border-b border-parchment-dark border-opacity-10 ${
                      i < 3 ? 'text-parchment' : 'text-parchment-dark'
                    }`}
                  >
                    <td className="py-2">
                      {i === 0 ? '\uD83E\uDD47' : i === 1 ? '\uD83E\uDD48' : i === 2 ? '\uD83E\uDD49' : `${i + 1}`}
                    </td>
                    <td className="py-2 font-bold">{s.player_name}</td>
                    <td className="py-2">{s.class_period}</td>
                    <td className={`py-2 ${factionColors[s.faction] || ''}`}>
                      {factionLabels[s.faction] || s.faction}
                    </td>
                    <td className="py-2 text-right font-bold text-war-gold">{s.final_score}</td>
                    <td className="py-2 text-right">
                      {s.knowledge_total > 0
                        ? `${Math.round((s.knowledge_correct / s.knowledge_total) * 100)}%`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
