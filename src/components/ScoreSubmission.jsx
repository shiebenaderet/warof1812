import React, { useState } from 'react';
import { submitScore, supabase, validateClassCode, linkSessionToClass } from '../lib/supabase';

const factionLabels = {
  us: 'United States',
  british: 'British/Canada',
  native: 'Native Coalition',
};

function getGameFingerprint(playerName, playerFaction, finalScore, roundsPlayed, battleStats) {
  return `${playerName}|${playerFaction}|${finalScore}|${roundsPlayed}|${battleStats.won}|${battleStats.fought}`;
}

function wasAlreadySubmitted(fingerprint) {
  try {
    const submitted = JSON.parse(localStorage.getItem('war1812_submitted_scores') || '[]');
    return submitted.includes(fingerprint);
  } catch { return false; }
}

function markAsSubmitted(fingerprint) {
  try {
    const submitted = JSON.parse(localStorage.getItem('war1812_submitted_scores') || '[]');
    submitted.push(fingerprint);
    // Keep only last 20 to avoid unbounded growth
    if (submitted.length > 20) submitted.shift();
    localStorage.setItem('war1812_submitted_scores', JSON.stringify(submitted));
  } catch { /* ignore */ }
}

export default function ScoreSubmission({
  playerName,
  classPeriod,
  playerFaction,
  finalScore,
  scores,
  objectiveBonus,
  factionMultiplier,
  nationalismMeter,
  nativeResistance,
  navalDominance,
  knowledgeCheckResults,
  battleStats,
  playerTerritoryCount,
  roundsPlayed,
  gameOverReason,
  difficulty,
  sessionId,
  classId,
  onSubmitted,
}) {
  const fingerprint = getGameFingerprint(playerName, playerFaction, finalScore, roundsPlayed, battleStats);
  const alreadySubmitted = wasAlreadySubmitted(fingerprint);
  const [status, setStatus] = useState(alreadySubmitted ? 'success' : 'idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [lateClassCode, setLateClassCode] = useState('');
  const [lateClassData, setLateClassData] = useState(null);
  const [lateClassError, setLateClassError] = useState('');
  const [lateValidating, setLateValidating] = useState(false);

  const handleLateValidate = async (code) => {
    if (!code.trim()) { setLateClassData(null); setLateClassError(''); return; }
    setLateValidating(true);
    setLateClassError('');
    const { data, error } = await validateClassCode(code);
    setLateValidating(false);
    if (error) { setLateClassError('Could not validate code.'); }
    else if (!data) { setLateClassError('Code not found'); setLateClassData(null); }
    else { setLateClassData(data); setLateClassError(''); }
  };

  if (!supabase) {
    return null; // Don't show if Supabase isn't configured
  }

  const handleSubmit = async () => {
    setStatus('submitting');
    setErrorMsg('');

    const effectiveClassId = classId || (lateClassData ? lateClassData.id : null);

    const { error } = await submitScore({
      playerName,
      classPeriod,
      faction: playerFaction,
      finalScore,
      baseScore: scores[playerFaction] || 0,
      objectiveBonus,
      factionMultiplier,
      nationalismMeter: nationalismMeter || 0,
      nativeResistance: nativeResistance || 0,
      navalDominance: navalDominance || 0,
      knowledgeCorrect: knowledgeCheckResults.correct,
      knowledgeTotal: knowledgeCheckResults.total,
      battlesWon: battleStats.won,
      battlesFought: battleStats.fought,
      territoriesHeld: playerTerritoryCount,
      roundsPlayed,
      gameOverReason,
      difficulty,
      sessionId,
      classId: effectiveClassId,
    });

    if (error) {
      setStatus('error');
      setErrorMsg(typeof error === 'string' ? error : error.message || 'Submission failed');
    } else {
      setStatus('success');
      markAsSubmitted(fingerprint);
      // Retroactively link quiz gate data if late join
      if (!classId && effectiveClassId && sessionId) {
        linkSessionToClass({ sessionId, classId: effectiveClassId }).catch(() => {});
      }
      if (onSubmitted) onSubmitted();
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-900/15 border border-green-500/25 rounded-lg p-4 text-center">
        <p className="text-green-400 font-display text-sm font-bold tracking-wide">
          {alreadySubmitted ? 'Score already on the leaderboard' : 'Score submitted to the leaderboard!'}
        </p>
        <p className="text-parchment-dark/50 text-xs mt-1 font-body">
          {playerName} &mdash; {factionLabels[playerFaction]} &mdash; {finalScore} pts
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/20 rounded-lg p-4 text-center border border-parchment-dark/8">
      {status === 'error' && (
        <p className="text-red-400 text-sm mb-2 font-body">{errorMsg}</p>
      )}
      {/* Late join: show class code field if student has no class */}
      {!classId && (
        <div className="mb-3 text-left">
          <p className="text-parchment-dark/50 text-xs font-body mb-1.5">
            Have a class code from your teacher?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={lateClassCode}
              onChange={(e) => {
                const val = e.target.value.toUpperCase().slice(0, 6);
                setLateClassCode(val);
                if (val.length === 6) handleLateValidate(val);
                else { setLateClassData(null); setLateClassError(''); }
              }}
              placeholder="ABC123"
              maxLength={6}
              className="flex-1 bg-war-ink/50 border border-parchment-dark/15 rounded px-3 py-2 text-parchment/90
                         placeholder-parchment-dark/30 font-body font-mono tracking-widest text-center uppercase text-sm
                         focus:border-war-gold/40 focus:outline-none transition-colors"
            />
          </div>
          {lateValidating && <p className="text-parchment-dark/40 text-xs mt-1 font-body italic">Checking...</p>}
          {lateClassError && <p className="text-red-400 text-xs mt-1 font-body">{lateClassError}</p>}
          {lateClassData && <p className="text-green-400 text-xs mt-1 font-body">Will submit to: {lateClassData.name}</p>}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={status === 'submitting'}
        className={`w-full py-3 font-display text-sm rounded font-bold tracking-wide transition-colors ${
          status === 'submitting'
            ? 'bg-war-ink/50 text-parchment-dark/40 cursor-not-allowed'
            : 'bg-war-green text-parchment hover:brightness-125 cursor-pointer border border-green-800/50 shadow-copper'
        }`}
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Score to Leaderboard'}
      </button>
    </div>
  );
}
