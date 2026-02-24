/**
 * Combat Reducer - Battles, reinforcements, and maneuvers
 *
 * Handles: battle results, reinforcements, maneuver state, battle stats
 */

import {
  SET_REINFORCEMENTS,
  USE_REINFORCEMENT,
  START_BATTLE,
  RESOLVE_BATTLE,
  DISMISS_BATTLE,
  UPDATE_BATTLE_STATS,
  START_MANEUVER,
  EXECUTE_MANEUVER,
  CANCEL_MANEUVER,
  USE_MANEUVER,
  SET_MANEUVERS,
  GAME_RESET,
  LOAD_COMBAT_STATE,
} from './types';

/**
 * @typedef {Object} BattleResult
 * @property {string} attacker - Faction
 * @property {string} defender - Faction
 * @property {string} fromId - Territory ID
 * @property {string} toId - Territory ID
 * @property {number} attackerRoll - Dice roll
 * @property {number} defenderRoll - Dice roll
 * @property {number} attackerTroops - Initial troops
 * @property {number} defenderTroops - Initial troops
 * @property {number} attackerLosses - Troops lost
 * @property {number} defenderLosses - Troops lost
 * @property {boolean} victory - Did attacker win?
 * @property {string} message - Battle narrative
 */

/**
 * @typedef {Object} CombatState
 * @property {number} reinforcementsRemaining
 * @property {BattleResult | null} battleResult
 * @property {boolean} showBattleModal
 * @property {Object} battleStats - { fought: number, won: number, lost: number }
 * @property {string | null} maneuverFrom - Source territory ID
 * @property {number} maneuversRemaining - 0-2
 */

/** @returns {CombatState} */
export function getInitialCombatState() {
  return {
    reinforcementsRemaining: 0,
    battleResult: null,
    showBattleModal: false,
    battleStats: { fought: 0, won: 0, lost: 0 },
    maneuverFrom: null,
    maneuversRemaining: 0,
  };
}

/**
 * Combat Reducer
 * @param {CombatState} state
 * @param {Object} action
 * @returns {CombatState}
 */
export default function combatReducer(state = getInitialCombatState(), action) {
  switch (action.type) {
    case SET_REINFORCEMENTS:
      console.log('combatReducer: SET_REINFORCEMENTS', {
        currentValue: state.reinforcementsRemaining,
        newValue: action.payload,
        fullState: state
      });
      return {
        ...state,
        reinforcementsRemaining: action.payload,
      };

    case USE_REINFORCEMENT:
      return {
        ...state,
        reinforcementsRemaining: Math.max(0, state.reinforcementsRemaining - 1),
      };

    case START_BATTLE:
      return {
        ...state,
        battleResult: action.payload,
        showBattleModal: true,
      };

    case RESOLVE_BATTLE:
      // Battle resolution is handled by action creators
      // This just updates the result
      return {
        ...state,
        battleResult: action.payload,
      };

    case DISMISS_BATTLE:
      return {
        ...state,
        battleResult: null,
        showBattleModal: false,
      };

    case UPDATE_BATTLE_STATS: {
      const { fought, won, lost } = action.payload;
      return {
        ...state,
        battleStats: {
          fought: state.battleStats.fought + (fought || 0),
          won: state.battleStats.won + (won || 0),
          lost: state.battleStats.lost + (lost || 0),
        },
      };
    }

    case START_MANEUVER:
      return {
        ...state,
        maneuverFrom: action.payload,
      };

    case EXECUTE_MANEUVER:
      // Maneuver execution is handled by action creators (updates map state)
      // This just clears the maneuver state and decrements count
      return {
        ...state,
        maneuverFrom: null,
        maneuversRemaining: Math.max(0, state.maneuversRemaining - 1),
      };

    case CANCEL_MANEUVER:
      return {
        ...state,
        maneuverFrom: null,
      };

    case USE_MANEUVER:
      return {
        ...state,
        maneuversRemaining: Math.max(0, state.maneuversRemaining - 1),
      };

    case SET_MANEUVERS:
      return {
        ...state,
        maneuversRemaining: action.payload,
      };

    case GAME_RESET:
      console.log('combatReducer: GAME_RESET - resetting to initial state');
      return getInitialCombatState();

    case LOAD_COMBAT_STATE:
      return {
        ...getInitialCombatState(),
        ...action.payload,
        battleResult: null,
        showBattleModal: false,
        maneuverFrom: null,
      };

    default:
      return state;
  }
}
