import React, { useRef, useEffect } from 'react';

export default function VictoryProgress({
  currentScore, playerFaction, nationalismMeter, nativeResistance,
  navalDominance, objectiveBonus, round,
}) {
  let multiplier = 1;
  if (playerFaction === 'us') multiplier = 1 + nationalismMeter / 100;
  else if (playerFaction === 'native') multiplier = 1 + (Math.min(nativeResistance, 6) / 6) * 0.5;
  else if (playerFaction === 'british') multiplier = 1 + (Math.min(navalDominance, 4) / 4) * 0.3;

  const baseScore = currentScore || 0;
  const finalScore = Math.round(baseScore * multiplier) + objectiveBonus;
  const VICTORY_THRESHOLD = 50;

  const previousScoreRef = useRef(0);
  const previousRoundRef = useRef(round);
  const scoreChange = (round > previousRoundRef.current) ? (finalScore - previousScoreRef.current) : 0;
  const showChange = scoreChange !== 0 && round > 1;

  useEffect(() => {
    if (round > previousRoundRef.current) {
      previousScoreRef.current = finalScore;
      previousRoundRef.current = round;
    }
  }, [round, finalScore]);

  const progressPercent = Math.min((finalScore / VICTORY_THRESHOLD) * 100, 100);

  const isClose = finalScore >= 40;
  const isHalfway = finalScore >= 25;

  return (
    <div className="victory-progress-container" style={{ position: 'relative', zIndex: 1000 }}>
      <div className={`bg-war-navy/80 border rounded-lg px-3 py-2.5 shadow-card ${
        isClose ? 'border-green-500/30' : 'border-war-gold/15'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-war-gold/80 font-display text-sm tracking-wide">Victory</h3>
          <div className="flex items-center gap-2">
            {showChange && (
              <span className={`text-xs font-bold font-body ${scoreChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {scoreChange > 0 ? '+' : ''}{scoreChange}
              </span>
            )}
            <span className={`text-xl font-bold font-display ${isClose ? 'text-green-400' : isHalfway ? 'text-war-gold' : 'text-parchment/80'}`}>
              {finalScore}
            </span>
            <span className="text-parchment-dark/40 text-xs font-body">/ {VICTORY_THRESHOLD}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-war-ink rounded-full h-4 border border-parchment-dark/10 overflow-hidden mb-1.5">
          <div
            className="h-full transition-all duration-700 ease-out relative rounded-full"
            style={{
              width: `${progressPercent}%`,
              background: isClose
                ? 'linear-gradient(to right, #166534, #22c55e)'
                : isHalfway
                ? 'linear-gradient(to right, #854d0e, #c9a227)'
                : 'linear-gradient(to right, #44403c, #a8a29e)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Status */}
        <p className={`text-center text-xs font-body ${isClose ? 'text-green-400/80 font-bold' : isHalfway ? 'text-war-gold/60' : 'text-parchment-dark/40 italic'}`}>
          {isClose ? 'Near victory!' : isHalfway ? 'Keep fighting!' : `${VICTORY_THRESHOLD - finalScore} pts remaining`}
        </p>

        {/* Score breakdown */}
        {(multiplier > 1 || objectiveBonus > 0) && (
          <div className="mt-2 pt-2 border-t border-parchment-dark/10">
            <div className="text-xs text-parchment-dark/40 space-y-0.5 font-body">
              <div className="flex justify-between"><span>Base</span><span>{baseScore}</span></div>
              {multiplier > 1 && <div className="flex justify-between"><span>Multiplier</span><span>x{multiplier.toFixed(2)}</span></div>}
              {objectiveBonus > 0 && <div className="flex justify-between"><span>Objectives</span><span className="text-war-gold/70">+{objectiveBonus}</span></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
