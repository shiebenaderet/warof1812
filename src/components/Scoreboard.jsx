import React from 'react';

const factionLabels = {
  us: 'United States',
  british: 'British/Canada',
  native: 'Native Coalition',
};

const factionStyles = {
  us: 'bg-us-blue',
  british: 'bg-british-red',
  native: 'bg-native-brown',
};

export default function Scoreboard({ scores, playerFaction, nationalismMeter, playerTerritoryCount }) {
  return (
    <div className="bg-black bg-opacity-40 rounded-lg p-4 space-y-4">
      <h3 className="text-war-gold font-serif text-lg border-b border-war-gold border-opacity-30 pb-2">
        Scores
      </h3>

      {Object.entries(scores).map(([faction, score]) => (
        <div key={faction} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${factionStyles[faction]}`} />
            <span className={`text-sm font-serif ${faction === playerFaction ? 'text-war-gold' : 'text-parchment'}`}>
              {factionLabels[faction]}
              {faction === playerFaction && ' (You)'}
            </span>
          </div>
          <span className="text-parchment font-bold">{score}</span>
        </div>
      ))}

      {/* Territories held */}
      <div className="pt-2 border-t border-parchment-dark border-opacity-20">
        <div className="flex justify-between text-sm">
          <span className="text-parchment-dark">Your territories</span>
          <span className="text-parchment">{playerTerritoryCount}</span>
        </div>
      </div>

      {/* Nationalism meter (US-specific) */}
      {playerFaction === 'us' && (
        <div className="pt-2 border-t border-parchment-dark border-opacity-20">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-parchment-dark">Nationalism</span>
            <span className="text-war-gold">{nationalismMeter}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${nationalismMeter}%`,
                background: `linear-gradient(to right, #002868, #c9a227)`,
              }}
            />
          </div>
          <p className="text-xs text-parchment-dark mt-1 italic">
            Final score multiplier: x{(1 + nationalismMeter / 100).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
