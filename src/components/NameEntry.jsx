import React, { useState, useEffect } from 'react';
import LeaderboardPreview from './LeaderboardPreview';
import { validateClassCode } from '../lib/firebase';
import { CURRENT_VERSION } from '../data/changelog';

export default function NameEntry({
  onNext,
  classParam,
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
  const [classCode, setClassCode] = useState(classParam || '');
  const [classData, setClassData] = useState(null); // { id, name, code } when validated
  const [classError, setClassError] = useState('');
  const [validatingCode, setValidatingCode] = useState(false);
  const [useClassCode, setUseClassCode] = useState(true);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleValidateCode = async (code) => {
    if (!code.trim()) {
      setClassData(null);
      setClassError('');
      return;
    }
    setValidatingCode(true);
    setClassError('');
    const { data, error } = await validateClassCode(code);
    setValidatingCode(false);
    if (error) {
      setClassError('Could not validate code. Try again.');
    } else if (!data) {
      setClassError('Code not found — check with your teacher');
      setClassData(null);
    } else {
      setClassData(data);
      setClassError('');
    }
  };

  // Auto-validate classParam on mount
  useEffect(() => {
    if (classParam) {
      handleValidateCode(classParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    if (!playerName.trim()) return;
    if (useClassCode && classData) {
      onNext({
        playerName: playerName.trim(),
        classPeriod: classData.name,
        classId: classData.id,
      });
    } else {
      onNext({
        playerName: playerName.trim(),
        classPeriod: classPeriod.trim() || 'Unassigned',
        classId: null,
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
    <div className="min-h-screen flex items-center justify-center p-3 md:p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-3xl md:text-5xl font-display text-war-gold tracking-wide mb-1">
            War of 1812
          </h1>
          <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">
            Rise of the Nation
          </p>
        </div>

        {/* Two-column layout on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
          {/* Left column: Form + Saved Game */}
          <div className="md:col-span-3">
            {/* Main Card */}
            <div className="bg-war-navy border border-war-gold/20 rounded-lg p-5 md:p-6 shadow-modal animate-fadein">
              <h2 className="text-lg font-display text-war-gold/80 mb-4 tracking-wide border-b border-war-gold/15 pb-2">
                Identify Yourself, Commander
              </h2>

              {/* Name Input */}
              <div className="mb-3">
                <label className="block text-parchment/60 text-xs uppercase tracking-wider mb-1 font-body font-bold">
                  Commander&apos;s Name <span className="text-war-red/60">*</span>
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.slice(0, 30))}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your name"
                  className="w-full bg-war-ink/50 border border-parchment-dark/15 rounded px-4 py-2.5 text-parchment/90
                             placeholder-parchment-dark/30 font-body focus:border-war-gold/40 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              {/* Class Code / Period Input */}
              <div className="mb-4">
                {useClassCode ? (
                  <>
                    <label className="block text-parchment/60 text-xs uppercase tracking-wider mb-1 font-body font-bold">
                      Class Code <span className="text-parchment-dark/30">(from your teacher)</span>
                    </label>
                    <input
                      type="text"
                      value={classCode}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().slice(0, 6);
                        setClassCode(val);
                        if (val.length === 6) handleValidateCode(val);
                        else { setClassData(null); setClassError(''); }
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g., ABC123"
                      maxLength={6}
                      className="w-full bg-war-ink/50 border border-parchment-dark/15 rounded px-4 py-2.5 text-parchment/90
                                 placeholder-parchment-dark/30 font-body font-mono tracking-widest text-center uppercase
                                 focus:border-war-gold/40 focus:outline-none transition-colors"
                    />
                    {validatingCode && (
                      <p className="text-parchment-dark/40 text-xs mt-1 font-body italic">Checking code...</p>
                    )}
                    {classError && (
                      <p className="text-red-400 text-xs mt-1 font-body">{classError}</p>
                    )}
                    {classData && (
                      <p className="text-green-400 text-xs mt-1 font-body">
                        Joined: {classData.name}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => { setUseClassCode(false); setClassData(null); setClassError(''); }}
                      className="text-parchment-dark/40 text-xs font-body mt-1.5 hover:text-parchment/60 transition-colors cursor-pointer"
                    >
                      No class code? Enter period instead
                    </button>
                  </>
                ) : (
                  <>
                    <label className="block text-parchment/60 text-xs uppercase tracking-wider mb-1 font-body font-bold">
                      Class Period <span className="text-parchment-dark/30">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={classPeriod}
                      onChange={(e) => setClassPeriod(e.target.value.slice(0, 10))}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g., Period 3"
                      className="w-full bg-war-ink/50 border border-parchment-dark/15 rounded px-4 py-2.5 text-parchment/90
                                 placeholder-parchment-dark/30 font-body focus:border-war-gold/40 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setUseClassCode(true)}
                      className="text-parchment-dark/40 text-xs font-body mt-1.5 hover:text-parchment/60 transition-colors cursor-pointer"
                    >
                      Have a class code? Enter it here
                    </button>
                  </>
                )}
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!playerName.trim() || (useClassCode && classCode.trim() && !classData)}
                className={`w-full py-3 font-display text-base rounded-lg font-bold tracking-wider transition-colors
                           shadow-copper ${playerName.trim() && !(useClassCode && classCode.trim() && !classData)
                             ? 'bg-war-gold text-war-ink hover:bg-war-brass cursor-pointer'
                             : 'bg-parchment-dark/20 text-parchment-dark/40 cursor-not-allowed'}`}
              >
                Continue
              </button>

              {/* Footer row: Font Toggle + Teacher Link */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-parchment-dark/8">
                <button
                  onClick={toggleFont}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-body transition-all cursor-pointer
                    ${fontMode === 'dyslexic'
                      ? 'border-war-gold/40 bg-war-gold/10 text-war-gold'
                      : 'border-parchment-dark/15 text-parchment-dark/50 hover:border-war-gold/40 hover:text-parchment/70'
                    }`}
                >
                  <span className="font-bold text-sm leading-none">Aa</span>
                  {fontMode === 'dyslexic' ? 'OpenDyslexic On' : 'OpenDyslexic'}
                </button>
                <a
                  href="#teacher"
                  className="text-parchment-dark/40 text-xs font-body hover:text-war-gold/70 transition-colors"
                >
                  Teacher Dashboard &rarr;
                </a>
              </div>
            </div>

            {/* Saved Game Card */}
            {savedGame && (
              <div className="mt-4 bg-war-navy border border-war-gold/20 rounded-lg p-4 shadow-modal animate-fadein">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-war-gold/80 font-display text-sm tracking-wide">Saved Campaign</h3>
                  <span className="text-parchment-dark/40 text-xs font-body">{savedGame.timestamp ? new Date(savedGame.timestamp).toLocaleDateString() : ''}</span>
                </div>
                <p className="text-parchment/70 text-sm font-body mb-2">
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
              <div className="mt-3 text-center text-parchment/70 text-sm font-body animate-fadein">{toastMessage}</div>
            )}
          </div>

          {/* Right column: Leaderboard Preview */}
          <div className="md:col-span-2">
            <LeaderboardPreview onViewFull={() => setShowLeaderboard(true)} />
          </div>
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
        <p className="text-center text-parchment-dark/30 text-xs font-body mt-6">v{CURRENT_VERSION}</p>
      </div>
    </div>
  );
}
