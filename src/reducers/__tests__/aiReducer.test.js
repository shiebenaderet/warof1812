/**
 * Tests for aiReducer
 */

import aiReducer, { getInitialAIState } from '../aiReducer';
import {
  ADD_AI_LOG,
  CLEAR_AI_LOG,
  SET_AI_ACTIONS,
  SHOW_AI_REPLAY,
  HIDE_AI_REPLAY,
  GAME_RESET,
  LOAD_AI_STATE,
} from '../types';

describe('aiReducer', () => {
  describe('getInitialAIState', () => {
    it('returns correct initial state', () => {
      expect(getInitialAIState()).toEqual({
        aiLog: [],
        aiActions: [],
        showAIReplay: false,
      });
    });
  });

  describe('ADD_AI_LOG', () => {
    it('appends log entry', () => {
      let state = getInitialAIState();
      state = aiReducer(state, { type: ADD_AI_LOG, payload: 'British captures York' });
      state = aiReducer(state, { type: ADD_AI_LOG, payload: 'Native attacks Detroit' });
      expect(state.aiLog).toEqual(['British captures York', 'Native attacks Detroit']);
    });
  });

  describe('CLEAR_AI_LOG', () => {
    it('clears all log entries', () => {
      const state = aiReducer(
        { ...getInitialAIState(), aiLog: ['entry1', 'entry2'] },
        { type: CLEAR_AI_LOG }
      );
      expect(state.aiLog).toEqual([]);
    });
  });

  describe('SET_AI_ACTIONS', () => {
    it('sets actions array', () => {
      const actions = [{ type: 'reinforce', territory: 'York' }];
      const state = aiReducer(getInitialAIState(), {
        type: SET_AI_ACTIONS,
        payload: actions,
      });
      expect(state.aiActions).toEqual(actions);
    });
  });

  describe('SHOW/HIDE_AI_REPLAY', () => {
    it('toggles replay visibility', () => {
      let state = aiReducer(getInitialAIState(), { type: SHOW_AI_REPLAY });
      expect(state.showAIReplay).toBe(true);
      state = aiReducer(state, { type: HIDE_AI_REPLAY });
      expect(state.showAIReplay).toBe(false);
    });
  });

  describe('GAME_RESET', () => {
    it('resets to initial state', () => {
      const dirty = { aiLog: ['x'], aiActions: [{ type: 'attack' }], showAIReplay: true };
      expect(aiReducer(dirty, { type: GAME_RESET })).toEqual(getInitialAIState());
    });
  });

  describe('LOAD_AI_STATE', () => {
    it('resets to initial (AI state is transient)', () => {
      const state = aiReducer(
        { aiLog: ['old'], aiActions: [{}], showAIReplay: true },
        { type: LOAD_AI_STATE }
      );
      expect(state).toEqual(getInitialAIState());
    });
  });
});
