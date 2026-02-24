import React, { useEffect, useRef, useState } from 'react';
import FactionSelect from './components/FactionSelect';
import GameBoard from './components/GameBoard';
import TeacherDashboard from './components/TeacherDashboard';
import LearningMode from './components/LearningMode';
import ErrorBoundary from './components/ErrorBoundary';
import useGameState from './hooks/useGameStateV2'; // Migrated to reducer architecture!
import useTutorial from './hooks/useTutorial';
import useSounds from './hooks/useSounds';

export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [showLearningMode, setShowLearningMode] = useState(false);
  const [learningCompleted, setLearningCompleted] = useState(false);
  const game = useGameState();
  const tutorial = useTutorial();
  const sounds = useSounds();
  const tutorialTriggered = useRef(false);

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Auto-start tutorial after the first event card is dismissed
  useEffect(() => {
    if (
      game.gameStarted &&
      !tutorialTriggered.current &&
      !game.showEventCard &&
      !game.showBattleModal &&
      !game.showKnowledgeCheck &&
      tutorial.shouldAutoStart()
    ) {
      tutorialTriggered.current = true;
      setTimeout(() => tutorial.startTutorial(), 300);
    }
  }, [game.gameStarted, game.showEventCard, game.showBattleModal, game.showKnowledgeCheck, tutorial]);

  // Handler for error boundary recovery
  const handleRestoreSave = () => {
    game.loadGame();
  };

  const handleStartNewGame = () => {
    game.deleteSave();
    window.location.reload();
  };

  if (route === '#teacher') {
    return (
      <ErrorBoundary
        section="Teacher Dashboard"
        onRestoreSave={handleRestoreSave}
        onStartNewGame={handleStartNewGame}
      >
        <TeacherDashboard />
      </ErrorBoundary>
    );
  }

  // Show learning mode if requested and not completed
  if (showLearningMode && !learningCompleted) {
    return (
      <ErrorBoundary
        section="Learning Mode"
        onRestoreSave={handleRestoreSave}
        onStartNewGame={handleStartNewGame}
      >
        <LearningMode
          onComplete={() => {
            setLearningCompleted(true);
            setShowLearningMode(false);
          }}
          onSkip={() => {
            setLearningCompleted(true);
            setShowLearningMode(false);
          }}
        />
      </ErrorBoundary>
    );
  }

  if (!game.gameStarted) {
    return (
      <ErrorBoundary
        section="Faction Select"
        onRestoreSave={handleRestoreSave}
        onStartNewGame={handleStartNewGame}
      >
        <FactionSelect
          onSelect={game.startGame}
          savedGame={game.hasSavedGame()}
          onContinue={game.loadGame}
          onDeleteSave={game.deleteSave}
          onExportSave={game.exportSaveFile}
          onImportSave={game.importSaveFile}
          onStartLearning={() => setShowLearningMode(true)}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary
      section="Game Board"
      onRestoreSave={handleRestoreSave}
      onStartNewGame={handleStartNewGame}
    >
      <GameBoard
      round={game.round}
      totalRounds={game.totalRounds}
      currentPhase={game.currentPhase}
      currentPhaseLabel={game.currentPhaseLabel}
      seasonYear={game.seasonYear}
      territoryOwners={game.territoryOwners}
      troops={game.troops}
      selectedTerritory={game.selectedTerritory}
      scores={game.scores}
      nationalismMeter={game.nationalismMeter}
      nativeResistance={game.nativeResistance}
      navalDominance={game.navalDominance}
      factionMultiplier={game.factionMultiplier}
      reinforcementsRemaining={game.reinforcementsRemaining}
      playerFaction={game.playerFaction}
      playerName={game.playerName}
      classPeriod={game.classPeriod}
      playerTerritoryCount={game.playerTerritoryCount}
      message={game.message}
      battleResult={game.battleResult}
      showBattleModal={game.showBattleModal}
      showIntro={game.showIntro}
      currentEvent={game.currentEvent}
      showEventCard={game.showEventCard}
      gameOver={game.gameOver}
      gameOverReason={game.gameOverReason}
      gameOverWinner={game.gameOverWinner}
      finalScore={game.finalScore}
      objectiveBonus={game.objectiveBonus}
      leaderStates={game.leaderStates}
      aiLog={game.aiLog}
      aiActions={game.aiActions}
      showAIReplay={game.showAIReplay}
      playerObjectives={game.playerObjectives}
      currentKnowledgeCheck={game.currentKnowledgeCheck}
      showKnowledgeCheck={game.showKnowledgeCheck}
      knowledgeCheckResults={game.knowledgeCheckResults}
      knowledgeCheckHistory={game.knowledgeCheckHistory}
      journalEntries={game.journalEntries}
      battleStats={game.battleStats}
      maneuversRemaining={game.maneuversRemaining}
      onTerritoryClick={game.handleTerritoryClick}
      onAdvancePhase={game.advancePhase}
      onDismissIntro={game.dismissIntro}
      onDismissEvent={game.dismissEvent}
      onDismissBattle={game.dismissBattle}
      onAnswerKnowledgeCheck={game.answerKnowledgeCheck}
      onRequestKnowledgeCheck={game.requestKnowledgeCheck}
      onSaveGame={game.saveGame}
      onDeleteSave={game.deleteSave}
      pendingAdvance={game.pendingAdvance}
      pendingAdvanceMessage={game.pendingAdvanceMessage}
      onConfirmAdvance={game.confirmAdvance}
      onCancelAdvance={game.cancelAdvance}
      onGoBack={game.goBackPhase}
      canGoBack={game.phaseHistory.length > 0 && game.currentPhase !== 'event'}
      pendingAction={game.pendingAction}
      actionHistory={game.actionHistory}
      onConfirmPlaceTroop={game.confirmPlaceTroop}
      onConfirmManeuver={game.confirmManeuver}
      onCancelAction={game.cancelAction}
      onUndoLastAction={game.undoLastAction}
      tutorialActive={tutorial.tutorialActive}
      tutorialStepData={tutorial.currentStepData}
      tutorialCurrentStep={tutorial.currentStep}
      tutorialTotalSteps={tutorial.totalSteps}
      onTutorialNext={tutorial.nextStep}
      onTutorialPrev={tutorial.prevStep}
      onTutorialSkip={tutorial.skipTutorial}
      onStartTutorial={tutorial.startTutorial}
      onCloseAIReplay={game.closeAIReplay}
      sounds={sounds}
    />
    </ErrorBoundary>
  );
}
