/**
 * Tests for historyReducer
 */

import historyReducer, { getInitialHistoryState } from '../historyReducer';
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
} from '../types';

describe('historyReducer', () => {
  describe('getInitialHistoryState', () => {
    it('returns correct initial state', () => {
      expect(getInitialHistoryState()).toEqual({
        journalEntries: [],
        phaseHistory: [],
        pendingAdvance: false,
        pendingAdvanceMessage: '',
        pendingAction: null,
        actionHistory: [],
      });
    });
  });

  describe('ADD_JOURNAL_ENTRY', () => {
    it('appends journal entries', () => {
      let state = getInitialHistoryState();
      state = historyReducer(state, { type: ADD_JOURNAL_ENTRY, payload: { round: 1, text: 'War begins' } });
      state = historyReducer(state, { type: ADD_JOURNAL_ENTRY, payload: { round: 2, text: 'Battle of York' } });
      expect(state.journalEntries).toHaveLength(2);
      expect(state.journalEntries[0].text).toBe('War begins');
    });
  });

  describe('SAVE_PHASE_SNAPSHOT', () => {
    it('saves phase snapshot for undo', () => {
      const snapshot = { phase: 'allocate', troops: {} };
      const state = historyReducer(getInitialHistoryState(), {
        type: SAVE_PHASE_SNAPSHOT,
        payload: snapshot,
      });
      expect(state.phaseHistory).toEqual([snapshot]);
    });
  });

  describe('pending advance', () => {
    it('SET_PENDING_ADVANCE sets flag and message', () => {
      const state = historyReducer(getInitialHistoryState(), {
        type: SET_PENDING_ADVANCE,
        payload: 'Confirm advance to battle phase?',
      });
      expect(state.pendingAdvance).toBe(true);
      expect(state.pendingAdvanceMessage).toBe('Confirm advance to battle phase?');
    });

    it('CLEAR_PENDING_ADVANCE resets', () => {
      const state = historyReducer(
        { ...getInitialHistoryState(), pendingAdvance: true, pendingAdvanceMessage: 'msg' },
        { type: CLEAR_PENDING_ADVANCE }
      );
      expect(state.pendingAdvance).toBe(false);
      expect(state.pendingAdvanceMessage).toBe('');
    });
  });

  describe('pending action', () => {
    it('SET_PENDING_ACTION sets action', () => {
      const action = { type: 'placement', territoryId: 'detroit' };
      const state = historyReducer(getInitialHistoryState(), {
        type: SET_PENDING_ACTION,
        payload: action,
      });
      expect(state.pendingAction).toEqual(action);
    });

    it('CLEAR_PENDING_ACTION clears', () => {
      const state = historyReducer(
        { ...getInitialHistoryState(), pendingAction: { type: 'placement' } },
        { type: CLEAR_PENDING_ACTION }
      );
      expect(state.pendingAction).toBeNull();
    });
  });

  describe('action history', () => {
    it('SAVE_ACTION_SNAPSHOT appends', () => {
      const state = historyReducer(getInitialHistoryState(), {
        type: SAVE_ACTION_SNAPSHOT,
        payload: { type: 'placement', territoryId: 'detroit' },
      });
      expect(state.actionHistory).toHaveLength(1);
    });

    it('REMOVE_LAST_ACTION pops', () => {
      const state = historyReducer(
        { ...getInitialHistoryState(), actionHistory: [{ a: 1 }, { b: 2 }] },
        { type: REMOVE_LAST_ACTION }
      );
      expect(state.actionHistory).toEqual([{ a: 1 }]);
    });

    it('REMOVE_LAST_ACTION on empty is safe', () => {
      const state = historyReducer(getInitialHistoryState(), { type: REMOVE_LAST_ACTION });
      expect(state.actionHistory).toEqual([]);
    });
  });

  describe('GAME_RESET', () => {
    it('resets to initial state', () => {
      const dirty = {
        journalEntries: [{ text: 'x' }],
        phaseHistory: [{}],
        pendingAdvance: true,
        pendingAdvanceMessage: 'msg',
        pendingAction: { type: 'placement' },
        actionHistory: [{}],
      };
      expect(historyReducer(dirty, { type: GAME_RESET })).toEqual(getInitialHistoryState());
    });
  });

  describe('LOAD_HISTORY_STATE', () => {
    it('loads journal entries, resets transient state', () => {
      const entries = [{ round: 1, text: 'War begins' }];
      const state = historyReducer(getInitialHistoryState(), {
        type: LOAD_HISTORY_STATE,
        payload: { journalEntries: entries },
      });
      expect(state.journalEntries).toEqual(entries);
      expect(state.phaseHistory).toEqual([]);
      expect(state.pendingAdvance).toBe(false);
      expect(state.pendingAction).toBeNull();
    });
  });
});
