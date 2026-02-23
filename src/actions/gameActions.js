/**
 * Game Action Creators
 *
 * These functions coordinate actions across multiple reducers.
 * They accept dispatch functions and current state, returning functions
 * that can be called to execute complex game logic.
 *
 * This eliminates stale closure bugs because:
 * 1. Reducers always receive current state
 * 2. Dispatch functions have stable references
 * 3. No dependency arrays needed
 */

import {
  GAME_START,
  HIDE_INTRO,
  ADVANCE_PHASE,
  SET_MESSAGE,
  CAPTURE_TERRITORY,
  SET_TROOPS,
  ADD_TROOPS,
  REMOVE_TROOPS,
  USE_REINFORCEMENT,
  START_BATTLE,
  DISMISS_BATTLE,
  UPDATE_BATTLE_STATS,
  START_MANEUVER,
  EXECUTE_MANEUVER,
  CANCEL_MANEUVER,
  SET_REINFORCEMENTS,
  SET_MANEUVERS,
  UPDATE_SCORES,
  DELTA_NATIONALISM,
  ADD_JOURNAL_ENTRY,
  DESELECT_TERRITORY,
} from '../reducers/types';

/**
 * Start a new game
 * Coordinates: game, map, combat, score, leader, history reducers
 */
export function startGame(dispatchers, playerInfo) {
  const { dispatchGame, dispatchHistory } = dispatchers;
  const { faction, name, period } = playerInfo;

  // Start the game
  dispatchGame({ type: GAME_START, payload: { faction, name, period } });
  dispatchGame({ type: HIDE_INTRO });

  // Add initial journal entry
  dispatchHistory({
    type: ADD_JOURNAL_ENTRY,
    payload: {
      season: 'Summer 1812',
      items: [`${name} takes command of the ${getFactionName(faction)}`],
    },
  });
}

/**
 * Place a reinforcement troop
 * Coordinates: map, combat reducers
 */
export function placeReinforcement(dispatchers, territoryId) {
  const { dispatchMap, dispatchCombat } = dispatchers;

  dispatchMap({ type: ADD_TROOPS, payload: { territoryId, count: 1 } });
  dispatchCombat({ type: USE_REINFORCEMENT });
}

/**
 * Execute a battle
 * Coordinates: map, combat, score, history reducers
 */
export function executeBattle(dispatchers, gameState, battleResult) {
  const { dispatchMap, dispatchCombat, dispatchScore, dispatchHistory, dispatchGame } = dispatchers;
  const { fromId, toId, victory, attacker, attackerTroops, defenderTroops, attackerLosses, defenderLosses } = battleResult;

  // Show battle modal first
  dispatchCombat({ type: START_BATTLE, payload: battleResult });

  // If attacker won, capture territory
  if (victory) {
    dispatchMap({ type: CAPTURE_TERRITORY, payload: { territoryId: toId, newOwner: attacker } });

    // Move remaining troops to captured territory
    const troopsToMove = attackerTroops - attackerLosses;
    dispatchMap({ type: SET_TROOPS, payload: { territoryId: toId, count: troopsToMove } });
    dispatchMap({ type: SET_TROOPS, payload: { territoryId: fromId, count: 1 } }); // Leave 1 behind

    // Update nationalism if US won
    if (attacker === 'us') {
      dispatchScore({ type: DELTA_NATIONALISM, payload: 5 });
    }
  } else {
    // Defender won - apply losses to both sides
    dispatchMap({ type: REMOVE_TROOPS, payload: { territoryId: fromId, count: attackerLosses } });
    dispatchMap({ type: REMOVE_TROOPS, payload: { territoryId: toId, count: defenderLosses } });
  }

  // Update battle stats
  dispatchCombat({
    type: UPDATE_BATTLE_STATS,
    payload: { fought: 1, won: victory ? 1 : 0, lost: victory ? 0 : 1 },
  });

  // Add journal entry
  const territoryName = gameState.map.territories?.[toId]?.name || toId;
  dispatchHistory({
    type: ADD_JOURNAL_ENTRY,
    payload: {
      season: getSeason(gameState.game.round),
      items: [victory ? `Victory at ${territoryName}!` : `Defeat at ${territoryName}`],
    },
  });
}

/**
 * Dismiss battle modal
 * Coordinates: combat reducer
 */
export function dismissBattle(dispatchers) {
  const { dispatchCombat, dispatchMap } = dispatchers;

  dispatchCombat({ type: DISMISS_BATTLE });
  dispatchMap({ type: DESELECT_TERRITORY });
}

/**
 * Execute a maneuver
 * Coordinates: map, combat reducers
 */
export function executeManeuver(dispatchers, fromId, toId, troopCount) {
  const { dispatchMap, dispatchCombat } = dispatchers;

  // Move troops
  dispatchMap({ type: REMOVE_TROOPS, payload: { territoryId: fromId, count: troopCount } });
  dispatchMap({ type: ADD_TROOPS, payload: { territoryId: toId, count: troopCount } });

  // Complete maneuver
  dispatchCombat({ type: EXECUTE_MANEUVER });
}

/**
 * Start the allocate phase
 * Coordinates: game, combat reducers
 */
export function startAllocatePhase(dispatchers, gameState) {
  const { dispatchGame, dispatchCombat } = dispatchers;

  // Calculate reinforcements based on current territory ownership
  const { territoryOwners } = gameState.map;
  const { playerFaction } = gameState.game;
  const { leaderStates } = gameState.leader;

  const owned = Object.values(territoryOwners).filter((owner) => owner === playerFaction);
  const base = 3 + Math.floor(owned.length / 2);
  const reinforcements = base; // TODO: Add leader bonuses

  dispatchCombat({ type: SET_REINFORCEMENTS, payload: reinforcements });
  dispatchGame({
    type: SET_MESSAGE,
    payload: `You receive ${reinforcements} reinforcements. Click your territories to place troops.`,
  });
  dispatchGame({ type: ADVANCE_PHASE, payload: { message: '' } });
}

/**
 * Start the maneuver phase
 * Coordinates: game, combat reducers
 */
export function startManeuverPhase(dispatchers) {
  const { dispatchGame, dispatchCombat } = dispatchers;

  dispatchCombat({ type: SET_MANEUVERS, payload: 2 });
  dispatchGame({
    type: SET_MESSAGE,
    payload: 'Maneuver phase: Move troops between adjacent territories you control.',
  });
  dispatchGame({ type: ADVANCE_PHASE, payload: { message: '' } });
}

// Helper functions

function getFactionName(faction) {
  const names = {
    us: 'United States of America',
    british: 'British Empire',
    native: 'Native Confederacy',
  };
  return names[faction] || faction;
}

function getSeason(round) {
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  const year = 1812 + Math.floor((round - 1) / 4);
  const season = seasons[(round - 1) % 4];
  return `${season} ${year}`;
}
