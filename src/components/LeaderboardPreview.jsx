import React, { useState, useEffect } from 'react';
import { fetchLeaderboard, supabase } from '../lib/supabase';

const factionIcons = {
  us: '\u{1F985}',
  british: '\u{1F341}',
  native: '\u{1F3F9}',
};

const factionColors = {
  us: 'text-[#4a7ec7]',
  british: 'text-red-400',
  native: 'text-war-gold',
};

const rankMedals = ['\u{1F947}', '\u{1F948}', '\u{1F949}'];

/**
 * Compact victory-type badge (DOM / TRT / ELM).
 * Since victory_type is not yet stored in the scores table,
 * this renders nothing when the field is absent.
 */
export function VictoryBadge({ victoryType }) {
  if (!victoryType) return null;

  const config = {
    domination: { label: 'DOM', className: 'text-war-copper border-war-copper/40 bg-war-copper/10' },
    treaty:     { label: 'TRT', className: 'text-parchment-dark/50 border-parchment-dark/30 bg-parchment-dark/5' },
    elimination:{ label: 'ELM', className: 'text-red-400/70 border-red-400/30 bg-red-400/5' },
  };

  const cfg = config[victoryType];
  if (!cfg) return null;

  return (
    <span
      className={`inline-block ml-1.5 px-1 py-px text-[9px] leading-tight font-body font-bold tracking-wider uppercase border rounded ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

export default function LeaderboardPreview({ onViewFull }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await fetchLeaderboard({ limit: 5 });
        if (cancelled) return;
        if (fetchError) {
          setError(typeof fetchError === 'string' ? fetchError : 'Failed to load scores');
        } else {
          setScores(data);
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load scores');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Don't render anything if Supabase is not configured
  if (!supabase) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-8 animate-slideup" style={{ animationDelay: '0.4s' }}>
      <div className="bg-war-navy/60 backdrop-blur rounded-lg border border-war-gold/20 shadow-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-war-gold/15" style={{
          background: 'linear-gradient(135deg, rgba(184,115,51,0.1) 0%, rgba(20,30,48,0.8) 100%)',
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-war-gold/60" />
              <p className="text-war-copper text-xs tracking-[0.15em] uppercase font-body font-bold">
                Hall of Commanders
              </p>
            </div>
            <div className="w-6 h-px bg-war-gold/20" />
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-3">
          {/* Loading state */}
          {loading && (
            <div className="py-6 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-war-gold/40 animate-candleflicker" />
                <div className="w-1 h-1 rounded-full bg-war-gold/40 animate-candleflicker" style={{ animationDelay: '0.5s' }} />
                <div className="w-1 h-1 rounded-full bg-war-gold/40 animate-candleflicker" style={{ animationDelay: '1s' }} />
              </div>
              <p className="text-parchment-dark/40 text-xs font-body italic mt-2">Loading rankings...</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="py-5 text-center">
              <p className="text-parchment-dark/40 text-xs font-body italic">{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && scores.length === 0 && (
            <div className="py-5 text-center">
              <p className="text-parchment-dark/50 text-sm font-body italic">
                No commanders have entered the record yet.
              </p>
              <p className="text-parchment-dark/30 text-xs font-body mt-1">
                Complete a campaign to claim your place in history.
              </p>
            </div>
          )}

          {/* Scores list */}
          {!loading && !error && scores.length > 0 && (
            <div className="space-y-0">
              {scores.map((s, i) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 py-2 ${
                    i < scores.length - 1 ? 'border-b border-parchment-dark/8' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="w-6 text-center flex-shrink-0">
                    {i < 3 ? (
                      <span className="text-sm leading-none">{rankMedals[i]}</span>
                    ) : (
                      <span className="text-xs text-parchment-dark/40 font-body font-bold">{i + 1}</span>
                    )}
                  </div>

                  {/* Faction icon */}
                  <span className={`text-sm flex-shrink-0 ${factionColors[s.faction] || ''}`}>
                    {factionIcons[s.faction] || '?'}
                  </span>

                  {/* Commander name (truncated) */}
                  <span className={`flex-1 text-sm font-body truncate min-w-0 ${
                    i < 3 ? 'text-parchment/80 font-bold' : 'text-parchment-dark/60'
                  }`}>
                    {s.player_name}
                  </span>

                  {/* Score + victory badge */}
                  <div className="flex items-center flex-shrink-0">
                    <span className={`text-sm font-display font-bold tabular-nums ${
                      i === 0 ? 'text-war-gold' : i < 3 ? 'text-war-brass/80' : 'text-parchment-dark/50'
                    }`}>
                      {s.final_score}
                    </span>
                    <VictoryBadge victoryType={s.game_over_reason} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer button */}
        {onViewFull && (
          <div className="px-5 pb-4 pt-1">
            <button
              onClick={onViewFull}
              className="w-full py-2 text-xs font-body text-parchment-dark/50 tracking-wider uppercase
                         border border-parchment-dark/15 rounded
                         hover:border-war-gold/30 hover:text-war-gold/70 transition-colors cursor-pointer
                         focus:outline-none focus:ring-1 focus:ring-war-gold/30 focus:ring-offset-1 focus:ring-offset-war-navy"
            >
              See All Rankings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
