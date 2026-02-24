/**
 * History Reducer - Undo/redo, journal entries, pending actions
 *
 * Handles: game history, journal, phase snapshots, pending confirmations
 */

import {
  ADD_JOURNAL_ENTRY,
  SAVE_PHASE_SNAPSHOT,
  SET_PENDING_ADVANCE,
  CLEAR_PENDING_ADVANCE,
  SET_PENDING_ACTION,
  CLEAR_PENDING_ACTION,
  SAVE_ACTION_SNAPSHOT,
  REMOVE_LAST_ACTION,
  GAME_RESET,
  LOAD_HISTORY_STATE,
} from './types';

/**
 * @typedef {Object} HistoryState
 * @property {Array} journalEntries - Game timeline entries
 * @property {Array} phaseHistory - Snapshots for undo
 * @property {boolean} pendingAdvance - Whether phase advance is pending confirmation
 * @property {string} pendingAdvanceMessage - Message for pending advance
 * @property {Object | null} pendingAction - Pending action requiring confirmation
 * @property {Array} actionHistory - History of actions for replay/undo
 */

/** @returns {HistoryState} */
export function getInitialHistoryState() {
  return {
    journalEntries: [],
    phaseHistory: [],
    pendingAdvance: false,
    pendingAdvanceMessage: '',
    pendingAction: null,
    actionHistory: [],
  };
}

/**
 * History Reducer
 * @param {HistoryState} state
 * @param {Object} action
 * @returns {HistoryState}
 */
export default function historyReducer(state = getInitialHistoryState(), action) {
  switch (action.type) {
    case ADD_JOURNAL_ENTRY:
      return {
        ...state,
        journalEntries: [...state.journalEntries, action.payload],
      };

    case SAVE_PHASE_SNAPSHOT:
      return {
        ...state,
        phaseHistory: [...state.phaseHistory, action.payload],
      };

    case SET_PENDING_ADVANCE:
      return {
        ...state,
        pendingAdvance: true,
        pendingAdvanceMessage: action.payload || '',
      };

    case CLEAR_PENDING_ADVANCE:
      return {
        ...state,
        pendingAdvance: false,
        pendingAdvanceMessage: '',
      };

    case SET_PENDING_ACTION:
      return {
        ...state,
        pendingAction: action.payload,
      };

    case CLEAR_PENDING_ACTION:
      return {
        ...state,
        pendingAction: null,
      };

    case SAVE_ACTION_SNAPSHOT:
      return {
        ...state,
        actionHistory: [...state.actionHistory, action.payload],
      };

    case REMOVE_LAST_ACTION:
      return {
        ...state,
        actionHistory: state.actionHistory.slice(0, -1),
      };

    case GAME_RESET:
      return getInitialHistoryState();

    case LOAD_HISTORY_STATE:
      return {
        ...getInitialHistoryState(),
        journalEntries: action.payload.journalEntries || [],
      };

    default:
      return state;
  }
}
