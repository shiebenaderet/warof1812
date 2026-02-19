import React from 'react';
import Map from './Map';
import Scoreboard from './Scoreboard';
import TerritoryInfo from './TerritoryInfo';
import EventCard from './EventCard';
import BattleModal from './BattleModal';
import KnowledgeCheck from './KnowledgeCheck';
import ObjectivesPanel from './ObjectivesPanel';
import TurnJournal from './TurnJournal';
import GameReport from './GameReport';
import { getAliveLeaders } from '../data/leaders';

const phaseInstructions = {
  event: 'An event card has been drawn. Review the historical event and its effects.',
  allocate: 'Place your reinforcement troops on territories you control. Click your territories to add troops.',
  battle: 'Select one of your territories, then click an adjacent enemy territory to launch an attack.',
  maneuver: 'Move troops between your adjacent territories. Select a source, then click a destination.',
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
  playerObjectives,
  currentKnowledgeCheck,
  showKnowledgeCheck,
  knowledgeCheckResults,
  journalEntries,
  battleStats,
  maneuversRemaining,
  objectiveBonus,
  playerName,
  classPeriod,
  onTerritoryClick,
  onAdvancePhase,
  onDismissEvent,
  onDismissBattle,
  onAnswerKnowledgeCheck,
  onSaveGame,
  onDeleteSave,
}) {
  const aliveLeaders = getAliveLeaders(playerFaction, leaderStates);

  return (
    <div className="min-h-screen bg-war-navy flex flex-col">
      {/* Top bar */}
      <header className="bg-black bg-opacity-50 px-6 py-4 flex items-center justify-between border-b border-war-gold border-opacity-20">
        <div className="flex items-center gap-8">
          <h1 className="text-war-gold font-serif text-2xl tracking-wide">War of 1812</h1>
          <div className="text-parchment text-base font-serif">
            <span className="text-parchment-dark">Round:</span> {round}/{totalRounds}
          </div>
          <div className="text-parchment text-base font-serif">
            <span className="text-parchment-dark">Season:</span> {seasonYear}
          </div>
        </div>
        <div className="flex items-center gap-5">
          {/* Phase indicator dots */}
          <div className="flex gap-1.5">
            {['event', 'allocate', 'battle', 'maneuver', 'score'].map((p) => (
              <div
                key={p}
                className={`w-3 h-3 rounded-full ${
                  p === currentPhase ? 'bg-war-gold' : 'bg-parchment-dark bg-opacity-30'
                }`}
                title={p}
              />
            ))}
          </div>
          <div className="text-base font-serif">
            <span className="text-war-gold font-bold">{currentPhaseLabel}</span>
          </div>
          {currentPhase === 'allocate' && (
            <span className="text-base text-parchment">
              Reinforcements: <span className="text-war-gold font-bold text-lg">{reinforcementsRemaining}</span>
            </span>
          )}
          {currentPhase === 'maneuver' && (
            <span className="text-base text-parchment">
              Moves: <span className="text-war-gold font-bold text-lg">{maneuversRemaining}</span>
            </span>
          )}
          <button
            onClick={onSaveGame}
            className="px-4 py-1.5 text-sm border border-parchment-dark text-parchment-dark rounded
                       hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer"
            title="Save game"
          >
            Save
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Map area */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Message banner */}
          {message && (
            <div className="bg-black bg-opacity-50 border border-war-gold border-opacity-30 rounded-lg px-5 py-3 mb-3">
              <p className="text-parchment font-serif text-base">{message}</p>
            </div>
          )}

          {/* AI action log */}
          {aiLog.length > 0 && (
            <div className="bg-black bg-opacity-40 border border-british-red border-opacity-30 rounded-lg px-5 py-3 mb-3">
              <p className="text-sm text-parchment-dark uppercase tracking-wider mb-1 font-bold">Opponent Actions</p>
              {aiLog.map((entry, i) => (
                <p key={i} className="text-parchment text-sm">{entry}</p>
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
            <p className="text-sm text-parchment-dark italic font-serif">
              {phaseInstructions[currentPhase]}
            </p>
            {!gameOver && (
              <button
                onClick={onAdvancePhase}
                disabled={showEventCard || showBattleModal || showKnowledgeCheck}
                className={`px-8 py-3 font-serif text-base rounded-lg transition-colors ${
                  showEventCard || showBattleModal || showKnowledgeCheck
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-war-gold text-war-navy hover:bg-yellow-500 cursor-pointer font-bold'
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
        <aside className="w-80 p-4 space-y-4 border-l border-parchment-dark border-opacity-10 overflow-y-auto">
          <Scoreboard
            scores={scores}
            playerFaction={playerFaction}
            nationalismMeter={nationalismMeter}
            playerTerritoryCount={playerTerritoryCount}
          />

          {/* Leaders panel */}
          <div className="bg-black bg-opacity-40 rounded-lg p-4">
            <h3 className="text-war-gold font-serif text-base border-b border-war-gold border-opacity-30 pb-2 mb-3">
              Your Leaders
            </h3>
            {aliveLeaders.length > 0 ? (
              aliveLeaders.map((leader) => (
                <div key={leader.id} className="mb-3 last:mb-0">
                  <p className="text-parchment text-sm font-bold">{leader.name}</p>
                  <p className="text-parchment-dark text-sm italic">{leader.ability}</p>
                </div>
              ))
            ) : (
              <p className="text-parchment-dark text-sm italic">No leaders in play.</p>
            )}
          </div>

          <ObjectivesPanel objectives={playerObjectives} />

          <TurnJournal entries={journalEntries} round={round} />

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

      {/* Knowledge Check Modal */}
      {showKnowledgeCheck && (
        <KnowledgeCheck question={currentKnowledgeCheck} onAnswer={onAnswerKnowledgeCheck} />
      )}

      {/* Game over report */}
      {gameOver && (
        <GameReport
          playerName={playerName}
          classPeriod={classPeriod}
          playerFaction={playerFaction}
          finalScore={finalScore}
          scores={scores}
          nationalismMeter={nationalismMeter}
          objectiveBonus={objectiveBonus}
          playerObjectives={playerObjectives}
          journalEntries={journalEntries}
          knowledgeCheckResults={knowledgeCheckResults}
          battleStats={battleStats}
          onPlayAgain={() => window.location.reload()}
        />
      )}
    </div>
  );
}
