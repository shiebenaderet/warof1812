import React, { useState } from 'react';
import { CURRENT_VERSION, changelog } from '../data/changelog';

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
    simpleDescription: 'Fight for America! Push the British out and make your country stronger.',
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
    simpleDescription: 'Defend Canada! Use your strong navy to block American ships.',
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
    simpleDescription: 'Unite the tribes! Protect your homeland from American settlers.',
    leaders: 'Tecumseh, Tenskwatawa, Black Hawk',
    bonus: 'Guerrilla tactics: first strike in forest territories',
  },
];

export default function FactionSelect({ onSelect, onOpenPeopleGallery, gameMode, fontMode, toggleFont }) {
  const [hoveredFaction, setHoveredFaction] = useState(null);
  const [selectedFaction, setSelectedFaction] = useState(null);
  const [showChangelog, setShowChangelog] = useState(false);

  const isExplorer = gameMode === 'explorer';

  const handleStart = () => {
    if (selectedFaction) {
      onSelect(selectedFaction);
    }
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
              <span className="text-war-copper text-xs md:text-sm tracking-[0.3em] uppercase font-body">Choose Your Faction</span>
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
                  <p className={`text-sm md:text-base text-parchment/80 mb-4 leading-relaxed font-body ${isExplorer ? 'text-base md:text-lg' : ''}`}>
                    {isExplorer ? faction.simpleDescription : faction.description}
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
          <div className="flex flex-wrap gap-3 justify-center">
            {onOpenPeopleGallery && (
              <button
                onClick={onOpenPeopleGallery}
                className="px-8 py-3 rounded font-body text-base border border-war-copper/30 text-war-copper/80
                           hover:bg-war-copper/10 hover:border-war-copper/50 transition-all cursor-pointer tracking-wide
                           focus:outline-none focus:ring-2 focus:ring-war-copper/40 focus:ring-offset-2 focus:ring-offset-war-ink"
              >
                Meet the People of 1812
              </button>
            )}
          </div>

          <button
            onClick={handleStart}
            disabled={!selectedFaction}
            className={`
              px-12 md:px-16 py-3.5 rounded font-display text-lg md:text-xl tracking-widest font-bold
              transition-all duration-300 uppercase
              focus:outline-none focus:ring-2 focus:ring-war-gold/50 focus:ring-offset-2 focus:ring-offset-war-ink
              ${selectedFaction
                ? 'bg-war-gold text-war-ink hover:bg-war-brass cursor-pointer shadow-copper'
                : 'bg-white/10 text-parchment-dark/40 border border-parchment-dark/20 cursor-not-allowed'}
            `}
          >
            March to War
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-parchment/50 mt-10 max-w-lg mx-auto italic font-body leading-relaxed">
          June 18, 1812 &mdash; President Madison signs the declaration of war against Great Britain.
          The young republic faces the world&apos;s greatest naval power.
        </p>
        <div className="text-center mt-4 space-y-2">
          <div className="flex items-center justify-center gap-3 text-xs font-body">
            <a
              href="#guide"
              className="text-war-gold/50 hover:text-war-gold/80 transition-colors"
            >
              Teacher Guide
            </a>
            <span className="text-parchment-dark/20">|</span>
            <button
              onClick={() => setShowChangelog(!showChangelog)}
              className="text-war-gold/50 hover:text-war-gold/80 transition-colors cursor-pointer"
            >
              What&apos;s New
            </button>
            <span className="text-parchment-dark/20">|</span>
            <button
              onClick={toggleFont}
              className={`transition-colors cursor-pointer ${fontMode === 'dyslexic' ? 'text-war-gold font-bold' : 'text-war-gold/50 hover:text-war-gold/80'}`}
            >
              Aa {fontMode === 'dyslexic' ? 'OpenDyslexic On' : 'OpenDyslexic'}
            </button>
          </div>
          <p className="text-xs text-parchment-dark/40 font-body">
            v{CURRENT_VERSION}
          </p>
        </div>

        {/* Changelog */}
        {showChangelog && (
          <div className="w-full max-w-md mx-auto mt-4 bg-war-navy/60 backdrop-blur rounded-lg p-5 border border-war-gold/20 shadow-card animate-fadein">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-war-gold/90 font-display text-sm tracking-wide">What&apos;s New</h3>
              <button onClick={() => setShowChangelog(false)} className="text-parchment-dark/40 hover:text-parchment text-xs cursor-pointer">&times;</button>
            </div>
            {changelog.slice(0, 2).map((entry) => (
              <div key={entry.version} className="mb-4 last:mb-0">
                <p className="text-parchment/80 text-sm font-body font-bold">
                  v{entry.version} &mdash; {entry.title}
                </p>
                <p className="text-parchment-dark/40 text-xs font-body mb-1">{entry.date}</p>
                <ul className="space-y-0.5">
                  {entry.changes.map((change, i) => (
                    <li key={i} className="text-parchment-dark/60 text-xs font-body pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-war-gold/40">
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
