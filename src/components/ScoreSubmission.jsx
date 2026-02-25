import React, { useState } from 'react';
import { submitScore, supabase } from '../lib/supabase';

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

  if (!supabase) {
    return null; // Don't show if Supabase isn't configured
  }

  const handleSubmit = async () => {
    setStatus('submitting');
    setErrorMsg('');

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
      classId,
    });

    if (error) {
      setStatus('error');
      setErrorMsg(typeof error === 'string' ? error : error.message || 'Submission failed');
    } else {
      setStatus('success');
      markAsSubmitted(fingerprint);
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
