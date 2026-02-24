/**
 * Tests for knowledgeReducer
 */

import knowledgeReducer, { getInitialKnowledgeState } from '../knowledgeReducer';
import {
  DRAW_KNOWLEDGE_CHECK,
  SHOW_KNOWLEDGE_CHECK,
  HIDE_KNOWLEDGE_CHECK,
  ANSWER_KNOWLEDGE_CHECK,
  MARK_CHECK_USED,
  MARK_REQUIRED_CHECK_SEEN,
  GAME_RESET,
  LOAD_KNOWLEDGE_STATE,
} from '../types';

describe('knowledgeReducer', () => {
  describe('getInitialKnowledgeState', () => {
    it('returns correct initial state', () => {
      expect(getInitialKnowledgeState()).toEqual({
        currentKnowledgeCheck: null,
        showKnowledgeCheck: false,
        usedCheckIds: [],
        requiredChecksSeen: [],
        knowledgeCheckResults: { total: 0, correct: 0 },
        knowledgeCheckHistory: [],
      });
    });
  });

  describe('DRAW_KNOWLEDGE_CHECK', () => {
    it('sets current check', () => {
      const check = { id: 'q1', question: 'Who was Tecumseh?' };
      const state = knowledgeReducer(getInitialKnowledgeState(), {
        type: DRAW_KNOWLEDGE_CHECK,
        payload: check,
      });
      expect(state.currentKnowledgeCheck).toEqual(check);
    });
  });

  describe('SHOW/HIDE_KNOWLEDGE_CHECK', () => {
    it('toggles visibility', () => {
      let state = knowledgeReducer(getInitialKnowledgeState(), { type: SHOW_KNOWLEDGE_CHECK });
      expect(state.showKnowledgeCheck).toBe(true);
      state = knowledgeReducer(state, { type: HIDE_KNOWLEDGE_CHECK });
      expect(state.showKnowledgeCheck).toBe(false);
    });
  });

  describe('ANSWER_KNOWLEDGE_CHECK', () => {
    it('increments total and correct on correct answer', () => {
      const state = knowledgeReducer(getInitialKnowledgeState(), {
        type: ANSWER_KNOWLEDGE_CHECK,
        payload: { correct: true, checkData: { id: 'q1' } },
      });
      expect(state.knowledgeCheckResults).toEqual({ total: 1, correct: 1 });
      expect(state.knowledgeCheckHistory).toHaveLength(1);
      expect(state.knowledgeCheckHistory[0].correct).toBe(true);
    });

    it('increments total but not correct on wrong answer', () => {
      const state = knowledgeReducer(getInitialKnowledgeState(), {
        type: ANSWER_KNOWLEDGE_CHECK,
        payload: { correct: false, checkData: { id: 'q1' } },
      });
      expect(state.knowledgeCheckResults).toEqual({ total: 1, correct: 0 });
    });
  });

  describe('MARK_CHECK_USED', () => {
    it('tracks used check IDs', () => {
      let state = getInitialKnowledgeState();
      state = knowledgeReducer(state, { type: MARK_CHECK_USED, payload: 'q1' });
      state = knowledgeReducer(state, { type: MARK_CHECK_USED, payload: 'q2' });
      expect(state.usedCheckIds).toEqual(['q1', 'q2']);
    });
  });

  describe('MARK_REQUIRED_CHECK_SEEN', () => {
    it('tracks required checks', () => {
      const state = knowledgeReducer(getInitialKnowledgeState(), {
        type: MARK_REQUIRED_CHECK_SEEN,
        payload: 'req1',
      });
      expect(state.requiredChecksSeen).toEqual(['req1']);
    });
  });

  describe('GAME_RESET', () => {
    it('resets to initial state', () => {
      const dirty = {
        currentKnowledgeCheck: { id: 'q1' },
        showKnowledgeCheck: true,
        usedCheckIds: ['q1'],
        requiredChecksSeen: ['req1'],
        knowledgeCheckResults: { total: 5, correct: 3 },
        knowledgeCheckHistory: [{ id: 'q1', correct: true }],
      };
      expect(knowledgeReducer(dirty, { type: GAME_RESET })).toEqual(getInitialKnowledgeState());
    });
  });

  describe('LOAD_KNOWLEDGE_STATE', () => {
    it('loads saved state while resetting transient UI', () => {
      const state = knowledgeReducer(getInitialKnowledgeState(), {
        type: LOAD_KNOWLEDGE_STATE,
        payload: {
          usedCheckIds: ['q1', 'q2'],
          requiredChecksSeen: ['req1'],
          knowledgeCheckResults: { total: 3, correct: 2 },
          knowledgeCheckHistory: [{ id: 'q1', correct: true }],
          currentKnowledgeCheck: { shouldBeCleared: true },
          showKnowledgeCheck: true,
        },
      });
      expect(state.usedCheckIds).toEqual(['q1', 'q2']);
      expect(state.knowledgeCheckResults).toEqual({ total: 3, correct: 2 });
      expect(state.currentKnowledgeCheck).toBeNull();
      expect(state.showKnowledgeCheck).toBe(false);
    });
  });
});
