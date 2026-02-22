import React, { useState } from 'react';
import ScoreSubmission from './ScoreSubmission';
import Leaderboard from './Leaderboard';

const factionLabels = {
  us: 'United States',
  british: 'British/Canada',
  native: 'Native Coalition',
};

const factionVerdicts = {
  us: {
    high: 'A triumph for the young republic! Like Jackson at New Orleans, your leadership proved that American democracy could stand against the world\'s greatest empire.',
    mid: 'A hard-fought campaign worthy of the Era of Good Feelings. The nation endures — battered but unified.',
    low: 'The war ends in bitter disappointment. Like Hull\'s surrender at Detroit, the republic\'s promise remains unfulfilled.',
  },
  british: {
    high: 'Britannia rules! You have defended Canada and projected power across North America, just as Wellington conquered on the continent.',
    mid: 'The Empire holds. Canada is secure and the American threat contained — a respectable outcome worthy of the Crown.',
    low: 'A sobering campaign. Like Prevost\'s retreat from Plattsburgh, the Empire\'s grip on North America weakens.',
  },
  native: {
    high: 'Tecumseh\'s dream lives! Against impossible odds, you have forged a confederacy that rewrites the tragic history of Native displacement.',
    mid: 'The confederacy endures. Though the future remains uncertain, your people have fought with honor and skill.',
    low: 'History repeats its cruelest chapter. Without allies and outnumbered, the confederacy fractures — but the courage of your warriors will be remembered.',
  },
};

function getVerdict(faction, score) {
  const verdicts = factionVerdicts[faction] || factionVerdicts.us;
  if (score >= 80) return verdicts.high;
  if (score >= 40) return verdicts.mid;
  return verdicts.low;
}

