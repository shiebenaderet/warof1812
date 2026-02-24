import React, { useState } from 'react';
import LeaderboardPreview from './LeaderboardPreview';
import Leaderboard from './Leaderboard';

const factions = [
  {
    id: 'us',
    name: 'United States',
    icon: '\u{1F985}',
    gradient: 'from-[#0a1628] to-[#1a3a6e]',
    accent: '#4a7ec7',
    border: 'border-[#4a7ec7]',
    ring: 'ring-[#4a7ec7]',
    description: 'Expand territory, repel the British, and ignite American nationalism.',
    leaders: 'Andrew Jackson, Oliver H. Perry, William H. Harrison',
    bonus: 'Nationalism meter boosts your score multiplier',
  },
  {
    id: 'british',
    name: 'British / Canada',
    icon: '\u{1F341}',
    gradient: 'from-[#1a0a0a] to-[#6b1a2a]',
    accent: '#e63946',
    border: 'border-[#e63946]',
    ring: 'ring-[#e63946]',
    description: 'Hold Canada, maintain naval superiority, and blockade American ports.',
    leaders: 'Isaac Brock, Gordon Drummond, Robert Ross',
    bonus: 'Naval superiority: +1 die on coastal attacks',
  },
  {
    id: 'native',
    name: 'Native Coalition',
    icon: '\u{1F3F9}',
    gradient: 'from-[#1a1208] to-[#5a3a1e]',
    accent: '#d4a24e',
    border: 'border-[#d4a24e]',
    ring: 'ring-[#d4a24e]',
    description: "Forge alliances, defend homelands, and control the frontier.",
    leaders: 'Tecumseh, Tenskwatawa, Black Hawk',
    bonus: 'Guerrilla tactics: first strike in forest territories',
  },
];

