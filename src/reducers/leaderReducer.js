/**
 * Leader Reducer - Leader alive/dead states
 *
 * Handles: leader states (Jackson, Tecumseh, Brock, etc.)
 */

import leadersData from '../data/leaders';
import {
  KILL_LEADER,
  REVIVE_LEADER,
  GAME_RESET,
} from './types';

/**
 * @typedef {Object} LeaderState
 * @property {Record<string, { alive: boolean }>} leaderStates - Map of leaderId -> { alive }
 */

function initLeaderStates() {
  const states = {};
  for (const [id, leader] of Object.entries(leadersData)) {
    states[id] = { alive: leader.alive };
  }
  return states;
}

/** @returns {LeaderState} */
export function getInitialLeaderState() {
  return {
    leaderStates: initLeaderStates(),
  };
}

/**
 * Leader Reducer
 * @param {LeaderState} state
 * @param {Object} action
 * @returns {LeaderState}
 */
export default function leaderReducer(state = getInitialLeaderState(), action) {
  switch (action.type) {
    case KILL_LEADER:
      return {
        ...state,
        leaderStates: {
          ...state.leaderStates,
          [action.payload]: { alive: false },
        },
      };

    case REVIVE_LEADER:
      return {
        ...state,
        leaderStates: {
          ...state.leaderStates,
          [action.payload]: { alive: true },
        },
      };

    case GAME_RESET:
      return getInitialLeaderState();

    default:
      return state;
  }
}
