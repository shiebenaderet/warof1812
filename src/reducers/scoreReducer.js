/**
 * Score Reducer - Scoring and faction-specific meters
 *
 * Handles: faction scores, nationalism meter (US-specific)
 */

import {
  UPDATE_SCORES,
  DELTA_NATIONALISM,
  SET_NATIONALISM,
  GAME_RESET,
  LOAD_SCORE_STATE,
} from './types';

/**
 * @typedef {Object} ScoreState
 * @property {Object} scores - { us: number, british: number, native: number }
 * @property {number} nationalismMeter - 0-100, US faction mechanic
 */

/** @returns {ScoreState} */
export function getInitialScoreState() {
  return {
    scores: { us: 0, british: 0, native: 0 },
    nationalismMeter: 0,
  };
}

/**
 * Score Reducer
 * @param {ScoreState} state
 * @param {Object} action
 * @returns {ScoreState}
 */
export default function scoreReducer(state = getInitialScoreState(), action) {
  switch (action.type) {
    case UPDATE_SCORES:
      return {
        ...state,
        scores: {
          ...state.scores,
          ...action.payload,
        },
      };

    case DELTA_NATIONALISM: {
      const newValue = state.nationalismMeter + action.payload;
      return {
        ...state,
        nationalismMeter: Math.max(0, Math.min(100, newValue)),
      };
    }

    case SET_NATIONALISM:
      return {
        ...state,
        nationalismMeter: Math.max(0, Math.min(100, action.payload)),
      };

    case GAME_RESET:
      return getInitialScoreState();

    case LOAD_SCORE_STATE:
      return {
        ...getInitialScoreState(),
        ...action.payload,
      };

    default:
      return state;
  }
}
