import React, { useState } from 'react';
import { submitScore, supabase } from '../lib/supabase';

const factionLabels = {
  us: 'United States',
  british: 'British/Canada',
  native: 'Native Coalition',
};

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
  onSubmitted,
}) {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
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
    });

    if (error) {
      setStatus('error');
      setErrorMsg(typeof error === 'string' ? error : error.message || 'Submission failed');
    } else {
      setStatus('success');
      if (onSubmitted) onSubmitted();
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-900 bg-opacity-30 border border-green-500 border-opacity-40 rounded-lg p-4 text-center">
        <p className="text-green-300 font-serif text-base font-bold">Score submitted to the leaderboard!</p>
        <p className="text-parchment-dark text-sm mt-1">
          {playerName} — {factionLabels[playerFaction]} — {finalScore} pts
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center">
      {status === 'error' && (
        <p className="text-red-300 text-sm mb-2">{errorMsg}</p>
      )}
      <button
        onClick={handleSubmit}
        disabled={status === 'submitting'}
        className={`w-full py-3 font-serif text-base rounded-lg font-bold transition-colors ${
          status === 'submitting'
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-war-green text-parchment hover:brightness-125 cursor-pointer border border-green-800'
        }`}
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Score to Leaderboard'}
      </button>
    </div>
  );
}