export default function GameReport({
  playerName,
  classPeriod,
  playerFaction,
  finalScore,
  scores,
  nationalismMeter,
  objectiveBonus,
  factionMultiplier,
  nativeResistance,
  navalDominance,
  playerObjectives,
  journalEntries,
  knowledgeCheckResults,
  battleStats,
  playerTerritoryCount,
  round,
  onPlayAgain,
}) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const totalChecks = knowledgeCheckResults.total;
  const correctChecks = knowledgeCheckResults.correct;
  const checkPercent = totalChecks > 0 ? Math.round((correctChecks / totalChecks) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center p-2 md:p-4 overflow-y-auto" style={{ zIndex: 1000 }}>
      <div className="bg-war-navy border-2 border-war-gold rounded-xl max-w-2xl w-full my-4 md:my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-war-navy to-gray-900 px-8 py-6 border-b border-war-gold border-opacity-30 text-center">
          <p className="text-war-gold text-sm tracking-widest uppercase font-bold mb-1">After-Action Report</p>
          <h2 className="text-3xl font-serif text-parchment">The War Is Over</h2>
          <p className="text-parchment-dark text-base mt-1">Treaty of Ghent — December 24, 1814</p>
        </div>

        <div className="px-4 md:px-8 py-4 md:py-6 space-y-5 md:space-y-6">
          {/* Player info */}
          <div className="flex flex-wrap justify-between gap-1 text-sm md:text-base text-parchment">
            <div>
              <span className="text-parchment-dark">Commander:</span> {playerName}
            </div>
            <div>
              <span className="text-parchment-dark">Period:</span> {classPeriod}
            </div>
            <div>
              <span className="text-parchment-dark">Faction:</span> {factionLabels[playerFaction]}
            </div>
          </div>

          {/* Final Score */}
          <div className="bg-black bg-opacity-30 rounded-lg p-5 text-center">
            <p className="text-parchment-dark text-sm uppercase tracking-wider mb-1">Final Score</p>
            <p className="text-war-gold text-5xl font-bold font-serif">{finalScore}</p>
            <div className="flex justify-center gap-6 mt-3 text-sm text-parchment-dark">
              <span>Territory: {scores[playerFaction] || 0}</span>
              {playerFaction === 'us' && (
                <span>Nationalism: x{(1 + nationalismMeter / 100).toFixed(2)}</span>
              )}
              <span>Objectives: +{objectiveBonus}</span>
            </div>
            <p className="text-parchment text-base mt-3 font-serif italic leading-relaxed">
              {getVerdict(playerFaction, finalScore)}
            </p>
          </div>

          {/* Objectives */}
          <div>
            <h3 className="text-war-gold font-serif text-lg mb-3">Objectives</h3>
            <div className="grid grid-cols-1 gap-2">
              {playerObjectives.map((obj) => (
                <div
                  key={obj.id}
                  className={`px-4 py-2 rounded-lg ${
                    obj.completed ? 'bg-green-900 bg-opacity-20' : 'bg-black bg-opacity-20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{obj.completed ? '\u2705' : '\u274C'}</span>
                      <span className={`text-sm ${obj.completed ? 'text-green-300' : 'text-parchment-dark'}`}>
                        {obj.title}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${obj.completed ? 'text-war-gold' : 'text-parchment-dark'}`}>
                      {obj.completed ? `+${obj.points}` : '0'} pts
                    </span>
                  </div>
                  {obj.historicalContext && (
                    <p className="text-parchment-dark text-xs mt-1 pl-7 italic">{obj.historicalContext}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Battle Stats */}
          <div>
            <h3 className="text-war-gold font-serif text-lg mb-3">Battle Statistics</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-black bg-opacity-30 rounded-lg p-3">
                <p className="text-2xl font-bold text-parchment">{battleStats.fought}</p>
                <p className="text-sm text-parchment-dark">Battles Fought</p>
              </div>
              <div className="bg-black bg-opacity-30 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-300">{battleStats.won}</p>
                <p className="text-sm text-parchment-dark">Victories</p>
              </div>
              <div className="bg-black bg-opacity-30 rounded-lg p-3">
                <p className="text-2xl font-bold text-red-300">{battleStats.lost}</p>
                <p className="text-sm text-parchment-dark">Defeats</p>
              </div>
            </div>
          </div>

          {/* Knowledge Check Results */}
          {totalChecks > 0 && (
            <div>
              <h3 className="text-war-gold font-serif text-lg mb-3">Knowledge Checks</h3>
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-parchment text-base">
                    {correctChecks} of {totalChecks} correct ({checkPercent}%)
                  </span>
                  <span className="text-war-gold font-bold text-base">
                    {checkPercent >= 80 ? 'Excellent!' : checkPercent >= 60 ? 'Good work' : 'Keep studying'}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${checkPercent}%`,
                      background: checkPercent >= 80
                        ? 'linear-gradient(to right, #22c55e, #86efac)'
                        : checkPercent >= 60
                        ? 'linear-gradient(to right, #c9a227, #ffd700)'
                        : 'linear-gradient(to right, #ef4444, #f87171)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* War Journal Summary */}
          {journalEntries.length > 0 && (
            <div>
              <h3 className="text-war-gold font-serif text-lg mb-3">War Timeline</h3>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {journalEntries.map((entry, i) => (
                  <div key={i} className="border-l-2 border-parchment-dark border-opacity-20 pl-3">
                    <p className="text-war-gold text-sm font-bold">{entry.season}</p>
                    {entry.items.map((item, j) => (
                      <p key={j} className="text-parchment-dark text-sm">{item}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Score Submission */}
          <ScoreSubmission
            playerName={playerName}
            classPeriod={classPeriod}
            playerFaction={playerFaction}
            finalScore={finalScore}
            scores={scores}
            objectiveBonus={objectiveBonus}
            factionMultiplier={factionMultiplier || 1}
            nationalismMeter={nationalismMeter}
            nativeResistance={nativeResistance}
            navalDominance={navalDominance}
            knowledgeCheckResults={knowledgeCheckResults}
            battleStats={battleStats}
            playerTerritoryCount={playerTerritoryCount}
            roundsPlayed={round}
          />
        </div>

        {/* Actions */}
        <div className="px-4 md:px-8 pb-4 md:pb-6 flex gap-3">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="flex-1 py-4 font-serif text-lg rounded-lg border border-parchment-dark text-parchment
                       hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer"
          >
            Leaderboard
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 py-4 bg-war-gold text-war-navy font-serif text-lg rounded-lg
                       hover:bg-yellow-500 transition-colors cursor-pointer font-bold"
          >
            Play Again
          </button>
        </div>
      </div>

      {showLeaderboard && (
        <Leaderboard
          onClose={() => setShowLeaderboard(false)}
          currentClassPeriod={classPeriod}
        />
      )}
    </div>
  );
}
