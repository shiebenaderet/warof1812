import React, { useEffect, useRef } from 'react';
import FactionSelect from './components/FactionSelect';
import GameBoard from './components/GameBoard';
import useGameState from './hooks/useGameState';
import useTutorial from './hooks/useTutorial';

export default function App() {
  const game = useGameState();
  const tutorial = useTutorial();
  const tutorialTriggered = useRef(false);

  // Auto-start tutorial on first game start
  useEffect(() => {
    if (game.gameStarted && !tutorialTriggered.current && tutorial.shouldAutoStart()) {
      tutorialTriggered.current = true;
      // Small delay so the board renders before tutorial starts
      setTimeout(() => tutorial.startTutorial(), 500);
    }
  }, [game.gameStarted, tutorial]);

  if (!game.gameStarted) {
    return (
      <FactionSelect
        onSelect={game.startGame}
        savedGame={game.hasSavedGame()}
        onContinue={game.loadGame}
        onDeleteSave={game.deleteSave}
      />
    );
  }

  return (
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
      reinforcementsRemaining={game.reinforcementsRemaining}
      playerFaction={game.playerFaction}
      playerName={game.playerName}
      classPeriod={game.classPeriod}
      playerTerritoryCount={game.playerTerritoryCount}
      message={game.message}
      battleResult={game.battleResult}
      showBattleModal={game.showBattleModal}
      currentEvent={game.currentEvent}
      showEventCard={game.showEventCard}
      gameOver={game.gameOver}
      finalScore={game.finalScore}
      objectiveBonus={game.objectiveBonus}
      leaderStates={game.leaderStates}
      aiLog={game.aiLog}
      playerObjectives={game.playerObjectives}
      currentKnowledgeCheck={game.currentKnowledgeCheck}
      showKnowledgeCheck={game.showKnowledgeCheck}
      knowledgeCheckResults={game.knowledgeCheckResults}
      journalEntries={game.journalEntries}
      battleStats={game.battleStats}
      maneuversRemaining={game.maneuversRemaining}
      onTerritoryClick={game.handleTerritoryClick}
      onAdvancePhase={game.advancePhase}
      onDismissEvent={game.dismissEvent}
      onDismissBattle={game.dismissBattle}
      onAnswerKnowledgeCheck={game.answerKnowledgeCheck}
      onRequestKnowledgeCheck={game.requestKnowledgeCheck}
      onSaveGame={game.saveGame}
      onDeleteSave={game.deleteSave}
      tutorialActive={tutorial.tutorialActive}
      tutorialStepData={tutorial.currentStepData}
      tutorialCurrentStep={tutorial.currentStep}
      tutorialTotalSteps={tutorial.totalSteps}
      onTutorialNext={tutorial.nextStep}
      onTutorialPrev={tutorial.prevStep}
      onTutorialSkip={tutorial.skipTutorial}
      onStartTutorial={tutorial.startTutorial}
    />
  );
}
