import React from 'react';
import FactionSelect from './components/FactionSelect';
import GameBoard from './components/GameBoard';
import useGameState from './hooks/useGameState';

export default function App() {
  const game = useGameState();

  if (!game.gameStarted) {
    return <FactionSelect onSelect={game.startGame} />;
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
      playerTerritoryCount={game.playerTerritoryCount}
      message={game.message}
      battleResult={game.battleResult}
      showBattleModal={game.showBattleModal}
      currentEvent={game.currentEvent}
      showEventCard={game.showEventCard}
      gameOver={game.gameOver}
      finalScore={game.finalScore}
      leaderStates={game.leaderStates}
      aiLog={game.aiLog}
      onTerritoryClick={game.handleTerritoryClick}
      onAdvancePhase={game.advancePhase}
      onDismissEvent={game.dismissEvent}
      onDismissBattle={game.dismissBattle}
    />
  );
}
