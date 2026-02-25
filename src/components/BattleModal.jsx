import React, { useState, useEffect } from 'react';
import territories from '../data/territories';

function DieFace({ value, color = '#ffffff', size = 52 }) {
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
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label={`Die showing ${value}`} role="img">
      <rect x="2" y="2" width="44" height="44" rx="6" fill={color} opacity="0.12" stroke={color} strokeWidth="1.5" />
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
    if (!showResult) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showResult, onClose]);

  useEffect(() => {
    if (battle) {
      if (battle.undefended) {
        setAnimating(false);
        setShowResult(true);
        return;
      }
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 1000 }} role="presentation">
      <div className="bg-war-navy border border-war-red/40 rounded-lg max-w-lg w-full overflow-hidden shadow-modal animate-fadein" role="dialog" aria-modal="true" aria-label="Battle results">
        {/* Header */}
        <div className="px-6 py-4 border-b border-war-red/20" style={{
          background: 'linear-gradient(135deg, rgba(139,26,26,0.5) 0%, rgba(20,30,48,0.95) 100%)',
        }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
            <p className="text-red-400/80 text-sm tracking-[0.2em] uppercase font-body font-bold">Battle</p>
          </div>
          <h2 className="text-parchment font-display text-lg tracking-wide">
            {fromTerr?.name} <span className="text-war-gold/60 font-body text-base mx-1">vs</span> {toTerr?.name}
          </h2>
        </div>

        <div className="px-6 py-5">
          {battle.undefended ? (
            <div className="text-center py-4 mb-4">
              <p className="text-parchment font-display text-lg mb-2">Undefended Territory</p>
              <p className="text-parchment-dark/60 text-sm font-body">Your forces march in unopposed.</p>
            </div>
          ) : (
            <div className="flex justify-between mb-5">
              <div className="text-center flex-1">
                <p className="text-[#4a90d9] text-sm uppercase tracking-wider mb-3 font-body font-bold">Attacker</p>
                <div className="flex gap-1.5 justify-center">
                  {battle.attackRolls.map((val, i) => (
                    <div key={i} className={animating ? 'animate-bounce' : ''}>
                      <DieFace value={animating ? Math.floor(Math.random() * 6) + 1 : val} color="#4a90d9" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center px-3">
                <span className="text-war-gold/40 font-display text-2xl">vs</span>
              </div>
              <div className="text-center flex-1">
                <p className="text-red-400 text-sm uppercase tracking-wider mb-3 font-body font-bold">Defender</p>
                <div className="flex gap-1.5 justify-center">
                  {battle.defendRolls.map((val, i) => (
                    <div key={i} className={animating ? 'animate-bounce' : ''}>
                      <DieFace value={animating ? Math.floor(Math.random() * 6) + 1 : val} color="#e63946" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showResult && (
            <div className="space-y-3 animate-slideup">
              <div className="flex justify-between text-sm font-body">
                <div className="text-parchment/80">
                  <span className="text-parchment-dark/50">Attacker lost:</span>{' '}
                  <span className="text-red-400 font-bold text-base">{battle.attackerLosses}</span>
                </div>
                <div className="text-parchment/80">
                  <span className="text-parchment-dark/50">Defender lost:</span>{' '}
                  <span className="text-red-400 font-bold text-base">{battle.defenderLosses}</span>
                </div>
              </div>

              {(battle.attackLeaderBonus > 0 || battle.defendLeaderBonus > 0 || battle.fortBonus || battle.firstStrike) && (
                <div className="text-sm text-war-gold/80 bg-war-gold/5 border border-war-gold/10 rounded px-4 py-2.5 font-body">
                  {battle.firstStrike && <p className="font-bold">Ambush! First strike before dice!</p>}
                  {battle.attackLeaderBonus > 0 && <p>Attacker leader: +{battle.attackLeaderBonus}</p>}
                  {battle.defendLeaderBonus > 0 && <p>Defender leader: +{battle.defendLeaderBonus}</p>}
                  {battle.fortBonus && <p>Fort defense: +1</p>}
                </div>
              )}

              <div className={`text-center py-3.5 rounded text-lg font-display font-bold tracking-wide ${
                battle.conquered
                  ? 'bg-green-900/25 border border-green-500/30 text-green-400'
                  : 'bg-red-900/15 border border-red-500/20 text-parchment/80'
              }`}>
                {battle.conquered ? `${toTerr?.name} Captured!` : 'Defenders Hold!'}
              </div>
            </div>
          )}
        </div>

        {showResult && (
          <div className="px-6 pb-5">
            <button onClick={onClose} className="w-full py-3 bg-war-gold text-war-ink font-display rounded hover:bg-war-brass transition-colors cursor-pointer text-base font-bold tracking-wide shadow-copper">
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
