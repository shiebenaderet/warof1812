/**
 * Event Reducer - Event card system
 *
 * Handles: event cards, event UI state, invulnerable territories (Fort McHenry mechanic)
 */

import {
  DRAW_EVENT,
  SHOW_EVENT_CARD,
  HIDE_EVENT_CARD,
  MARK_EVENT_USED,
  ADD_INVULNERABLE_TERRITORY,
  CLEAR_INVULNERABLE_TERRITORIES,
  GAME_RESET,
} from './types';

/**
 * @typedef {Object} EventState
 * @property {Object | null} currentEvent - Current event card data
 * @property {string[]} usedEventIds - IDs of events already drawn
 * @property {boolean} showEventCard - Whether to show event UI
 * @property {string[]} invulnerableTerritories - Territories immune to capture this round
 */

/** @returns {EventState} */
export function getInitialEventState() {
  return {
    currentEvent: null,
    usedEventIds: [],
    showEventCard: false,
    invulnerableTerritories: [],
  };
}

/**
 * Event Reducer
 * @param {EventState} state
 * @param {Object} action
 * @returns {EventState}
 */
export default function eventReducer(state = getInitialEventState(), action) {
  switch (action.type) {
    case DRAW_EVENT:
      return {
        ...state,
        currentEvent: action.payload,
      };

    case SHOW_EVENT_CARD:
      return {
        ...state,
        showEventCard: true,
      };

    case HIDE_EVENT_CARD:
      return {
        ...state,
        showEventCard: false,
      };

    case MARK_EVENT_USED:
      return {
        ...state,
        usedEventIds: [...state.usedEventIds, action.payload],
      };

    case ADD_INVULNERABLE_TERRITORY:
      if (state.invulnerableTerritories.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        invulnerableTerritories: [
          ...state.invulnerableTerritories,
          action.payload,
        ],
      };

    case CLEAR_INVULNERABLE_TERRITORIES:
      return {
        ...state,
        invulnerableTerritories: [],
      };

    case GAME_RESET:
      return getInitialEventState();

    default:
      return state;
  }
}