export default function FactionSelect({ onSelect, savedGame, onContinue, onDeleteSave, onExportSave, onImportSave, onStartLearning }) {
  const [hoveredFaction, setHoveredFaction] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [classPeriod, setClassPeriod] = useState('');
  const [selectedFaction, setSelectedFaction] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleStart = () => {
    if (selectedFaction && playerName.trim()) {
      onSelect({
        faction: selectedFaction,
        playerName: playerName.trim(),
        classPeriod: classPeriod.trim() || 'Unassigned',
      });
    }
  };

  const handleDelete = () => {
    if (confirmingDelete) {
      onDeleteSave();
      setConfirmingDelete(false);
    } else {
      setConfirmingDelete(true);
    }
  };

  const handleExport = () => {
    if (onExportSave) {
      const result = onExportSave();
      if (!result.success) {
        alert('Failed to export: ' + (result.error || 'Unknown error'));
      }
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (onImportSave) {
          const result = onImportSave(event.target.result);
          if (!result.success) {
            alert('Failed to import: ' + (result.error || 'Unknown error'));
          }
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-war-ink flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(201,162,39,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(184,115,51,0.1) 0%, transparent 50%)',
      }} />
      <div className="absolute inset-0 bg-noise opacity-30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl">

        {/* Title block */}
        <div className="text-center mb-8 md:mb-12 animate-fadein">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-war-gold opacity-60" />
              <span className="text-war-copper text-xs md:text-sm tracking-[0.3em] uppercase font-body">A Strategy Game</span>
              <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-war-gold opacity-60" />
            </div>
            <h1 className="text-5xl md:text-7xl font-display text-parchment tracking-wide leading-none mb-2" style={{
              textShadow: '0 2px 20px rgba(201,162,39,0.2)',
            }}>
              War of 1812
            </h1>
            <p className="text-xl md:text-2xl font-display italic text-war-gold tracking-wider">
              Rise of the Nation
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-8 h-px bg-war-gold opacity-40" />
              <div className="w-1.5 h-1.5 rotate-45 border border-war-gold opacity-40" />
              <div className="w-24 h-px bg-war-gold opacity-40" />
              <div className="w-1.5 h-1.5 rotate-45 border border-war-gold opacity-40" />
              <div className="w-8 h-px bg-war-gold opacity-40" />
            </div>
          </div>
        </div>

        {/* Player info inputs */}
        <div className="flex gap-3 mb-8 w-full max-w-md mx-auto animate-slideup" style={{ animationDelay: '0.1s' }}>
          <input
            type="text"
            placeholder="Commander's name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="flex-1 px-4 py-3 bg-transparent border border-parchment-dark/30 rounded
                       text-parchment placeholder-parchment-dark/50 font-body text-lg
                       focus:outline-none focus:border-war-gold/70 focus:ring-1 focus:ring-war-gold/30 transition-colors"
            maxLength={30}
          />
          <input
            type="text"
            placeholder="Period"
            value={classPeriod}
            onChange={(e) => setClassPeriod(e.target.value)}
            className="w-24 px-4 py-3 bg-transparent border border-parchment-dark/30 rounded
                       text-parchment placeholder-parchment-dark/50 font-body text-lg
                       focus:outline-none focus:border-war-gold/70 focus:ring-1 focus:ring-war-gold/30 transition-colors"
            maxLength={10}
          />
        </div>

        {/* Faction cards */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-5 mb-8 w-full animate-slideup" style={{ animationDelay: '0.2s' }}>
          {factions.map((faction) => {
            const isSelected = selectedFaction === faction.id;
            const isHovered = hoveredFaction === faction.id;

            return (
              <button
                key={faction.id}
                onClick={() => setSelectedFaction(faction.id)}
                onMouseEnter={() => setHoveredFaction(faction.id)}
                onMouseLeave={() => setHoveredFaction(null)}
                className={`
                  flex-1 p-6 md:p-7 rounded-lg transition-all duration-300 text-left cursor-pointer
                  bg-gradient-to-b ${faction.gradient}
                  border-2 relative overflow-hidden group
                  focus:outline-none focus:ring-2 ${faction.ring} focus:ring-offset-2 focus:ring-offset-war-ink
                  ${isSelected ? `${faction.border} shadow-modal` : 'border-white/5 hover:border-white/15'}
                  ${isHovered && !isSelected ? 'scale-[1.02]' : ''}
                  ${isSelected ? 'scale-[1.03]' : ''}
                `}
              >
                {/* Subtle glow on selected */}
                {isSelected && (
                  <div className="absolute inset-0 opacity-10" style={{
                    background: `radial-gradient(circle at 50% 0%, ${faction.accent}, transparent 70%)`,
                  }} />
                )}

                <div className="relative z-10">
                  <div className="text-4xl mb-3 opacity-80 group-hover:opacity-100 transition-opacity">{faction.icon}</div>
                  <h2 className="text-xl md:text-2xl font-display text-parchment font-bold mb-2 tracking-wide">
                    {faction.name}
                  </h2>
                  <p className="text-sm md:text-base text-parchment/80 mb-4 leading-relaxed font-body">
                    {faction.description}
                  </p>
                  <div className="text-sm text-parchment/60 space-y-1 font-body">
                    <p><span className="text-war-gold font-semibold">Leaders:</span> {faction.leaders}</p>
                    <p><span className="text-war-gold font-semibold">Bonus:</span> {faction.bonus}</p>
                  </div>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: faction.accent }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4 items-center animate-slideup" style={{ animationDelay: '0.3s' }}>
          {onStartLearning && (
            <button
              onClick={onStartLearning}
              className="px-8 py-3 rounded font-body text-base border border-war-gold/30 text-war-gold/80
                         hover:bg-war-gold/10 hover:border-war-gold/50 transition-all cursor-pointer tracking-wide
                         focus:outline-none focus:ring-2 focus:ring-war-gold/40 focus:ring-offset-2 focus:ring-offset-war-ink"
            >
              Learn About the War (5 min)
            </button>
          )}

          <button
            onClick={handleStart}
            disabled={!selectedFaction || !playerName.trim()}
            className={`
              px-12 md:px-16 py-3.5 rounded font-display text-lg md:text-xl tracking-widest font-bold
              transition-all duration-300 uppercase
              focus:outline-none focus:ring-2 focus:ring-war-gold/50 focus:ring-offset-2 focus:ring-offset-war-ink
              ${selectedFaction && playerName.trim()
                ? 'bg-war-gold text-war-ink hover:bg-war-brass cursor-pointer shadow-copper'
                : 'bg-white/10 text-parchment-dark/40 border border-parchment-dark/20 cursor-not-allowed'}
            `}
          >
            March to War
          </button>
        </div>

        {/* Saved game — positioned below action buttons */}
        {savedGame && (
          <div className="w-full max-w-md mx-auto mt-8 bg-war-navy/60 backdrop-blur rounded-lg p-5 border border-war-gold/20 shadow-card animate-slideup">
            <p className="text-parchment text-base font-body mb-3">
              Saved campaign: <span className="text-war-gold font-bold">{savedGame.playerName}</span> &mdash; Round {savedGame.round}, {savedGame.season}
            </p>
            <div className="flex gap-3 mb-3">
              <button
                onClick={onContinue}
                className="flex-1 py-3 bg-war-gold text-war-ink font-display rounded
                           hover:bg-war-brass transition-colors cursor-pointer text-base font-bold tracking-wide
                           focus:outline-none focus:ring-2 focus:ring-war-gold/50 focus:ring-offset-2 focus:ring-offset-war-navy"
              >
                Continue Campaign
              </button>
              <button
                onClick={handleDelete}
                className={`px-4 py-3 border font-body rounded transition-colors cursor-pointer text-sm
                           focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-war-navy
                           ${confirmingDelete
                             ? 'border-red-500/60 bg-red-500/15 text-red-400 hover:bg-red-500/25'
                             : 'border-parchment-dark/30 text-parchment/60 hover:border-red-400/60 hover:text-red-400'}`}
              >
                {confirmingDelete ? 'Confirm?' : 'Delete'}
              </button>
            </div>
            {confirmingDelete && (
              <p className="text-red-400/70 text-xs font-body mb-3">
                This will permanently delete your save. Press again to confirm, or{' '}
                <button onClick={() => setConfirmingDelete(false)} className="underline hover:text-parchment cursor-pointer">cancel</button>.
              </p>
            )}
            <div className="flex gap-3 pt-3 border-t border-parchment-dark/20">
              <button onClick={handleExport} className="flex-1 py-2.5 border border-war-gold/30 text-war-gold/80 font-body rounded hover:bg-war-gold/10 transition-colors cursor-pointer text-sm">
                Export Backup
              </button>
              <button onClick={handleImport} className="flex-1 py-2.5 border border-parchment-dark/30 text-parchment/60 font-body rounded hover:border-war-gold/40 hover:text-war-gold/80 transition-colors cursor-pointer text-sm">
                Import Save
              </button>
            </div>
          </div>
        )}

        {!savedGame && onImportSave && (
          <div className="w-full max-w-md mx-auto mt-8">
            <button onClick={handleImport} className="w-full py-3 border border-parchment-dark/20 text-parchment/50 font-body rounded hover:border-war-gold/40 hover:text-war-gold/80 transition-colors cursor-pointer text-sm">
              Import Save File
            </button>
          </div>
        )}

        {/* Leaderboard Preview */}
        <LeaderboardPreview onViewFull={() => setShowLeaderboard(true)} />

        {/* Footer */}
        <p className="text-center text-sm text-parchment/50 mt-10 max-w-lg mx-auto italic font-body leading-relaxed">
          June 18, 1812 &mdash; President Madison signs the declaration of war against Great Britain.
          The young republic faces the world&apos;s greatest naval power.
        </p>
        <p className="text-center text-xs text-parchment-dark/40 mt-4 font-body">
          v1.1.0
        </p>
      </div>

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}
