import React from 'react';
import Map from './Map';
import Scoreboard from './Scoreboard';
import TerritoryInfo from './TerritoryInfo';

const phaseInstructions = {
  event: 'An event card has been drawn. Review the historical event and its effects.',
  allocate: 'Place your reinforcement troops on territories you control. Click your territories to add troops.',
  battle: 'Select one of your territories, then click an adjacent enemy territory to launch an attack.',
  score: 'Points have been tallied for this round. Advance to begin the next round.',
};

export default function GameBoard({
  round,
  totalRounds,
  currentPhase,
  currentPhaseLabel,
  seasonYear,
  territoryOwners,
  troops,
  selectedTerritory,
  scores,
  nationalismMeter,
  reinforcementsRemaining,
  playerFaction,
  playerTerritoryCount,
  message,
  battleResult,
  gameOver,
  finalScore,
  onTerritoryClick,
  onAdvancePhase,
}) {
  return (
    <div className="min-h-screen bg-war-navy flex flex-col">
      {/* Top bar — turn info */}
      <header className="bg-black bg-opacity-50 px-4 py-3 flex items-center justify-between border-b border-war-gold border-opacity-20">
        <div className="flex items-center gap-6">
          <h1 className="text-war-gold font-serif text-xl tracking-wide">War of 1812</h1>
          <div className="text-parchment text-sm font-serif">
            <span className="text-parchment-dark">Round:</span> {round}/{totalRounds}
          </div>
          <div className="text-parchment text-sm font-serif">
            <span className="text-parchment-dark">Season:</span> {seasonYear}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-serif">
            <span className="text-war-gold">{currentPhaseLabel}</span>
          </div>
          {currentPhase === 'allocate' && (
            <span className="text-sm text-parchment">
              Reinforcements: <span className="text-war-gold font-bold">{reinforcementsRemaining}</span>
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Map area */}
        <div className="flex-1 p-4">
          {/* Message banner */}
          {message && (
            <div className="bg-black bg-opacity-50 border border-war-gold border-opacity-30 rounded-lg px-4 py-2 mb-3">
              <p className="text-parchment font-serif text-sm">{message}</p>
            </div>
          )}

          {/* Battle result display */}
          {battleResult && (
            <div className="bg-black bg-opacity-60 border border-war-red rounded-lg px-4 py-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-parchment font-serif text-sm font-bold">
                    {battleResult.conquered ? 'Victory!' : 'Battle Result'}
                  </p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs text-parchment">
                      Your dice: [{battleResult.attackRolls.join(', ')}]
                    </span>
                    <span className="text-xs text-parchment">
                      Defense dice: [{battleResult.defendRolls.join(', ')}]
                    </span>
                  </div>
                  <p className="text-xs text-parchment-dark mt-1">
                    You lost {battleResult.attackerLosses} | Defender lost {battleResult.defenderLosses}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SVG Map */}
          <div className="bg-black bg-opacity-20 rounded-lg border border-parchment-dark border-opacity-10 overflow-hidden">
            <Map
              territoryOwners={territoryOwners}
              selectedTerritory={selectedTerritory}
              onTerritoryClick={onTerritoryClick}
              troops={troops}
            />
          </div>

          {/* Phase instruction */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-parchment-dark italic font-serif">
              {phaseInstructions[currentPhase]}
            </p>
            {!gameOver && (
              <button
                onClick={onAdvancePhase}
                className="px-6 py-2 bg-war-gold text-war-navy font-serif text-sm rounded
                           hover:bg-yellow-500 transition-colors cursor-pointer"
              >
                {currentPhase === 'score' && round >= totalRounds
                  ? 'End War'
                  : currentPhase === 'score'
                  ? 'Next Round'
                  : 'Next Phase'}
              </button>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="w-72 p-4 space-y-4 border-l border-parchment-dark border-opacity-10">
          <Scoreboard
            scores={scores}
            playerFaction={playerFaction}
            nationalismMeter={nationalismMeter}
            playerTerritoryCount={playerTerritoryCount}
          />
          <TerritoryInfo
            territoryId={selectedTerritory}
            territoryOwners={territoryOwners}
            troops={troops}
          />
        </aside>
      </div>

      {/* Game over overlay */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-war-navy border-2 border-war-gold rounded-xl p-8 max-w-md text-center">
            <h2 className="text-3xl font-serif text-war-gold mb-4">The War Is Over</h2>
            <p className="text-parchment font-serif mb-2">Treaty of Ghent — December 24, 1814</p>
            <div className="text-war-gold text-4xl font-bold my-4">{finalScore} pts</div>
            <div className="text-sm text-parchment-dark space-y-1 mb-6">
              <p>Territory score: {scores[playerFaction] || 0}</p>
              {playerFaction === 'us' && (
                <p>Nationalism multiplier: x{(1 + nationalismMeter / 100).toFixed(2)}</p>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-war-gold text-war-navy font-serif rounded-lg
                         hover:bg-yellow-500 transition-colors cursor-pointer"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
