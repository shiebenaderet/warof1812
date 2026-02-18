import React from 'react';
import Map from './Map';
import Scoreboard from './Scoreboard';
import TerritoryInfo from './TerritoryInfo';
import EventCard from './EventCard';
import BattleModal from './BattleModal';
import { getAliveLeaders } from '../data/leaders';

const phaseInstructions = {
  event: 'An event card has been drawn. Review the historical event and its effects.',
  allocate: 'Place your reinforcement troops on territories you control. Click your territories to add troops.',
  battle: 'Select one of your territories, then click an adjacent enemy territory to launch an attack.',
  score: 'Advance to end your turn. Opponents will then take their actions.',
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
  showBattleModal,
  currentEvent,
  showEventCard,
  gameOver,
  finalScore,
  leaderStates,
  aiLog,
  onTerritoryClick,
  onAdvancePhase,
  onDismissEvent,
  onDismissBattle,
}) {
  const aliveLeaders = getAliveLeaders(playerFaction, leaderStates);

  return (
    <div className="min-h-screen bg-war-navy flex flex-col">
      {/* Top bar */}
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
          {/* Phase indicator dots */}
          <div className="flex gap-1">
            {['event', 'allocate', 'battle', 'score'].map((p) => (
              <div
                key={p}
                className={`w-2 h-2 rounded-full ${
                  p === currentPhase ? 'bg-war-gold' : 'bg-parchment-dark bg-opacity-30'
                }`}
                title={p}
              />
            ))}
          </div>
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
        <div className="flex-1 p-4 flex flex-col">
          {/* Message banner */}
          {message && (
            <div className="bg-black bg-opacity-50 border border-war-gold border-opacity-30 rounded-lg px-4 py-2 mb-3">
              <p className="text-parchment font-serif text-sm">{message}</p>
            </div>
          )}

          {/* AI action log */}
          {aiLog.length > 0 && (
            <div className="bg-black bg-opacity-40 border border-british-red border-opacity-30 rounded-lg px-4 py-2 mb-3">
              <p className="text-xs text-parchment-dark uppercase tracking-wider mb-1">Opponent Actions</p>
              {aiLog.map((entry, i) => (
                <p key={i} className="text-parchment text-xs">{entry}</p>
              ))}
            </div>
          )}

          {/* SVG Map */}
          <div className="flex-1 bg-black bg-opacity-20 rounded-lg border border-parchment-dark border-opacity-10 overflow-hidden">
            <Map
              territoryOwners={territoryOwners}
              selectedTerritory={selectedTerritory}
              onTerritoryClick={onTerritoryClick}
              troops={troops}
            />
          </div>

          {/* Phase instruction + advance button */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-parchment-dark italic font-serif">
              {phaseInstructions[currentPhase]}
            </p>
            {!gameOver && (
              <button
                onClick={onAdvancePhase}
                disabled={showEventCard || showBattleModal}
                className={`px-6 py-2 font-serif text-sm rounded transition-colors ${
                  showEventCard || showBattleModal
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-war-gold text-war-navy hover:bg-yellow-500 cursor-pointer'
                }`}
              >
                {currentPhase === 'score' && round >= totalRounds
                  ? 'End War'
                  : currentPhase === 'score'
                  ? 'End Turn'
                  : 'Next Phase'}
              </button>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="w-72 p-4 space-y-4 border-l border-parchment-dark border-opacity-10 overflow-y-auto">
          <Scoreboard
            scores={scores}
            playerFaction={playerFaction}
            nationalismMeter={nationalismMeter}
            playerTerritoryCount={playerTerritoryCount}
          />

          {/* Leaders panel */}
          <div className="bg-black bg-opacity-40 rounded-lg p-4">
            <h3 className="text-war-gold font-serif text-sm border-b border-war-gold border-opacity-30 pb-2 mb-2">
              Your Leaders
            </h3>
            {aliveLeaders.length > 0 ? (
              aliveLeaders.map((leader) => (
                <div key={leader.id} className="mb-2 last:mb-0">
                  <p className="text-parchment text-xs font-bold">{leader.name}</p>
                  <p className="text-parchment-dark text-xs italic">{leader.ability}</p>
                </div>
              ))
            ) : (
              <p className="text-parchment-dark text-xs italic">No leaders in play.</p>
            )}
          </div>

          <TerritoryInfo
            territoryId={selectedTerritory}
            territoryOwners={territoryOwners}
            troops={troops}
          />
        </aside>
      </div>

      {/* Event Card Modal */}
      {showEventCard && (
        <EventCard event={currentEvent} onDismiss={onDismissEvent} />
      )}

      {/* Battle Modal */}
      {showBattleModal && (
        <BattleModal battle={battleResult} onClose={onDismissBattle} />
      )}

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
              <p className="pt-2 text-parchment">
                {finalScore >= 100
                  ? 'A decisive victory! The nation rises.'
                  : finalScore >= 60
                  ? 'A hard-fought campaign. History will remember.'
                  : 'The war ends in uncertainty. Was it worth the cost?'}
              </p>
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
