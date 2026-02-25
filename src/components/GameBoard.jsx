import React, { useEffect, useRef, useState, useCallback } from 'react';
import LeafletMap from './LeafletMap';
import Scoreboard from './Scoreboard';
import TerritoryInfo from './TerritoryInfo';
import IntroScreen from './IntroScreen';
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
import VictoryProgress from './VictoryProgress';
import ConfirmActionModal from './ConfirmActionModal';
import GlossaryPanel from './GlossaryPanel';
import PeoplePanel from './PeoplePanel';
import { getAliveLeaders } from '../data/leaders';
import territories from '../data/territories';

const territoryNameToId = {};
Object.values(territories).forEach((terr) => {
  territoryNameToId[terr.name] = terr.id;
});

const PHASES = ['event', 'allocate', 'battle', 'maneuver', 'score'];
const PHASE_ICONS = {
  event: '\u2709',      // envelope
  allocate: '\u2694',    // crossed swords (reinforce)
  battle: '\uD83D\uDCA5', // collision
  maneuver: '\u2192',   // arrow
  score: '\u2605',      // star
};

const phaseInstructions = {
  event: 'Review the historical event and its effects on the war.',
  allocate: 'Click your territories to place reinforcement troops.',
  battle: 'Select your territory, then click an adjacent enemy to attack.',
  maneuver: 'Move troops between your adjacent territories.',
  score: 'Review the board. Advance to let opponents take their turn.',
};

