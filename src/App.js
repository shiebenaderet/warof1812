import React, { useCallback, useEffect, useRef, useState } from 'react';
import FactionSelect from './components/FactionSelect';
import GameBoard from './components/GameBoard';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherGuide from './components/TeacherGuide';
import LearningMode from './components/LearningMode';
import PeopleGallery from './components/PeopleGallery';
import NameEntry from './components/NameEntry';
import DifficultySelect from './components/DifficultySelect';
import ErrorBoundary from './components/ErrorBoundary';
import useGameState from './hooks/useGameStateV2'; // Migrated to reducer architecture!
import useTutorial from './hooks/useTutorial';
import useSounds from './hooks/useSounds';
import useFontPreference from './hooks/useFontPreference';
import { submitQuizGateResults } from './lib/supabase';

// Fallback for non-HTTPS contexts where generateUUID() is unavailable
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export default function App() {
  // If landing from a Supabase auth callback, treat as #teacher route immediately
  const initialHash = window.location.hash;
  const isAuthCallback = initialHash.startsWith('#access_token=');
  const [route, setRoute] = useState(isAuthCallback ? '#teacher' : initialHash);
  const [onboardingStep, setOnboardingStep] = useState('name');
  const [onboardingData, setOnboardingData] = useState({
    playerName: '',
    classPeriod: '',
    difficulty: 'medium',
    gameMode: 'historian',
    sessionId: generateUUID(),
    classId: null,
  });
  const [showPeopleGallery, setShowPeopleGallery] = useState(false);
  const game = useGameState();
  const tutorial = useTutorial();
  const sounds = useSounds();
  const { fontMode, toggleFont } = useFontPreference();
  const tutorialTriggered = useRef(false);

  // Detect Supabase auth callback (magic link lands with #access_token=...)
  // Clean up the URL hash after Supabase has parsed the token
  useEffect(() => {
    if (isAuthCallback) {
      window.location.hash = '#teacher';
    }
  }, [isAuthCallback]);

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

  // Teacher-controlled skip via URL parameter
  const skipLearning = new URLSearchParams(window.location.search).get('skip') === 'learning';
  const classParam = new URLSearchParams(window.location.search).get('class') || '';

  // Onboarding step handlers
  const handleNameNext = useCallback(({ playerName, classPeriod, classId }) => {
    setOnboardingData(prev => ({ ...prev, playerName, classPeriod, classId }));
    setOnboardingStep('difficulty');
  }, []);

  const handleDifficultyNext = useCallback(({ difficulty, gameMode }) => {
    setOnboardingData(prev => ({ ...prev, difficulty, gameMode }));
    setOnboardingStep(skipLearning ? 'faction' : 'learning');
  }, [skipLearning]);

  const handleLearningComplete = useCallback((quizRetries) => {
    setOnboardingData(prev => ({ ...prev, quizRetries }));
    setOnboardingStep('faction');

    if (quizRetries) {
      const sessionId = onboardingData.sessionId;
      const storageKey = `war1812_qg_submitted_${sessionId}`;
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, 'true');
        submitQuizGateResults({
          sessionId,
          playerName: onboardingData.playerName,
          classPeriod: onboardingData.classPeriod,
          gameMode: onboardingData.gameMode,
          retries: quizRetries,
          classId: onboardingData.classId,
        }).then(({ error }) => {
          if (error) {
            console.error('Quiz gate submit error:', error);
            localStorage.removeItem(storageKey);
          }
        }).catch((err) => {
          console.error('Quiz gate submit failed:', err);
          localStorage.removeItem(storageKey);
        });
      }
    }
  }, [onboardingData]);

  const handleFactionSelect = useCallback((faction) => {
    game.startGame({
      faction,
      playerName: onboardingData.playerName,
      classPeriod: onboardingData.classPeriod,
      gameMode: onboardingData.gameMode,
      difficulty: onboardingData.difficulty,
      sessionId: onboardingData.sessionId,
      classId: onboardingData.classId,
    });
  }, [game, onboardingData]);

  const handlePlayAgain = useCallback(() => {
    game.resetGame();
    setOnboardingStep('name');
    setOnboardingData({ playerName: '', classPeriod: '', difficulty: 'medium', gameMode: 'historian', sessionId: generateUUID(), classId: null });
  }, [game]);

  // Handler for error boundary recovery
  const handleRestoreSave = () => {
    game.loadGame();
  };

  const handleStartNewGame = () => {
    game.deleteSave();
    game.resetGame();
    setOnboardingStep('name');
    setOnboardingData({ playerName: '', classPeriod: '', difficulty: 'medium', gameMode: 'historian', sessionId: generateUUID(), classId: null });
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

  if (route === '#guide') {
    return (
      <ErrorBoundary
        section="Teacher Guide"
        onRestoreSave={handleRestoreSave}
        onStartNewGame={handleStartNewGame}
      >
        <TeacherGuide />
      </ErrorBoundary>
    );
  }

  // Show People Gallery
  if (showPeopleGallery) {
    return (
      <ErrorBoundary
        section="People Gallery"
        onRestoreSave={handleRestoreSave}
        onStartNewGame={handleStartNewGame}
      >
        <PeopleGallery onClose={() => setShowPeopleGallery(false)} />
      </ErrorBoundary>
    );
  }

  // Onboarding flow (when game not started and not over)
  if (!game.gameStarted && !game.gameOver) {
    if (onboardingStep === 'name') {
      return (
        <ErrorBoundary section="Name Entry" onRestoreSave={handleRestoreSave} onStartNewGame={handleStartNewGame}>
          <NameEntry
            onNext={handleNameNext}
            classParam={classParam}
            savedGame={game.hasSavedGame()}
            onContinue={game.loadGame}
            onDeleteSave={game.deleteSave}
            onExportSave={game.exportSaveFile}
            onImportSave={game.importSaveFile}
            fontMode={fontMode}
            toggleFont={toggleFont}
          />
        </ErrorBoundary>
      );
    }
    if (onboardingStep === 'difficulty') {
      return (
        <ErrorBoundary section="Difficulty Select" onRestoreSave={handleRestoreSave} onStartNewGame={handleStartNewGame}>
          <DifficultySelect
            onNext={handleDifficultyNext}
            playerName={onboardingData.playerName}
            fontMode={fontMode}
            toggleFont={toggleFont}
          />
        </ErrorBoundary>
      );
    }
    if (onboardingStep === 'learning') {
      return (
        <ErrorBoundary section="Learning Mode" onRestoreSave={handleRestoreSave} onStartNewGame={handleStartNewGame}>
          <LearningMode
            onComplete={handleLearningComplete}
            gameMode={onboardingData.gameMode}
            playerName={onboardingData.playerName}
            classPeriod={onboardingData.classPeriod}
            sessionId={onboardingData.sessionId}
            fontMode={fontMode}
            toggleFont={toggleFont}
          />
        </ErrorBoundary>
      );
    }
    if (onboardingStep === 'faction') {
      return (
        <ErrorBoundary section="Faction Select" onRestoreSave={handleRestoreSave} onStartNewGame={handleStartNewGame}>
          <FactionSelect
            onSelect={handleFactionSelect}
            onOpenPeopleGallery={() => setShowPeopleGallery(true)}
            gameMode={onboardingData.gameMode}
            fontMode={fontMode}
            toggleFont={toggleFont}
          />
        </ErrorBoundary>
      );
    }
  }

  return (
    <ErrorBoundary
      section="Game Board"
      onRestoreSave={handleRestoreSave}
      onStartNewGame={handleStartNewGame}
    >
      <GameBoard
      sessionId={game.sessionId}
      classId={game.classId}
      gameMode={game.gameMode}
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
      difficulty={game.difficulty}
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
      onPlayAgain={handlePlayAgain}
      sounds={sounds}
      fontMode={fontMode}
      toggleFont={toggleFont}
    />
    </ErrorBoundary>
  );
}
