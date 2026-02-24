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
    <div className="fixed inset-0 flex items-center justify-center p-2 md:p-4 overflow-y-auto" style={{ zIndex: 1000, background: 'radial-gradient(ellipse at center, rgba(20,30,48,0.95) 0%, rgba(10,10,8,0.98) 100%)' }}>
      <div className="bg-war-navy border border-war-gold/30 rounded-lg max-w-2xl w-full my-4 md:my-8 shadow-modal animate-fadein">
        {/* Header */}
        <div className="px-8 py-6 border-b border-war-gold/20 text-center" style={{
          background: 'linear-gradient(135deg, rgba(139,26,26,0.25) 0%, rgba(20,30,48,0.95) 50%, rgba(139,26,26,0.15) 100%)',
        }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
            <p className="text-war-copper text-xs tracking-[0.2em] uppercase font-body font-bold">After-Action Report</p>
            <div className="w-1.5 h-1.5 rounded-full bg-war-gold/60" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display text-parchment tracking-wide">The War Is Over</h2>
          <p className="text-parchment-dark/50 text-sm font-body mt-1">Treaty of Ghent &mdash; December 24, 1814</p>
        </div>

        <div className="px-4 md:px-8 py-4 md:py-6 space-y-5 md:space-y-6">
          {/* Player info */}
          <div className="flex flex-wrap justify-between gap-1 text-sm text-parchment/80 font-body">
            <div>
              <span className="text-parchment-dark/50">Commander:</span> {playerName}
            </div>
            <div>
              <span className="text-parchment-dark/50">Period:</span> {classPeriod}
            </div>
            <div>
              <span className="text-parchment-dark/50">Faction:</span> {factionLabels[playerFaction]}
            </div>
          </div>

          {/* Final Score */}
          <div className="bg-black/20 rounded-lg p-5 text-center border border-war-gold/10">
            <p className="text-parchment-dark/50 text-xs uppercase tracking-wider mb-1 font-body font-bold">Final Score</p>
            <p className="text-war-gold text-5xl font-bold font-display">{finalScore}</p>
            <div className="flex justify-center gap-6 mt-3 text-sm text-parchment-dark/50 font-body">
              <span>Territory: {scores[playerFaction] || 0}</span>
              {playerFaction === 'us' && (
                <span>Nationalism: x{(1 + nationalismMeter / 100).toFixed(2)}</span>
              )}
              <span>Objectives: +{objectiveBonus}</span>
            </div>
            <p className="text-parchment/70 text-base mt-3 font-body italic leading-relaxed border-t border-parchment-dark/10 pt-3">
              {getVerdict(playerFaction, finalScore)}
            </p>
          </div>

          {/* Objectives */}
          <div>
            <h3 className="text-war-gold/80 font-display text-base mb-3 tracking-wide">Objectives</h3>
            <div className="grid grid-cols-1 gap-2">
              {playerObjectives.map((obj) => (
                <div
                  key={obj.id}
                  className={`px-4 py-2.5 rounded ${
                    obj.completed ? 'bg-green-900/15 border border-green-500/20' : 'bg-black/15 border border-parchment-dark/8'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{obj.completed ? '\u2705' : '\u274C'}</span>
                      <span className={`text-sm font-body ${obj.completed ? 'text-green-300/90' : 'text-parchment-dark/60'}`}>
                        {obj.title}
                      </span>
                    </div>
                    <span className={`text-sm font-bold font-display ${obj.completed ? 'text-war-gold' : 'text-parchment-dark/40'}`}>
                      {obj.completed ? `+${obj.points}` : '0'} pts
                    </span>
                  </div>
                  {obj.historicalContext && (
                    <p className="text-parchment-dark/40 text-xs mt-1 pl-7 italic font-body">{obj.historicalContext}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Battle Stats */}
          <div>
            <h3 className="text-war-gold/80 font-display text-base mb-3 tracking-wide">Battle Statistics</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-black/20 rounded-lg p-3 border border-parchment-dark/8">
                <p className="text-2xl font-bold text-parchment font-display">{battleStats.fought}</p>
                <p className="text-xs text-parchment-dark/50 font-body">Battles Fought</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-green-500/15">
                <p className="text-2xl font-bold text-green-400 font-display">{battleStats.won}</p>
                <p className="text-xs text-parchment-dark/50 font-body">Victories</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-red-500/15">
                <p className="text-2xl font-bold text-red-400 font-display">{battleStats.lost}</p>
                <p className="text-xs text-parchment-dark/50 font-body">Defeats</p>
              </div>
            </div>
          </div>

          {/* Knowledge Check Results */}
          {totalChecks > 0 && (
            <div>
              <h3 className="text-war-gold/80 font-display text-base mb-3 tracking-wide">Knowledge Checks</h3>
              <div className="bg-black/20 rounded-lg p-4 border border-parchment-dark/8">
                <div className="flex items-center justify-between mb-2 font-body">
                  <span className="text-parchment/80 text-sm">
                    {correctChecks} of {totalChecks} correct ({checkPercent}%)
                  </span>
                  <span className="text-war-gold font-bold text-sm">
                    {checkPercent >= 80 ? 'Excellent!' : checkPercent >= 60 ? 'Good work' : 'Keep studying'}
                  </span>
                </div>
                <div className="w-full bg-war-ink rounded-full h-2.5 border border-parchment-dark/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${checkPercent}%`,
                      background: checkPercent >= 80
                        ? 'linear-gradient(to right, #166534, #22c55e)'
                        : checkPercent >= 60
                        ? 'linear-gradient(to right, #854d0e, #c9a227)'
                        : 'linear-gradient(to right, #7f1d1d, #ef4444)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* War Journal Summary */}
          {journalEntries.length > 0 && (
            <div>
              <h3 className="text-war-gold/80 font-display text-base mb-3 tracking-wide">War Timeline</h3>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {journalEntries.map((entry, i) => (
                  <div key={i} className="border-l-2 border-war-copper/20 pl-3">
                    <p className="text-war-gold/70 text-xs font-bold font-body">{entry.season}</p>
                    {entry.items.map((item, j) => (
                      <p key={j} className="text-parchment-dark/60 text-sm font-body">{item}</p>
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
            className="flex-1 py-3.5 font-display text-sm rounded border border-parchment-dark/20 text-parchment/70
                       hover:border-war-gold/40 hover:text-parchment transition-colors cursor-pointer tracking-wide"
          >
            Leaderboard
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3.5 bg-war-gold text-war-ink font-display text-sm rounded
                       hover:bg-war-brass transition-colors cursor-pointer font-bold tracking-wide shadow-copper"
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
