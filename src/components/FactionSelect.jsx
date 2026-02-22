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

export default function FactionSelect({ onSelect, savedGame, onContinue, onDeleteSave, onExportSave, onImportSave }) {
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

  const handleExport = () => {
    if (onExportSave) {
      const result = onExportSave();
      if (result.success) {
        alert('Save file exported successfully!');
      } else {
        alert('Failed to export save file: ' + (result.error || 'Unknown error'));
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
          if (result.success) {
            alert('Save file imported successfully! Click "Continue Campaign" to resume.');
          } else {
            alert('Failed to import save file: ' + (result.error || 'Unknown error'));
          }
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-war-navy flex flex-col items-center justify-center p-6">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-6xl font-serif text-war-gold mb-3 tracking-wide">
          War of 1812
        </h1>
        <p className="text-2xl font-serif text-parchment italic">
          Rise of the Nation
        </p>
        <div className="w-48 h-0.5 bg-war-gold mx-auto mt-5 opacity-50" />
      </div>

      {/* Player info */}
      <div className="flex gap-4 mb-10 w-full max-w-md">
        <input
          type="text"
          placeholder="Your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="flex-1 px-4 py-3 bg-war-navy border border-parchment-dark rounded-lg
                     text-parchment placeholder-parchment-dark font-serif text-lg
                     focus:outline-none focus:border-war-gold"
          maxLength={30}
        />
        <input
          type="text"
          placeholder="Period"
          value={classPeriod}
          onChange={(e) => setClassPeriod(e.target.value)}
          className="w-28 px-4 py-3 bg-war-navy border border-parchment-dark rounded-lg
                     text-parchment placeholder-parchment-dark font-serif text-lg
                     focus:outline-none focus:border-war-gold"
          maxLength={10}
        />
      </div>

      {/* Saved game prompt */}
      {savedGame && (
        <div className="w-full max-w-md mb-8 bg-black bg-opacity-40 rounded-lg p-5 border border-war-gold border-opacity-30">
          <p className="text-parchment text-base font-serif mb-2">
            Saved game found: <span className="text-war-gold font-bold">{savedGame.playerName}</span> — Round {savedGame.round}, {savedGame.season}
          </p>
          <div className="flex gap-3 mb-3">
            <button
              onClick={onContinue}
              className="flex-1 py-2.5 bg-war-gold text-war-navy font-serif rounded-lg
                         hover:bg-yellow-500 transition-colors cursor-pointer text-base font-bold"
            >
              Continue Campaign
            </button>
            <button
              onClick={onDeleteSave}
              className="px-4 py-2.5 border border-parchment-dark text-parchment-dark font-serif rounded-lg
                         hover:border-red-400 hover:text-red-400 transition-colors cursor-pointer text-sm"
            >
              Delete
            </button>
          </div>
          <div className="flex gap-3 pt-3 border-t border-parchment-dark border-opacity-30">
            <button
              onClick={handleExport}
              className="flex-1 py-2 border border-war-gold text-war-gold font-serif rounded-lg
                         hover:bg-war-gold hover:text-war-navy transition-colors cursor-pointer text-sm"
            >
              Export Backup
            </button>
            <button
              onClick={handleImport}
              className="flex-1 py-2 border border-parchment-dark text-parchment-dark font-serif rounded-lg
                         hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer text-sm"
            >
              Import Save
            </button>
          </div>
        </div>
      )}

      {/* Import button when no saved game */}
      {!savedGame && onImportSave && (
        <div className="w-full max-w-md mb-8">
          <button
            onClick={handleImport}
            className="w-full py-2.5 border border-parchment-dark text-parchment-dark font-serif rounded-lg
                       hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer text-sm"
          >
            Import Save File
          </button>
        </div>
      )}

      {/* Faction cards */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 w-full max-w-5xl">
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
                flex-1 p-8 rounded-xl border-2 transition-all duration-300
                bg-gradient-to-b ${faction.color}
                ${isSelected ? `${faction.border} ring-2 ring-war-gold scale-105` : 'border-transparent'}
                ${isHovered && !isSelected ? 'scale-102 border-parchment-dark' : ''}
                text-left cursor-pointer
              `}
            >
              <div className="text-5xl mb-3">{faction.icon}</div>
              <h2 className="text-2xl font-serif text-parchment font-bold mb-3">
                {faction.name}
              </h2>
              <p className="text-base text-parchment opacity-80 mb-4 leading-relaxed">
                {faction.description}
              </p>
              <div className="text-sm text-parchment opacity-70 space-y-1.5">
                <p><span className="text-war-gold font-bold">Leaders:</span> {faction.leaders}</p>
                <p><span className="text-war-gold font-bold">Bonus:</span> {faction.bonus}</p>
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
          px-14 py-4 rounded-lg font-serif text-xl tracking-wider font-bold
          transition-all duration-300
          ${selectedFaction && playerName.trim()
            ? 'bg-war-gold text-war-navy hover:bg-yellow-500 cursor-pointer'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
        `}
      >
        March to War
      </button>

      {/* Historical context blurb */}
      <p className="text-sm text-parchment-dark mt-10 max-w-lg text-center italic opacity-60">
        June 18, 1812 — President James Madison signs the declaration of war against Great Britain.
        The young republic faces the world's greatest naval power. Will nationalism rise or fall?
      </p>
    </div>
  );
}
