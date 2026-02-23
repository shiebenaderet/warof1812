import React, { useRef, useEffect } from 'react';

export default function VictoryProgress({
  currentScore,
  playerFaction,
  nationalismMeter,
  nativeResistance,
  navalDominance,
  objectiveBonus,
  round
}) {
  // Calculate faction multiplier (same logic as in useGameState.js)
  let multiplier = 1;
  if (playerFaction === 'us') {
    multiplier = 1 + nationalismMeter / 100;
  } else if (playerFaction === 'native') {
    multiplier = 1 + (Math.min(nativeResistance, 6) / 6) * 0.5;
  } else if (playerFaction === 'british') {
    multiplier = 1 + (Math.min(navalDominance, 4) / 4) * 0.3;
  }

  const baseScore = currentScore || 0;
  const finalScore = Math.round(baseScore * multiplier) + objectiveBonus;
  const VICTORY_THRESHOLD = 50;

  // Track previous score using ref
  const previousScoreRef = useRef(0);
  const previousRoundRef = useRef(round);

  // Calculate score change only when round changes
  const scoreChange = (round > previousRoundRef.current) ? (finalScore - previousScoreRef.current) : 0;
  const showChange = scoreChange !== 0 && round > 1;

  // Update refs when round changes
  useEffect(() => {
    if (round > previousRoundRef.current) {
      previousScoreRef.current = finalScore;
      previousRoundRef.current = round;
    }
  }, [round, finalScore]);

  // Calculate progress percentage (capped at 100%)
  const progressPercent = Math.min((finalScore / VICTORY_THRESHOLD) * 100, 100);

  // Determine color coding
  let barColor = 'from-parchment-dark to-parchment';
  let textColor = 'text-parchment';
  let glowClass = '';

  if (finalScore >= 40) {
    barColor = 'from-green-600 to-green-400';
    textColor = 'text-green-400';
    glowClass = 'victory-pulse'; // CSS animation class
  } else if (finalScore >= 25) {
    barColor = 'from-yellow-600 to-yellow-400';
    textColor = 'text-yellow-400';
  }

  return (
    <div className={`victory-progress-container ${glowClass}`} style={{ position: 'relative', zIndex: 1000 }}>
      <div className="bg-black bg-opacity-80 border-2 border-war-gold rounded-lg px-4 py-3 shadow-2xl">
        {/* Header with current score */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-war-gold font-serif text-lg font-bold">Victory Progress</h3>
          <div className="flex items-center gap-2">
            {showChange && (
              <span className={`text-sm font-bold ${scoreChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {scoreChange > 0 ? '+' : ''}{scoreChange}
              </span>
            )}
            <span className={`text-2xl font-bold font-serif ${textColor}`}>
              {finalScore}
            </span>
            <span className="text-parchment-dark text-sm font-serif">/ {VICTORY_THRESHOLD}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-war-navy rounded-full h-6 border border-parchment-dark border-opacity-30 overflow-hidden mb-2">
          <div
            className={`h-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out relative`}
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer" />
          </div>
        </div>

        {/* Status message */}
        {finalScore >= 40 ? (
          <div className="flex items-center justify-center gap-2 victory-flash">
            <span className="text-green-400 text-base font-serif font-bold animate-pulse">
              ⚔️ You're close to victory! ⚔️
            </span>
          </div>
        ) : finalScore >= 25 ? (
          <div className="text-center">
            <span className="text-yellow-400 text-sm font-serif">
              Halfway there! Keep fighting!
            </span>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-parchment-dark text-sm font-serif italic">
              {VICTORY_THRESHOLD - finalScore} points to victory
            </span>
          </div>
        )}

        {/* Breakdown tooltip (on hover, shows calculation) */}
        {(multiplier > 1 || objectiveBonus > 0) && (
          <div className="mt-2 pt-2 border-t border-parchment-dark border-opacity-20">
            <div className="text-xs text-parchment-dark space-y-0.5">
              <div className="flex justify-between">
                <span>Base Score:</span>
                <span>{baseScore}</span>
              </div>
              {multiplier > 1 && (
                <div className="flex justify-between">
                  <span>Faction Multiplier:</span>
                  <span>×{multiplier.toFixed(2)}</span>
                </div>
              )}
              {objectiveBonus > 0 && (
                <div className="flex justify-between">
                  <span>Objective Bonus:</span>
                  <span className="text-war-gold">+{objectiveBonus}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-parchment border-t border-parchment-dark border-opacity-20 pt-1 mt-1">
                <span>Total Score:</span>
                <span>{finalScore}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
