import React, { useState } from 'react';
import LeaderboardPreview from './LeaderboardPreview';

export default function NameEntry({
  onNext,
  savedGame,
  onContinue,
  onDeleteSave,
  onExportSave,
  onImportSave,
  fontMode,
  toggleFont,
}) {
  const [playerName, setPlayerName] = useState('');
  const [classPeriod, setClassPeriod] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleContinue = () => {
    if (playerName.trim()) {
      onNext({
        playerName: playerName.trim(),
        classPeriod: classPeriod.trim() || 'Unassigned',
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && playerName.trim()) {
      handleContinue();
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      onImportSave(text);
      setToastMessage('Save imported!');
      setTimeout(() => setToastMessage(''), 3000);
    } catch {
      setToastMessage('Invalid save file.');
      setTimeout(() => setToastMessage(''), 3000);
    }
    e.target.value = '';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display text-war-gold tracking-wide mb-3">
            War of 1812
          </h1>
          <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">
            Rise of the Nation
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-war-navy border border-war-gold/20 rounded-lg p-6 md:p-8 shadow-modal animate-fadein">
          <h2 className="text-xl font-display text-war-gold/80 mb-6 tracking-wide border-b border-war-gold/15 pb-3">
            Identify Yourself, Commander
          </h2>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-parchment/60 text-xs uppercase tracking-wider mb-1.5 font-body font-bold">
              Commander&apos;s Name <span className="text-war-red/60">*</span>
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 30))}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name"
              className="w-full bg-war-ink/50 border border-parchment-dark/15 rounded px-4 py-3 text-parchment/90
                         placeholder-parchment-dark/30 font-body focus:border-war-gold/40 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {/* Class Period Input */}
          <div className="mb-6">
            <label className="block text-parchment/60 text-xs uppercase tracking-wider mb-1.5 font-body font-bold">
              Class Period <span className="text-parchment-dark/30">(optional)</span>
            </label>
            <input
              type="text"
              value={classPeriod}
              onChange={(e) => setClassPeriod(e.target.value.slice(0, 10))}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Period 3"
              className="w-full bg-war-ink/50 border border-parchment-dark/15 rounded px-4 py-3 text-parchment/90
                         placeholder-parchment-dark/30 font-body focus:border-war-gold/40 focus:outline-none transition-colors"
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!playerName.trim()}
            className={`w-full py-4 font-display text-lg rounded-lg font-bold tracking-wider transition-colors
                       shadow-copper ${playerName.trim()
                         ? 'bg-war-gold text-war-ink hover:bg-war-brass cursor-pointer'
                         : 'bg-parchment-dark/20 text-parchment-dark/40 cursor-not-allowed'}`}
          >
            Continue
          </button>
        </div>

        {/* Saved Game Card */}
        {savedGame && (
          <div className="mt-6 bg-war-navy border border-war-gold/20 rounded-lg p-5 shadow-modal animate-fadein">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-war-gold/80 font-display text-sm tracking-wide">Saved Campaign</h3>
              <span className="text-parchment-dark/40 text-xs font-body">{savedGame.timestamp ? new Date(savedGame.timestamp).toLocaleDateString() : ''}</span>
            </div>
            <p className="text-parchment/70 text-sm font-body mb-3">
              {savedGame.playerName} &mdash; {savedGame.faction === 'us' ? 'United States' : savedGame.faction === 'british' ? 'British/Canada' : 'Native Coalition'} &mdash; Round {savedGame.round}, {savedGame.season}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onContinue}
                className="px-4 py-2 bg-war-gold text-war-ink font-display text-xs rounded font-bold
                           hover:bg-war-brass transition-colors cursor-pointer tracking-wide"
              >
                Continue Campaign
              </button>
              {confirmingDelete ? (
                <div className="flex gap-1">
                  <button onClick={() => { onDeleteSave(); setConfirmingDelete(false); }}
                    className="px-3 py-2 bg-war-red/80 text-parchment font-display text-xs rounded font-bold
                               hover:bg-war-red transition-colors cursor-pointer tracking-wide">
                    Confirm Delete
                  </button>
                  <button onClick={() => setConfirmingDelete(false)}
                    className="px-3 py-2 border border-parchment-dark/20 text-parchment-dark/60 font-display text-xs rounded
                               hover:border-war-gold/40 transition-colors cursor-pointer">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmingDelete(true)}
                  className="px-3 py-2 border border-parchment-dark/20 text-parchment-dark/60 font-display text-xs rounded
                             hover:border-war-red/40 hover:text-war-red/80 transition-colors cursor-pointer tracking-wide">
                  Delete
                </button>
              )}
              <button onClick={onExportSave}
                className="px-3 py-2 border border-parchment-dark/20 text-parchment-dark/60 font-display text-xs rounded
                           hover:border-war-gold/40 hover:text-parchment transition-colors cursor-pointer tracking-wide">
                Export
              </button>
              <label className="px-3 py-2 border border-parchment-dark/20 text-parchment-dark/60 font-display text-xs rounded
                           hover:border-war-gold/40 hover:text-parchment transition-colors cursor-pointer tracking-wide">
                Import
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMessage && (
          <div className="mt-4 text-center text-parchment/70 text-sm font-body animate-fadein">{toastMessage}</div>
        )}

        {/* Leaderboard Preview */}
        <div className="mt-6">
          <LeaderboardPreview onViewFull={() => setShowLeaderboard(true)} />
        </div>

        {/* Font Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleFont}
            className="text-parchment-dark/40 text-xs font-body hover:text-parchment/60 transition-colors cursor-pointer"
          >
            {fontMode === 'dyslexic' ? 'Switch to Standard Font' : 'Switch to OpenDyslexic Font'}
          </button>
        </div>

        {showLeaderboard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
               onClick={() => setShowLeaderboard(false)}>
            <div className="bg-war-navy border border-war-gold/30 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-modal"
                 onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-war-gold font-display text-xl tracking-wide">Leaderboard</h2>
                <button onClick={() => setShowLeaderboard(false)}
                  className="text-parchment-dark/40 hover:text-parchment/70 transition-colors cursor-pointer text-xl">&times;</button>
              </div>
              <LeaderboardPreview fullMode />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
