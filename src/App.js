import React from 'react';
import FactionSelect from './components/FactionSelect';
import GameBoard from './components/GameBoard';
import useGameState from './hooks/useGameState';

export default function App() {
  const game = useGameState();

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
      onSaveGame={game.saveGame}
      onDeleteSave={game.deleteSave}
    />
  );
}
