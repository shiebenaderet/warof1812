/**
 * AI Reducer - AI opponent actions and logs
 *
 * Handles: AI action logs, AI replay UI state
 */

import {
  ADD_AI_LOG,
  CLEAR_AI_LOG,
  SET_AI_ACTIONS,
  SHOW_AI_REPLAY,
  HIDE_AI_REPLAY,
  GAME_RESET,
  LOAD_AI_STATE,
} from './types';

/**
 * @typedef {Object} AIState
 * @property {string[]} aiLog - Log messages from AI turns
 * @property {Array} aiActions - Array of AI actions for replay
 * @property {boolean} showAIReplay - Whether to show AI replay UI
 */

/** @returns {AIState} */
export function getInitialAIState() {
  return {
    aiLog: [],
    aiActions: [],
    showAIReplay: false,
  };
}

/**
 * AI Reducer
 * @param {AIState} state
 * @param {Object} action
 * @returns {AIState}
 */
export default function aiReducer(state = getInitialAIState(), action) {
  switch (action.type) {
    case ADD_AI_LOG:
      return {
        ...state,
        aiLog: [...state.aiLog, action.payload],
      };

    case CLEAR_AI_LOG:
      return {
        ...state,
        aiLog: [],
      };

    case SET_AI_ACTIONS:
      return {
        ...state,
        aiActions: action.payload,
      };

    case SHOW_AI_REPLAY:
      return {
        ...state,
        showAIReplay: true,
      };

    case HIDE_AI_REPLAY:
      return {
        ...state,
        showAIReplay: false,
      };

    case GAME_RESET:
      return getInitialAIState();

    case LOAD_AI_STATE:
      return getInitialAIState();

    default:
      return state;
  }
}
