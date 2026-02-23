/**
 * Knowledge Reducer - Quiz/knowledge check system
 *
 * Handles: knowledge checks, quiz results, check history
 */

import {
  DRAW_KNOWLEDGE_CHECK,
  SHOW_KNOWLEDGE_CHECK,
  HIDE_KNOWLEDGE_CHECK,
  ANSWER_KNOWLEDGE_CHECK,
  MARK_CHECK_USED,
  MARK_REQUIRED_CHECK_SEEN,
  GAME_RESET,
} from './types';

/**
 * @typedef {Object} KnowledgeState
 * @property {Object | null} currentKnowledgeCheck - Current quiz question
 * @property {boolean} showKnowledgeCheck - Whether to show quiz UI
 * @property {string[]} usedCheckIds - IDs of checks already shown
 * @property {string[]} requiredChecksSeen - Required checks the player has seen
 * @property {Object} knowledgeCheckResults - { total: number, correct: number }
 * @property {Array} knowledgeCheckHistory - Array of past check results
 */

/** @returns {KnowledgeState} */
export function getInitialKnowledgeState() {
  return {
    currentKnowledgeCheck: null,
    showKnowledgeCheck: false,
    usedCheckIds: [],
    requiredChecksSeen: [],
    knowledgeCheckResults: { total: 0, correct: 0 },
    knowledgeCheckHistory: [],
  };
}

/**
 * Knowledge Reducer
 * @param {KnowledgeState} state
 * @param {Object} action
 * @returns {KnowledgeState}
 */
export default function knowledgeReducer(state = getInitialKnowledgeState(), action) {
  switch (action.type) {
    case DRAW_KNOWLEDGE_CHECK:
      return {
        ...state,
        currentKnowledgeCheck: action.payload,
      };

    case SHOW_KNOWLEDGE_CHECK:
      return {
        ...state,
        showKnowledgeCheck: true,
      };

    case HIDE_KNOWLEDGE_CHECK:
      return {
        ...state,
        showKnowledgeCheck: false,
      };

    case ANSWER_KNOWLEDGE_CHECK: {
      const { correct, checkData } = action.payload;
      return {
        ...state,
        knowledgeCheckResults: {
          total: state.knowledgeCheckResults.total + 1,
          correct: state.knowledgeCheckResults.correct + (correct ? 1 : 0),
        },
        knowledgeCheckHistory: [
          ...state.knowledgeCheckHistory,
          {
            ...checkData,
            correct,
            timestamp: Date.now(),
          },
        ],
      };
    }

    case MARK_CHECK_USED:
      return {
        ...state,
        usedCheckIds: [...state.usedCheckIds, action.payload],
      };

    case MARK_REQUIRED_CHECK_SEEN:
      return {
        ...state,
        requiredChecksSeen: [...state.requiredChecksSeen, action.payload],
      };

    case GAME_RESET:
      return getInitialKnowledgeState();

    default:
      return state;
  }
}
