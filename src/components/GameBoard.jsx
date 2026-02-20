import React, { useEffect, useRef, useState } from 'react';
import GameBoardMapSVG from './GameBoardMapSVG';
import Scoreboard from './Scoreboard';
import TerritoryInfo from './TerritoryInfo';
import EventCard from './EventCard';
import BattleModal from './BattleModal';
import KnowledgeCheck from './KnowledgeCheck';
import KnowledgeCheckPanel from './KnowledgeCheckPanel';
import ObjectivesPanel from './ObjectivesPanel';
import TurnJournal from './TurnJournal';
import GameReport from './GameReport';
import QuizReviewPanel from './QuizReviewPanel';
import TutorialOverlay from './TutorialOverlay';
import AITurnReplay from './AITurnReplay';
import { getAliveLeaders } from '../data/leaders';
import territories from '../data/territories';

// Helper to convert territory names to IDs for highlighting
const territoryNameToId = {};
Object.values(territories).forEach((terr) => {
  territoryNameToId[terr.name] = terr.id;
});

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
  nativeResistance,
  navalDominance,
  factionMultiplier,
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
  aiActions,
  showAIReplay,
  playerObjectives,
  currentKnowledgeCheck,
  showKnowledgeCheck,
  knowledgeCheckResults,
  knowledgeCheckHistory,
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
  onRequestKnowledgeCheck,
  onSaveGame,
  onDeleteSave,
  // Phase undo props
  pendingAdvance,
  pendingAdvanceMessage,
  onConfirmAdvance,
  onCancelAdvance,
  onGoBack,
  canGoBack,
  // Tutorial props
  tutorialActive,
  tutorialStepData,
  tutorialCurrentStep,
  tutorialTotalSteps,
  onTutorialNext,
  onTutorialPrev,
  onTutorialSkip,
  onStartTutorial,
  onCloseAIReplay,
  sounds,
}) {
  const aliveLeaders = getAliveLeaders(playerFaction, leaderStates);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [highlightedTerritoryNames, setHighlightedTerritoryNames] = useState([]);

  // Convert territory names to IDs for map highlighting
  const highlightedTerritories = highlightedTerritoryNames.map(name => territoryNameToId[name]).filter(Boolean);
  const prevPhase = useRef(currentPhase);
  const prevShowEvent = useRef(showEventCard);
  const prevShowBattle = useRef(showBattleModal);

  // Sound triggers for phase changes, events, and battles
  useEffect(() => {
    if (!sounds) return;
    if (currentPhase !== prevPhase.current) {
      sounds.sfx.phaseAdvance();
      prevPhase.current = currentPhase;
    }
  }, [currentPhase, sounds]);

  useEffect(() => {
    if (!sounds) return;
    if (showEventCard && !prevShowEvent.current) sounds.sfx.eventCard();
    prevShowEvent.current = showEventCard;
  }, [showEventCard, sounds]);

  useEffect(() => {
    if (!sounds) return;
    if (showBattleModal && !prevShowBattle.current) {
      if (battleResult?.conquered) sounds.sfx.victory();
      else sounds.sfx.cannon();
    }
    prevShowBattle.current = showBattleModal;
  }, [showBattleModal, battleResult, sounds]);

  useEffect(() => {
    if (!sounds || !gameOver) return;
    sounds.sfx.defeat(); // End-of-war fanfare
  }, [gameOver, sounds]);

  return (
    <div className="h-screen bg-war-navy flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="bg-black bg-opacity-50 px-3 md:px-6 py-2 md:py-3 flex items-center justify-between border-b border-war-gold border-opacity-20 flex-shrink-0 gap-2">
        <div className="flex items-center gap-3 md:gap-8 flex-shrink-0">
          <h1 className="text-war-gold font-serif text-lg md:text-2xl tracking-wide">War of 1812</h1>
          <div className="text-parchment text-sm md:text-base font-serif">
            <span className="text-parchment-dark">R:</span>{round}/{totalRounds}
          </div>
          <div className="text-parchment text-sm md:text-base font-serif hidden sm:block">
            <span className="text-parchment-dark">Season:</span> {seasonYear}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-5 flex-wrap justify-end">
          {/* Labeled phase stepper — hide labels on small screens */}
          <div className="flex items-center gap-0.5" data-tutorial="phase-indicator">
            {['event', 'allocate', 'battle', 'maneuver', 'score'].map((p, i, arr) => {
              const phaseIndex = arr.indexOf(currentPhase);
              const isPast = i < phaseIndex;
              const isCurrent = p === currentPhase;
              return (
                <React.Fragment key={p}>
                  <div className="flex items-center gap-1">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      isCurrent ? 'bg-war-gold' : isPast ? 'bg-green-500' : 'bg-parchment-dark bg-opacity-30'
                    }`} />
                    <span className={`text-xs font-serif capitalize hidden md:inline ${
                      isCurrent ? 'text-war-gold font-bold' : isPast ? 'text-green-400' : 'text-parchment-dark text-opacity-50'
                    }`}>{p}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <span className={`text-xs mx-0.5 hidden md:inline ${isPast ? 'text-green-400' : 'text-parchment-dark text-opacity-30'}`}>&rsaquo;</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          {currentPhase === 'allocate' && (
            <span className="text-sm md:text-base text-parchment">
              <span className="hidden sm:inline">Reinforcements: </span><span className="text-war-gold font-bold text-base md:text-lg">{reinforcementsRemaining}</span>
            </span>
          )}
          {currentPhase === 'maneuver' && (
            <span className="text-sm md:text-base text-parchment">
              <span className="hidden sm:inline">Moves: </span><span className="text-war-gold font-bold text-base md:text-lg">{maneuversRemaining}</span>
            </span>
          )}
          <button
            onClick={onStartTutorial}
            className="w-8 h-8 text-sm border border-parchment-dark text-parchment-dark rounded-full
                       hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer
                       flex items-center justify-center font-bold flex-shrink-0"
            title="Show tutorial"
          >
            ?
          </button>
          {sounds && (
            <>
              <button
                onClick={sounds.toggleMusic}
                className={`w-8 h-8 text-sm border rounded-full flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ${
                  sounds.musicOn
                    ? 'border-war-gold text-war-gold'
                    : 'border-parchment-dark text-parchment-dark hover:border-war-gold hover:text-war-gold'
                }`}
                title={sounds.musicOn ? 'Stop music' : 'Play music'}
              >
                {sounds.musicOn ? '\u266B' : '\u266A'}
              </button>
              <button
                onClick={sounds.toggleMute}
                className={`w-8 h-8 text-sm border rounded-full flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ${
                  sounds.muted
                    ? 'border-red-500 text-red-400'
                    : 'border-parchment-dark text-parchment-dark hover:border-war-gold hover:text-war-gold'
                }`}
                title={sounds.muted ? 'Unmute' : 'Mute'}
              >
                {sounds.muted ? '\uD83D\uDD07' : '\uD83D\uDD0A'}
              </button>
            </>
          )}
          <button
            onClick={onSaveGame}
            className="px-3 md:px-4 py-1.5 text-sm border border-parchment-dark text-parchment-dark rounded
                       hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer flex-shrink-0"
            title="Save game"
          >
            Save
          </button>
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden w-8 h-8 text-sm border border-parchment-dark text-parchment-dark rounded
                       hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer
                       flex items-center justify-center flex-shrink-0"
            title="Toggle sidebar"
          >
            {sidebarOpen ? '\u2715' : '\u2630'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Map area */}
        <div className="flex-1 p-2 md:p-3 flex flex-col min-h-0">
          {/* Message banner */}
          {message && (
            <div className="bg-black bg-opacity-50 border border-war-gold border-opacity-30 rounded-lg px-5 py-2 mb-2 flex-shrink-0">
              <p className="text-parchment font-serif text-base">{message}</p>
            </div>
          )}

          {/* Game Board Map */}
          <div className="flex-1 bg-black bg-opacity-20 rounded-lg border border-parchment-dark border-opacity-10 overflow-hidden min-h-0 relative">
            {/* AI action log - positioned at top of map, doesn't reduce map space */}
            {aiLog.length > 0 && (
              <div className="absolute top-0 left-0 right-0 z-40 bg-black bg-opacity-90 border-b-2 border-british-red px-5 py-2 max-h-20 overflow-y-auto">
                <p className="text-xs text-parchment uppercase tracking-wider font-bold inline mr-3">Opponent:</p>
                <span className="text-parchment text-sm">{aiLog[aiLog.length - 1]}</span>
              </div>
            )}

            <GameBoardMapSVG
              territoryOwners={territoryOwners}
              selectedTerritory={selectedTerritory}
              onTerritoryClick={onTerritoryClick}
              troops={troops}
              currentPhase={currentPhase}
              playerFaction={playerFaction}
              highlightedTerritories={highlightedTerritories}
            />
          </div>

          {/* Phase instruction + advance button */}
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between flex-shrink-0 gap-2" data-tutorial="advance-btn">
            <p className="text-sm md:text-base text-parchment-dark font-serif hidden sm:block">
              {phaseInstructions[currentPhase]}
            </p>
            {!gameOver && (
              <div className="flex items-center gap-2 flex-shrink-0 sm:ml-4 justify-end">
                {canGoBack && (
                  <button
                    onClick={onGoBack}
                    className="px-3 md:px-4 py-2 md:py-2.5 font-serif text-sm md:text-base rounded-lg transition-colors
                               border border-parchment-dark text-parchment-dark hover:border-war-gold hover:text-war-gold cursor-pointer"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={onAdvancePhase}
                  disabled={showEventCard || showBattleModal || showKnowledgeCheck}
                  className={`px-4 md:px-8 py-2 md:py-2.5 font-serif text-sm md:text-base rounded-lg transition-colors ${
                    showEventCard || showBattleModal || showKnowledgeCheck
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-war-gold text-war-navy hover:bg-yellow-500 cursor-pointer font-bold'
                  }`}
                >
                  {currentPhase === 'event' ? 'Begin Planning'
                    : currentPhase === 'allocate' ? (reinforcementsRemaining > 0 ? `Proceed to Battle (${reinforcementsRemaining} unplaced)` : 'Proceed to Battle')
                    : currentPhase === 'battle' ? 'Proceed to Maneuver'
                    : currentPhase === 'maneuver' ? (maneuversRemaining > 0 ? `End Turn (${maneuversRemaining} moves unused)` : 'End Turn')
                    : currentPhase === 'score' && round >= totalRounds ? 'End War'
                    : 'End Turn'}
                </button>
              </div>
            )}
          </div>

          {/* Confirmation dialog for skipping unused resources */}
          {pendingAdvance && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-45 p-4">
              <div className="bg-war-navy border-2 border-war-gold rounded-xl max-w-sm w-full p-6 text-center">
                <p className="text-parchment font-serif text-lg mb-4">{pendingAdvanceMessage}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={onCancelAdvance}
                    className="px-6 py-2.5 font-serif text-base rounded-lg border border-parchment-dark text-parchment
                               hover:border-war-gold hover:text-war-gold transition-colors cursor-pointer"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={onConfirmAdvance}
                    className="px-6 py-2.5 font-serif text-base rounded-lg bg-war-gold text-war-navy
                               hover:bg-yellow-500 transition-colors cursor-pointer font-bold"
                  >
                    Advance Anyway
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Right sidebar */}
        <aside className={`
          w-72 md:w-80 p-3 space-y-3 border-l border-parchment-dark border-opacity-10 overflow-y-auto flex-shrink-0
          bg-war-navy
          fixed md:static top-0 right-0 h-full z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          md:transform-none
        `}>
          <div data-tutorial="scoreboard">
            <Scoreboard
              scores={scores}
              playerFaction={playerFaction}
              nationalismMeter={nationalismMeter}
              nativeResistance={nativeResistance}
              navalDominance={navalDominance}
              factionMultiplier={factionMultiplier}
              playerTerritoryCount={playerTerritoryCount}
            />
          </div>

          {/* Leaders panel */}
          <div className="bg-black bg-opacity-40 rounded-lg p-3" data-tutorial="leaders">
            <h3 className="text-war-gold font-serif text-base border-b border-war-gold border-opacity-30 pb-2 mb-2">
              Your Leaders
            </h3>
            {aliveLeaders.length > 0 ? (
              aliveLeaders.map((leader) => (
                <div key={leader.id} className="mb-2 last:mb-0">
                  <p className="text-parchment text-sm font-bold">{leader.name}</p>
                  <p className="text-parchment-dark text-sm italic">{leader.ability}</p>
                </div>
              ))
            ) : (
              <p className="text-parchment-dark text-sm italic">No leaders in play.</p>
            )}
          </div>

          <div data-tutorial="objectives">
            <ObjectivesPanel objectives={playerObjectives} />
          </div>

          <KnowledgeCheckPanel
            totalAnswered={knowledgeCheckResults.total}
            totalCorrect={knowledgeCheckResults.correct}
            onTakeCheck={onRequestKnowledgeCheck}
          />

          <QuizReviewPanel history={knowledgeCheckHistory} />

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
        <KnowledgeCheck question={currentKnowledgeCheck} onAnswer={onAnswerKnowledgeCheck} questionNumber={knowledgeCheckResults.total + 1} />
      )}

      {/* AI Turn Replay Modal */}
      {showAIReplay && aiActions && (
        <AITurnReplay
          aiActions={aiActions}
          onClose={onCloseAIReplay}
          onHighlightTerritory={setHighlightedTerritoryNames}
        />
      )}

      {/* Tutorial Overlay */}
      {tutorialActive && (
        <TutorialOverlay
          stepData={tutorialStepData}
          currentStep={tutorialCurrentStep}
          totalSteps={tutorialTotalSteps}
          onNext={onTutorialNext}
          onPrev={onTutorialPrev}
          onSkip={onTutorialSkip}
        />
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
          factionMultiplier={factionMultiplier}
          nativeResistance={nativeResistance}
          navalDominance={navalDominance}
          playerObjectives={playerObjectives}
          journalEntries={journalEntries}
          knowledgeCheckResults={knowledgeCheckResults}
          battleStats={battleStats}
          playerTerritoryCount={playerTerritoryCount}
          round={round}
          onPlayAgain={() => window.location.reload()}
        />
      )}
    </div>
  );
}
