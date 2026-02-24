import React, { useState, useEffect, useCallback } from 'react';
import { fetchLeaderboard, supabase } from '../lib/supabase';
import { VictoryBadge } from './LeaderboardPreview';

const factionLabels = {
  us: 'United States',
  british: 'British/Canada',
  native: 'Native Coalition',
};

const factionColors = {
  us: 'text-[#4a7ec7]',
  british: 'text-red-400',
  native: 'text-war-gold',
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 1000 }}>
        <div className="bg-war-navy border border-war-gold/30 rounded-lg max-w-md w-full p-6 text-center shadow-modal animate-fadein">
          <p className="text-parchment/80 font-body text-base mb-4">
            Leaderboard is not available. Supabase has not been configured.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-war-gold text-war-ink font-display text-sm rounded
                       hover:bg-war-brass transition-colors cursor-pointer font-bold tracking-wide shadow-copper"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 1000 }}>
      <div className="bg-war-navy border border-war-gold/30 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-modal animate-fadein">
        {/* Header */}
        <div className="px-6 py-4 border-b border-war-gold/20 flex items-center justify-between flex-shrink-0" style={{
          background: 'linear-gradient(135deg, rgba(184,115,51,0.15) 0%, rgba(20,30,48,0.95) 100%)',
        }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
              <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">Rankings</p>
            </div>
            <h2 className="text-parchment font-display text-lg tracking-wide">Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="text-parchment-dark/40 hover:text-parchment transition-colors cursor-pointer text-xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-parchment-dark/10 flex gap-3 flex-shrink-0 flex-wrap">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="bg-war-ink/50 text-parchment/80 border border-parchment-dark/15 rounded px-3 py-1.5 text-sm font-body cursor-pointer
                       focus:border-war-gold/40 focus:outline-none"
          >
            <option value="">All Periods</option>
            {periods.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={filterFaction}
            onChange={(e) => setFilterFaction(e.target.value)}
            className="bg-war-ink/50 text-parchment/80 border border-parchment-dark/15 rounded px-3 py-1.5 text-sm font-body cursor-pointer
                       focus:border-war-gold/40 focus:outline-none"
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
            <p className="text-parchment-dark/50 text-center py-8 font-body italic">Loading...</p>
          ) : scores.length === 0 ? (
            <p className="text-parchment-dark/50 text-center py-8 font-body italic">No scores yet. Be the first!</p>
          ) : (
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-parchment-dark/50 text-left border-b border-parchment-dark/15">
                  <th className="py-2 w-8 font-normal">#</th>
                  <th className="py-2 font-normal">Commander</th>
                  <th className="py-2 font-normal">Period</th>
                  <th className="py-2 font-normal">Faction</th>
                  <th className="py-2 text-right font-normal">Score</th>
                  <th className="py-2 text-right font-normal">Quiz</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`border-b border-parchment-dark/8 ${
                      i < 3 ? 'text-parchment/80' : 'text-parchment-dark/60'
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
                    <td className="py-2 text-right font-bold text-war-gold font-display">
                      {s.final_score}
                      <VictoryBadge victoryType={s.game_over_reason} />
                    </td>
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