export default function GameBoard({
  gameMode, round, totalRounds, currentPhase, currentPhaseLabel, seasonYear,
  territoryOwners, troops, selectedTerritory, scores, nationalismMeter,
  nativeResistance, navalDominance, factionMultiplier, reinforcementsRemaining,
  playerFaction, playerTerritoryCount, message, battleResult, showBattleModal,
  showIntro, currentEvent, showEventCard, gameOver, gameOverReason, gameOverWinner, finalScore, leaderStates,
  aiLog, aiActions, showAIReplay, playerObjectives, currentKnowledgeCheck,
  showKnowledgeCheck, knowledgeCheckResults, knowledgeCheckHistory,
  journalEntries, battleStats, maneuversRemaining, objectiveBonus,
  playerName, classPeriod, onTerritoryClick, onAdvancePhase, onDismissIntro,
  onDismissEvent, onDismissBattle, onAnswerKnowledgeCheck, onRequestKnowledgeCheck,
  onSaveGame, onDeleteSave, pendingAdvance, pendingAdvanceMessage,
  onConfirmAdvance, onCancelAdvance, onGoBack, canGoBack, pendingAction,
  actionHistory, onConfirmPlaceTroop, onConfirmManeuver, onCancelAction,
  onUndoLastAction, tutorialActive, tutorialStepData, tutorialCurrentStep,
  tutorialTotalSteps, onTutorialNext, onTutorialPrev, onTutorialSkip,
  onStartTutorial, onCloseAIReplay, onPlayAgain, sounds,
  fontMode, toggleFont,
}) {
  const aliveLeaders = getAliveLeaders(playerFaction, leaderStates);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [highlightedTerritoryIds, setHighlightedTerritoryIds] = useState([]);

  const handleHighlightTerritories = useCallback((names) => {
    if (!names || names.length === 0) {
      setHighlightedTerritoryIds([]);
      return;
    }
    const ids = names.map(name => territoryNameToId[name]).filter(Boolean);
    setHighlightedTerritoryIds(ids);
  }, []);

  const handleCloseAIReplay = useCallback(() => {
    setHighlightedTerritoryIds([]);
    onCloseAIReplay();
  }, [onCloseAIReplay]);

  const prevPhase = useRef(currentPhase);
  const prevShowEvent = useRef(showEventCard);
  const prevShowBattle = useRef(showBattleModal);

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
    sounds.sfx.defeat();
  }, [gameOver, sounds]);

  const phaseIndex = PHASES.indexOf(currentPhase);

  return (
    <div className="h-screen bg-war-ink flex flex-col overflow-hidden">
      {/* ── Top bar ── */}
      <header className="bg-gradient-to-r from-war-navy via-war-navy to-war-navy-light px-3 md:px-5 py-2 flex items-center justify-between border-b border-war-gold/15 flex-shrink-0">
        {/* Left: title + round */}
        <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
          <h1 className="text-war-gold font-display text-base md:text-xl tracking-wider">1812<span className="sr-only">: War of 1812 — Rise of the Nation</span></h1>
          <div className="hidden sm:flex items-center gap-1.5 text-parchment/70 font-body text-sm">
            <span className="text-parchment-dark/60">Round</span>
            <span className="text-parchment font-bold">{round}</span>
            <span className="text-parchment-dark/40">/ {totalRounds}</span>
            <span className="text-parchment-dark/30 mx-1">|</span>
            <span className="text-war-copper/80 italic">{seasonYear}</span>
          </div>
          <div className="sm:hidden text-parchment font-body text-sm">
            R{round} <span className="text-parchment-dark/50">/ {totalRounds}</span>
          </div>
        </div>

        {/* Center: phase stepper */}
        <div className="flex items-center gap-0.5 md:gap-1" data-tutorial="phase-indicator">
          {PHASES.map((p, i) => {
            const isPast = i < phaseIndex;
            const isCurrent = p === currentPhase;
            return (
              <React.Fragment key={p}>
                <div className={`flex items-center gap-1 px-1.5 md:px-2.5 py-1 rounded transition-all duration-300 ${
                  isCurrent ? 'bg-war-gold/15 border border-war-gold/30' : 'border border-transparent'
                }`}>
                  <span className={`text-sm md:text-base ${
                    isCurrent ? 'text-war-gold' : isPast ? 'text-green-500/60' : 'text-parchment-dark/30'
                  }`}>{PHASE_ICONS[p]}</span>
                  <span className={`text-sm font-body capitalize hidden lg:inline ${
                    isCurrent ? 'text-war-gold font-bold' : isPast ? 'text-green-500/50' : 'text-parchment-dark/30'
                  }`}>{p}</span>
                </div>
                {i < PHASES.length - 1 && (
                  <div className={`w-3 md:w-5 h-px ${isPast ? 'bg-green-500/30' : 'bg-parchment-dark/15'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: resources + controls */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {currentPhase === 'allocate' && (
            <div className="flex items-center gap-1 bg-war-gold/10 border border-war-gold/25 rounded px-2.5 py-1">
              <span className="text-war-gold font-display text-base md:text-lg font-bold">{reinforcementsRemaining}</span>
              <span className="text-parchment-dark/60 text-sm font-body hidden sm:inline">troops</span>
            </div>
          )}
          {currentPhase === 'maneuver' && (
            <div className="flex items-center gap-1 bg-war-gold/10 border border-war-gold/25 rounded px-2.5 py-1">
              <span className="text-war-gold font-display text-base md:text-lg font-bold">{maneuversRemaining}</span>
              <span className="text-parchment-dark/60 text-sm font-body hidden sm:inline">moves</span>
            </div>
          )}
          <button onClick={onStartTutorial} className="w-7 h-7 text-xs border border-parchment-dark/25 text-parchment-dark/60 rounded hover:border-war-gold/50 hover:text-war-gold transition-colors cursor-pointer flex items-center justify-center font-body flex-shrink-0" title="Tutorial" aria-label="Show tutorial">?</button>
          {sounds && (
            <>
              <button onClick={sounds.toggleMusic} className={`w-7 h-7 text-xs border rounded flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ${sounds.musicOn ? 'border-war-gold/40 text-war-gold/80' : 'border-parchment-dark/25 text-parchment-dark/40 hover:border-war-gold/40 hover:text-war-gold/60'}`} title={sounds.musicOn ? 'Stop music' : 'Play music'} aria-label={sounds.musicOn ? 'Stop music' : 'Play music'}>{sounds.musicOn ? '\u266B' : '\u266A'}</button>
              <button onClick={sounds.toggleMute} className={`w-7 h-7 text-xs border rounded flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ${sounds.muted ? 'border-red-500/40 text-red-400/80' : 'border-parchment-dark/25 text-parchment-dark/40 hover:border-war-gold/40 hover:text-war-gold/60'}`} title={sounds.muted ? 'Unmute' : 'Mute'} aria-label={sounds.muted ? 'Unmute sounds' : 'Mute sounds'}>{sounds.muted ? '\uD83D\uDD07' : '\uD83D\uDD0A'}</button>
            </>
          )}
          <button onClick={toggleFont} className={`px-2.5 py-1 text-xs border rounded transition-colors cursor-pointer flex-shrink-0 font-body ${fontMode === 'dyslexic' ? 'border-war-gold/40 text-war-gold/80' : 'border-parchment-dark/25 text-parchment-dark/60 hover:border-war-gold/40 hover:text-war-gold'}`} title={fontMode === 'dyslexic' ? 'Switch to standard font' : 'Switch to OpenDyslexic font'} aria-label="Toggle dyslexic-friendly font">Aa</button>
          <button onClick={onSaveGame} className="px-2.5 py-1 text-xs border border-parchment-dark/25 text-parchment-dark/60 rounded hover:border-war-gold/40 hover:text-war-gold transition-colors cursor-pointer flex-shrink-0 font-body" title="Save game" aria-label="Save game">Save</button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden w-7 h-7 text-xs border border-parchment-dark/25 text-parchment-dark/60 rounded hover:border-war-gold/40 hover:text-war-gold transition-colors cursor-pointer flex items-center justify-center flex-shrink-0" title="Toggle sidebar" aria-label="Toggle sidebar">{sidebarOpen ? '\u2715' : '\u2630'}</button>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Map area */}
        <div className="flex-1 p-2 md:p-3 flex flex-col min-h-0">
          {/* Message banner */}
          {message && (
            <div className="bg-war-navy/80 backdrop-blur border border-war-gold/15 rounded px-4 py-2 mb-2 flex-shrink-0 shadow-card" role="status" aria-live="polite">
              <p className="text-parchment/90 font-body text-sm md:text-base">{message}</p>
            </div>
          )}

          {/* Map or overlays */}
          <div className="flex-1 bg-war-navy/40 rounded border border-parchment-dark/8 overflow-hidden min-h-0 relative">
            {showIntro ? (
              <IntroScreen playerFaction={playerFaction} onContinue={onDismissIntro} gameMode={gameMode} />
            ) : showEventCard ? (
              <EventCard event={currentEvent} onDismiss={onDismissEvent} gameMode={gameMode} />
            ) : (
              <>
                {aiLog.length > 0 && !showAIReplay && (
                  <div className="absolute top-0 left-0 right-0 z-40 bg-war-navy/95 backdrop-blur border-b border-british-red/40 px-4 py-2 max-h-16 overflow-y-auto">
                    <span className="text-british-red/80 text-sm uppercase tracking-widest font-body font-bold mr-2">Opponent:</span>
                    <span className="text-parchment/80 text-sm font-body">{aiLog[aiLog.length - 1]}</span>
                  </div>
                )}
                <LeafletMap
                  territoryOwners={territoryOwners}
                  selectedTerritory={selectedTerritory}
                  onTerritoryClick={onTerritoryClick}
                  troops={troops}
                  highlightedTerritories={highlightedTerritoryIds}
                />
                {showAIReplay && aiActions && (
                  <AITurnReplay aiActions={aiActions} onClose={handleCloseAIReplay} onHighlightTerritory={handleHighlightTerritories} />
                )}
              </>
            )}
          </div>

          {/* Bottom bar: instructions + buttons */}
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between flex-shrink-0 gap-2" data-tutorial="advance-btn">
            <p className="text-xs md:text-sm text-parchment-dark/50 font-body hidden sm:block italic">
              {phaseInstructions[currentPhase]}
            </p>
            {!gameOver && (
              <div className="flex items-center gap-2 flex-shrink-0 sm:ml-4 justify-end">
                {canGoBack && (
                  <button onClick={onGoBack} className="px-3 py-2 font-body text-sm rounded border border-parchment-dark/25 text-parchment-dark/60 hover:border-war-gold/40 hover:text-war-gold transition-colors cursor-pointer">
                    Back
                  </button>
                )}
                {actionHistory && actionHistory.length > 0 && (currentPhase === 'allocate' || currentPhase === 'maneuver') && (
                  <button onClick={onUndoLastAction} className="px-3 py-2 font-body text-sm rounded border border-war-gold/30 text-war-gold/70 hover:bg-war-gold/10 transition-colors cursor-pointer" title="Undo last action">
                    Undo
                  </button>
                )}
                <button
                  onClick={onAdvancePhase}
                  disabled={showEventCard || showBattleModal || showKnowledgeCheck}
                  className={`px-5 md:px-8 py-2 font-display text-sm md:text-base rounded tracking-wide transition-all ${
                    showEventCard || showBattleModal || showKnowledgeCheck
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : 'bg-war-gold text-war-ink hover:bg-war-brass cursor-pointer font-bold shadow-copper'
                  }`}
                >
                  {currentPhase === 'event' ? 'Begin Planning'
                    : currentPhase === 'allocate' ? (reinforcementsRemaining > 0 ? `Proceed (${reinforcementsRemaining} left)` : 'Proceed to Battle')
                    : currentPhase === 'battle' ? 'Proceed to Maneuver'
                    : currentPhase === 'maneuver' ? (maneuversRemaining > 0 ? `End Turn (${maneuversRemaining} moves)` : 'End Turn')
                    : currentPhase === 'score' && round >= totalRounds ? 'End War'
                    : 'End Turn'}
                </button>
              </div>
            )}
          </div>

          {/* Pending advance confirmation */}
          {pendingAdvance && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 1000 }}>
              <div className="bg-war-navy border-2 border-war-gold/50 rounded-lg max-w-sm w-full p-6 text-center shadow-modal animate-fadein">
                <p className="text-parchment font-body text-lg mb-5">{pendingAdvanceMessage}</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={onCancelAdvance} className="px-6 py-2.5 font-body text-base rounded border border-parchment-dark/30 text-parchment hover:border-war-gold/50 hover:text-war-gold transition-colors cursor-pointer" style={{ minHeight: '44px' }}>
                    Go Back
                  </button>
                  <button onClick={onConfirmAdvance} className="px-6 py-2.5 font-display text-base rounded bg-war-gold text-war-ink hover:bg-war-brass transition-colors cursor-pointer font-bold" style={{ minHeight: '44px' }}>
                    Advance
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Right sidebar ── */}
        <aside className={`
          w-72 md:w-[300px] p-3 space-y-3 border-l border-parchment-dark/8 overflow-y-auto flex-shrink-0
          bg-war-ink/95 backdrop-blur
          fixed md:static top-0 right-0 h-full z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          md:transform-none
        `}>
          {!gameOver && (
            <VictoryProgress
              currentScore={scores[playerFaction]}
              playerFaction={playerFaction}
              nationalismMeter={nationalismMeter}
              nativeResistance={Object.values(territoryOwners).filter(o => o === 'native').length}
              navalDominance={Object.entries(territoryOwners).filter(([id, owner]) => owner === 'british' && territories[id]?.isNaval).length}
              objectiveBonus={objectiveBonus}
              round={round}
            />
          )}

          <div data-tutorial="scoreboard">
            <Scoreboard scores={scores} playerFaction={playerFaction} nationalismMeter={nationalismMeter} nativeResistance={nativeResistance} navalDominance={navalDominance} factionMultiplier={factionMultiplier} playerTerritoryCount={playerTerritoryCount} />
          </div>

          {/* Leaders */}
          <div className="bg-war-navy/50 rounded-lg p-3 border border-parchment-dark/8" data-tutorial="leaders">
            <h3 className="text-war-gold/90 font-display text-base tracking-wide border-b border-war-gold/15 pb-2 mb-2">
              Your Leaders
            </h3>
            {aliveLeaders.length > 0 ? (
              aliveLeaders.map((leader) => (
                <div key={leader.id} className="mb-2 last:mb-0">
                  <p className="text-parchment/90 text-sm font-body font-bold">{leader.name}</p>
                  <p className="text-parchment-dark/60 text-sm font-body italic">{leader.ability}</p>
                </div>
              ))
            ) : (
              <p className="text-parchment-dark/40 text-sm font-body italic">No leaders in play.</p>
            )}
          </div>

          <div data-tutorial="objectives">
            <ObjectivesPanel objectives={playerObjectives} />
          </div>

          <KnowledgeCheckPanel totalAnswered={knowledgeCheckResults.total} totalCorrect={knowledgeCheckResults.correct} onTakeCheck={onRequestKnowledgeCheck} />
          <QuizReviewPanel history={knowledgeCheckHistory} />
          <GlossaryPanel />
          <PeoplePanel playerFaction={playerFaction} />
          <TurnJournal entries={journalEntries} round={round} />
          <TerritoryInfo territoryId={selectedTerritory} territoryOwners={territoryOwners} troops={troops} />
        </aside>
      </div>

      {/* ── Modals ── */}
      {showBattleModal && <BattleModal battle={battleResult} onClose={onDismissBattle} />}
      {showKnowledgeCheck && <KnowledgeCheck question={currentKnowledgeCheck} onAnswer={onAnswerKnowledgeCheck} questionNumber={knowledgeCheckResults.total + 1} gameMode={gameMode} />}
      {pendingAction && <ConfirmActionModal actionType={pendingAction.type} actionData={pendingAction} onConfirm={pendingAction.type === 'placement' ? onConfirmPlaceTroop : onConfirmManeuver} onCancel={onCancelAction} />}
      {tutorialActive && <TutorialOverlay stepData={tutorialStepData} currentStep={tutorialCurrentStep} totalSteps={tutorialTotalSteps} onNext={onTutorialNext} onPrev={onTutorialPrev} onSkip={onTutorialSkip} gameMode={gameMode} />}
      {gameOver && <GameReport playerName={playerName} classPeriod={classPeriod} playerFaction={playerFaction} finalScore={finalScore} scores={scores} nationalismMeter={nationalismMeter} objectiveBonus={objectiveBonus} factionMultiplier={factionMultiplier} nativeResistance={nativeResistance} navalDominance={navalDominance} playerObjectives={playerObjectives} journalEntries={journalEntries} knowledgeCheckResults={knowledgeCheckResults} battleStats={battleStats} playerTerritoryCount={playerTerritoryCount} round={round} gameOverReason={gameOverReason} gameOverWinner={gameOverWinner} territoryOwners={territoryOwners} onPlayAgain={onPlayAgain} />}
    </div>
  );
}
