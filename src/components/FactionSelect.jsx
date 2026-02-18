import React, { useState } from 'react';

const factions = [
  {
    id: 'us',
    name: 'United States',
    icon: '\u{1F985}', // eagle
    color: 'from-us-blue to-blue-900',
    border: 'border-us-blue',
    description: 'Offensive goals — expand territory, repel the British, and ignite American nationalism.',
    leaders: 'Andrew Jackson, Oliver Hazard Perry, William Henry Harrison',
    bonus: '+1 troop per turn from militia rallies',
  },
  {
    id: 'british',
    name: 'British / Canada',
    icon: '\u{1F341}', // maple leaf
    color: 'from-british-red to-red-900',
    border: 'border-british-red',
    description: 'Defensive goals — hold Canada, maintain naval superiority, and blockade American ports.',
    leaders: 'Isaac Brock, Gordon Drummond, Robert Ross',
    bonus: 'Naval superiority: +1 die on coastal attacks',
  },
  {
    id: 'native',
    name: 'Native Coalition',
    icon: '\u{1F3F9}', // bow and arrow
    color: 'from-native-brown to-yellow-900',
    border: 'border-native-brown',
    description: "Tecumseh's Confederacy — forge alliances, defend homelands, and control the frontier.",
    leaders: 'Tecumseh, Tenskwatawa (The Prophet), Black Hawk',
    bonus: 'Ambush: first strike in forest territories',
  },
];

export default function FactionSelect({ onSelect }) {
  const [hoveredFaction, setHoveredFaction] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [classPeriod, setClassPeriod] = useState('');
  const [selectedFaction, setSelectedFaction] = useState(null);

  const handleStart = () => {
    if (selectedFaction && playerName.trim()) {
      onSelect({
        faction: selectedFaction,
        playerName: playerName.trim(),
        classPeriod: classPeriod.trim() || 'Unassigned',
      });
    }
  };

  return (
    <div className="min-h-screen bg-war-navy flex flex-col items-center justify-center p-4">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-serif text-war-gold mb-2 tracking-wide">
          War of 1812
        </h1>
        <p className="text-xl font-serif text-parchment italic">
          Rise of the Nation
        </p>
        <div className="w-48 h-0.5 bg-war-gold mx-auto mt-4 opacity-50" />
      </div>

      {/* Player info */}
      <div className="flex gap-4 mb-8 w-full max-w-md">
        <input
          type="text"
          placeholder="Your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="flex-1 px-4 py-2 bg-war-navy border border-parchment-dark rounded
                     text-parchment placeholder-parchment-dark font-serif
                     focus:outline-none focus:border-war-gold"
          maxLength={30}
        />
        <input
          type="text"
          placeholder="Period"
          value={classPeriod}
          onChange={(e) => setClassPeriod(e.target.value)}
          className="w-24 px-4 py-2 bg-war-navy border border-parchment-dark rounded
                     text-parchment placeholder-parchment-dark font-serif
                     focus:outline-none focus:border-war-gold"
          maxLength={10}
        />
      </div>

      {/* Faction cards */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-4xl">
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
                flex-1 p-6 rounded-lg border-2 transition-all duration-300
                bg-gradient-to-b ${faction.color}
                ${isSelected ? `${faction.border} ring-2 ring-war-gold scale-105` : 'border-transparent'}
                ${isHovered && !isSelected ? 'scale-102 border-parchment-dark' : ''}
                text-left cursor-pointer
              `}
            >
              <div className="text-4xl mb-2">{faction.icon}</div>
              <h2 className="text-xl font-serif text-parchment font-bold mb-2">
                {faction.name}
              </h2>
              <p className="text-sm text-parchment opacity-80 mb-3">
                {faction.description}
              </p>
              <div className="text-xs text-parchment opacity-60 space-y-1">
                <p><span className="text-war-gold">Leaders:</span> {faction.leaders}</p>
                <p><span className="text-war-gold">Bonus:</span> {faction.bonus}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={!selectedFaction || !playerName.trim()}
        className={`
          px-12 py-3 rounded-lg font-serif text-lg tracking-wider
          transition-all duration-300
          ${selectedFaction && playerName.trim()
            ? 'bg-war-gold text-war-navy hover:bg-yellow-500 cursor-pointer'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
        `}
      >
        March to War
      </button>

      {/* Historical context blurb */}
      <p className="text-xs text-parchment-dark mt-8 max-w-lg text-center italic opacity-50">
        June 18, 1812 — President James Madison signs the declaration of war against Great Britain.
        The young republic faces the world's greatest naval power. Will nationalism rise or fall?
      </p>
    </div>
  );
}
