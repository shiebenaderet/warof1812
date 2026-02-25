import React from 'react';

const factionLabels = {
  us: 'United States',
  british: 'British / Canada',
  native: 'Native Coalition',
};

const factionColors = {
  us: '#4a7ec7',
  british: '#e63946',
  native: '#d4a24e',
};

export default function Scoreboard({ scores, playerFaction, nationalismMeter, playerTerritoryCount, nativeResistance, navalDominance, factionMultiplier }) {
  return (
    <div className="bg-war-navy/50 rounded-lg p-3 space-y-3 border border-parchment-dark/8" aria-live="polite" aria-atomic="true">
      <h3 className="text-war-gold/90 font-display text-base tracking-wide border-b border-war-gold/15 pb-2">
        Scores
      </h3>

      {Object.entries(scores).map(([faction, score]) => (
        <div key={faction} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: factionColors[faction] }} />
            <span className={`text-sm font-body ${faction === playerFaction ? 'text-war-gold font-bold' : 'text-parchment/70'}`}>
              {factionLabels[faction]}
              {faction === playerFaction && ' (You)'}
            </span>
          </div>
          <span className="text-parchment font-bold text-base font-display">{score}</span>
        </div>
      ))}

      <div className="pt-2 border-t border-parchment-dark/10">
        <div className="flex justify-between text-sm">
          <span className="text-parchment-dark/50 font-body">Your territories</span>
          <span className="text-parchment/80 font-bold font-body">{playerTerritoryCount}</span>
        </div>
      </div>

      {/* Faction meter */}
      {playerFaction === 'us' && (
        <div className="pt-2 border-t border-parchment-dark/10">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-parchment-dark/50 font-body">Nationalism</span>
            <span className="text-war-gold/80 font-bold font-body">{nationalismMeter}%</span>
          </div>
          <div className="w-full bg-war-ink rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${nationalismMeter}%`, background: 'linear-gradient(to right, #1a3a6e, #c9a227)' }} />
          </div>
          <p className="text-sm text-parchment-dark/40 mt-1 font-body">Multiplier: x{factionMultiplier.toFixed(2)}</p>
        </div>
      )}
      {playerFaction === 'native' && (
        <div className="pt-2 border-t border-parchment-dark/10">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-parchment-dark/50 font-body">Resistance</span>
            <span className="text-war-gold/80 font-bold font-body">{nativeResistance}/6</span>
          </div>
          <div className="w-full bg-war-ink rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round((Math.min(nativeResistance, 6) / 6) * 100)}%`, background: 'linear-gradient(to right, #5a3a1e, #c9a227)' }} />
          </div>
          <p className="text-sm text-parchment-dark/40 mt-1 font-body">Multiplier: x{factionMultiplier.toFixed(2)}</p>
        </div>
      )}
      {playerFaction === 'british' && (
        <div className="pt-2 border-t border-parchment-dark/10">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-parchment-dark/50 font-body">Naval Dominance</span>
            <span className="text-war-gold/80 font-bold font-body">{navalDominance}/4</span>
          </div>
          <div className="w-full bg-war-ink rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round((Math.min(navalDominance, 4) / 4) * 100)}%`, background: 'linear-gradient(to right, #6b1a2a, #c9a227)' }} />
          </div>
          <p className="text-sm text-parchment-dark/40 mt-1 font-body">Multiplier: x{factionMultiplier.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
