/**
 * Game Reducer - Core game flow and metadata
 *
 * Handles: game status, player info, rounds, phases, UI messages
 */

import {
  GAME_START,
  GAME_OVER,
  GAME_RESET,
  SET_PLAYER_INFO,
  ADVANCE_PHASE,
  ADVANCE_ROUND,
  SET_MESSAGE,
  HIDE_INTRO,
} from './types';

const PHASES = ['event', 'allocate', 'battle', 'maneuver', 'score'];
const TOTAL_ROUNDS = 12;

/**
 * @typedef {Object} GameState
 * @property {'not_started' | 'in_progress' | 'game_over'} status
 * @property {string | null} playerFaction - 'us' | 'british' | 'native'
 * @property {string} playerName
 * @property {string} classPeriod
 * @property {number} round - 1-12
 * @property {string} phase - 'event' | 'allocate' | 'battle' | 'maneuver' | 'score'
 * @property {string} message - UI feedback message
 * @property {boolean} showIntro
 */

/** @returns {GameState} */
export function getInitialGameState() {
  return {
    status: 'not_started',
    playerFaction: null,
    playerName: '',
    classPeriod: '',
    round: 1,
    phaseIndex: 0, // 0 = 'event', 1 = 'allocate', 2 = 'battle', 3 = 'maneuver', 4 = 'score'
    message: 'Welcome to the War of 1812',
    showIntro: true,
  };
}

/**
 * Game Reducer
 * @param {GameState} state
 * @param {Object} action
 * @returns {GameState}
 */
export default function gameReducer(state = getInitialGameState(), action) {
  switch (action.type) {
    case GAME_START:
      return {
        ...state,
        status: 'in_progress',
        playerFaction: action.payload.faction,
        playerName: action.payload.name,
        classPeriod: action.payload.period,
        round: 1,
        phaseIndex: 0, // Start at 'event' phase
        message: `${action.payload.name}, you command the ${getFactionName(action.payload.faction)}!`,
      };

    case GAME_OVER:
      return {
        ...state,
        status: 'game_over',
        message: action.payload?.message || 'The War of 1812 has ended.',
      };

    case GAME_RESET:
      return getInitialGameState();

    case SET_PLAYER_INFO:
      return {
        ...state,
        playerName: action.payload.name ?? state.playerName,
        classPeriod: action.payload.period ?? state.classPeriod,
        playerFaction: action.payload.faction ?? state.playerFaction,
      };

    case ADVANCE_PHASE: {
      // Support direct phase override for undo functionality
      if (action.payload?.overridePhaseIndex !== undefined) {
        const targetPhaseIndex = action.payload.overridePhaseIndex;
        return {
          ...state,
          phaseIndex: targetPhaseIndex,
          message: action.payload?.message || getPhaseMessage(PHASES[targetPhaseIndex]),
        };
      }

      // Normal phase advancement logic
      const nextPhaseIndex = (state.phaseIndex + 1) % PHASES.length;
      const nextPhase = PHASES[nextPhaseIndex];

      // If we wrapped around to 'event', advance the round
      if (nextPhaseIndex === 0 && state.round < TOTAL_ROUNDS) {
        return {
          ...state,
          phaseIndex: nextPhaseIndex,
          round: state.round + 1,
          message: action.payload?.message || `Round ${state.round + 1} begins`,
        };
      }

      // Check for game over
      if (nextPhaseIndex === 0 && state.round >= TOTAL_ROUNDS) {
        return {
          ...state,
          status: 'game_over',
          message: 'The Treaty of Ghent has been signed. The war is over!',
        };
      }

      return {
        ...state,
        phaseIndex: nextPhaseIndex,
        message: action.payload?.message || getPhaseMessage(nextPhase),
      };
    }

    case ADVANCE_ROUND:
      if (state.round >= TOTAL_ROUNDS) {
        return {
          ...state,
          status: 'game_over',
          message: 'The Treaty of Ghent has been signed. The war is over!',
        };
      }
      return {
        ...state,
        round: state.round + 1,
        phaseIndex: 0, // Reset to 'event' phase
        message: action.payload?.message || `Round ${state.round + 1} begins`,
      };

    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };

    case HIDE_INTRO:
      return {
        ...state,
        showIntro: false,
      };

    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════

function getFactionName(faction) {
  const names = {
    us: 'United States of America',
    british: 'British Empire and Canadian forces',
    native: 'Native American Confederacy',
  };
  return names[faction] || faction;
}

function getPhaseMessage(phase) {
  const messages = {
    event: 'A new event unfolds...',
    allocate: 'Place your reinforcements',
    battle: 'Time for battle!',
    maneuver: 'Reposition your forces',
    score: 'Calculating scores...',
  };
  return messages[phase] || '';
}
