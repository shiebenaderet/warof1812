import React, { useState } from 'react';
import { DIFFICULTY_LABELS } from '../data/difficultySettings';

const difficulties = ['easy', 'medium', 'hard'];

const difficultyColors = {
  easy: { border: 'border-green-500/30', bg: 'bg-green-900/10', accent: 'text-green-400' },
  medium: { border: 'border-war-gold/30', bg: 'bg-war-gold/10', accent: 'text-war-gold' },
  hard: { border: 'border-red-500/30', bg: 'bg-red-900/10', accent: 'text-red-400' },
};

export default function DifficultySelect({ onNext, playerName }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [gameMode, setGameMode] = useState('historian');

  const handleContinue = () => {
    onNext({ difficulty, gameMode });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold mb-2">
            Welcome, {playerName}
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-war-gold tracking-wide mb-2">
            Choose Your Challenge
          </h1>
          <p className="text-parchment-dark/50 text-sm font-body">
            Select how tough you want the AI opponent to be.
          </p>
        </div>

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {difficulties.map((d) => {
            const label = DIFFICULTY_LABELS[d];
            const colors = difficultyColors[d];
            const selected = difficulty === d;
            return (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer text-left
                  ${selected
                    ? `${colors.border} ${colors.bg} shadow-modal`
                    : 'border-parchment-dark/10 bg-war-navy/50 hover:border-parchment-dark/25'
                  }`}
              >
                <h3 className={`font-display text-xl mb-2 tracking-wide ${selected ? colors.accent : 'text-parchment/70'}`}>
                  {label.name}
                </h3>
                <p className={`text-sm font-body leading-relaxed ${selected ? 'text-parchment/70' : 'text-parchment-dark/50'}`}>
                  {label.description}
                </p>
                {d === 'medium' && (
                  <span className="inline-block mt-3 text-xs font-body text-war-gold/50 uppercase tracking-wider">
                    Recommended
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explorer/Historian Toggle */}
        <div className="bg-war-navy border border-war-gold/20 rounded-lg p-6 shadow-modal mb-8">
          <h2 className="text-war-gold/80 font-display text-sm mb-4 tracking-wide border-b border-war-gold/15 pb-2">
            Reading Level
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setGameMode('historian')}
              className={`flex-1 py-3 px-4 rounded-lg font-display text-sm tracking-wide transition-all cursor-pointer border
                ${gameMode === 'historian'
                  ? 'bg-war-gold/15 border-war-gold/40 text-war-gold font-bold'
                  : 'border-parchment-dark/15 text-parchment-dark/50 hover:border-parchment-dark/30'
                }`}
            >
              <span className="block text-base mb-1">Historian Mode</span>
              <span className="block text-xs font-body font-normal opacity-70">Full detail &mdash; 8th grade reading level</span>
            </button>
            <button
              onClick={() => setGameMode('explorer')}
              className={`flex-1 py-3 px-4 rounded-lg font-display text-sm tracking-wide transition-all cursor-pointer border
                ${gameMode === 'explorer'
                  ? 'bg-war-gold/15 border-war-gold/40 text-war-gold font-bold'
                  : 'border-parchment-dark/15 text-parchment-dark/50 hover:border-parchment-dark/30'
                }`}
            >
              <span className="block text-base mb-1">Explorer Mode</span>
              <span className="block text-xs font-body font-normal opacity-70">Simplified text &mdash; 3rd grade reading level</span>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-war-gold text-war-ink font-display text-lg rounded-lg font-bold tracking-wider
                     hover:bg-war-brass transition-colors cursor-pointer shadow-copper"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
