import React, { useState, useEffect } from 'react';
import territories from '../data/territories';

// Dice face SVG — renders a single die showing value 1-6
function DieFace({ value, color = '#ffffff', size = 48 }) {
  const dotPositions = {
    1: [[24, 24]],
    2: [[14, 14], [34, 34]],
    3: [[14, 14], [24, 24], [34, 34]],
    4: [[14, 14], [34, 14], [14, 34], [34, 34]],
    5: [[14, 14], [34, 14], [24, 24], [14, 34], [34, 34]],
    6: [[14, 14], [34, 14], [14, 24], [34, 24], [14, 34], [34, 34]],
    7: [[14, 10], [34, 10], [14, 24], [24, 24], [34, 24], [14, 38], [34, 38]],
  };

  const dots = dotPositions[Math.min(value, 7)] || dotPositions[1];

  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect x="2" y="2" width="44" height="44" rx="6" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill={color} />
      ))}
    </svg>
  );
}

export default function BattleModal({ battle, onClose }) {
  const [animating, setAnimating] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (battle) {
      setAnimating(true);
      setShowResult(false);
      const timer = setTimeout(() => {
        setAnimating(false);
        setShowResult(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [battle]);

  if (!battle) return null;

  const fromTerr = territories[battle.fromId];
  const toTerr = territories[battle.toId];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-war-navy border-2 border-war-red rounded-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-war-red to-red-900 px-6 py-3">
          <p className="text-war-gold text-xs tracking-widest uppercase">Battle</p>
          <h2 className="text-parchment font-serif text-lg">
            {fromTerr?.name} attacks {toTerr?.name}
          </h2>
        </div>

        <div className="px-6 py-5">
          {/* Dice display */}
          <div className="flex justify-between mb-6">
            {/* Attacker dice */}
            <div className="text-center flex-1">
              <p className="text-us-blue text-xs uppercase tracking-wider mb-2">Attacker</p>
              <div className="flex gap-2 justify-center">
                {battle.attackRolls.map((val, i) => (
                  <div key={i} className={animating ? 'animate-bounce' : ''}>
                    <DieFace value={animating ? Math.floor(Math.random() * 6) + 1 : val} color="#4a90d9" />
                  </div>
                ))}
              </div>
            </div>

            {/* VS */}
            <div className="flex items-center px-3">
              <span className="text-war-gold font-serif text-2xl font-bold">vs</span>
            </div>

            {/* Defender dice */}
            <div className="text-center flex-1">
              <p className="text-british-red text-xs uppercase tracking-wider mb-2">Defender</p>
              <div className="flex gap-2 justify-center">
                {battle.defendRolls.map((val, i) => (
                  <div key={i} className={animating ? 'animate-bounce' : ''}>
                    <DieFace value={animating ? Math.floor(Math.random() * 6) + 1 : val} color="#c41e3a" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          {showResult && (
            <div className="space-y-3">
              {/* Casualties */}
              <div className="flex justify-between text-sm">
                <div className="text-parchment">
                  <span className="text-parchment-dark">Attacker losses:</span>{' '}
                  <span className="text-red-400 font-bold">{battle.attackerLosses}</span>
                </div>
                <div className="text-parchment">
                  <span className="text-parchment-dark">Defender losses:</span>{' '}
                  <span className="text-red-400 font-bold">{battle.defenderLosses}</span>
                </div>
              </div>

              {/* Bonuses */}
              {(battle.attackLeaderBonus > 0 || battle.defendLeaderBonus > 0 || battle.fortBonus || battle.firstStrike) && (
                <div className="text-sm text-war-gold bg-black bg-opacity-30 rounded px-3 py-2">
                  {battle.firstStrike && (
                    <p className="font-bold">Ambush! First strike deals damage before dice!</p>
                  )}
                  {battle.attackLeaderBonus > 0 && (
                    <p>Attacker leader bonus: +{battle.attackLeaderBonus}</p>
                  )}
                  {battle.defendLeaderBonus > 0 && (
                    <p>Defender leader bonus: +{battle.defendLeaderBonus}</p>
                  )}
                  {battle.fortBonus && <p>Fort defense bonus: +1</p>}
                </div>
              )}

              {/* Outcome */}
              <div
                className={`text-center py-3 rounded-lg text-lg font-serif ${
                  battle.conquered
                    ? 'bg-green-900 bg-opacity-50 text-green-300'
                    : 'bg-red-900 bg-opacity-30 text-parchment'
                }`}
              >
                {battle.conquered
                  ? `${toTerr?.name} Captured!`
                  : 'Defenders Hold!'}
              </div>
            </div>
          )}
        </div>

        {/* Dismiss */}
        {showResult && (
          <div className="px-6 pb-5">
            <button
              onClick={onClose}
              className="w-full py-3 bg-war-gold text-war-navy font-serif rounded-lg
                         hover:bg-yellow-500 transition-colors cursor-pointer text-sm"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
