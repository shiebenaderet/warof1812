/**
 * Tests for scoreReducer
 */

import scoreReducer, { getInitialScoreState } from '../scoreReducer';
import {
  UPDATE_SCORES,
  DELTA_NATIONALISM,
  SET_NATIONALISM,
  GAME_RESET,
  LOAD_SCORE_STATE,
} from '../types';

describe('scoreReducer', () => {
  describe('getInitialScoreState', () => {
    it('returns correct initial state', () => {
      expect(getInitialScoreState()).toEqual({
        scores: { us: 0, british: 0, native: 0 },
        nationalismMeter: 0,
      });
    });
  });

  describe('UPDATE_SCORES', () => {
    it('merges new scores', () => {
      const state = scoreReducer(getInitialScoreState(), {
        type: UPDATE_SCORES,
        payload: { us: 10, british: 8 },
      });
      expect(state.scores).toEqual({ us: 10, british: 8, native: 0 });
    });
  });

  describe('DELTA_NATIONALISM', () => {
    it('increases nationalism', () => {
      const state = scoreReducer(
        { ...getInitialScoreState(), nationalismMeter: 50 },
        { type: DELTA_NATIONALISM, payload: 10 }
      );
      expect(state.nationalismMeter).toBe(60);
    });

    it('clamps at 0', () => {
      const state = scoreReducer(
        { ...getInitialScoreState(), nationalismMeter: 5 },
        { type: DELTA_NATIONALISM, payload: -20 }
      );
      expect(state.nationalismMeter).toBe(0);
    });

    it('clamps at 100', () => {
      const state = scoreReducer(
        { ...getInitialScoreState(), nationalismMeter: 95 },
        { type: DELTA_NATIONALISM, payload: 20 }
      );
      expect(state.nationalismMeter).toBe(100);
    });
  });

  describe('SET_NATIONALISM', () => {
    it('sets nationalism with clamping', () => {
      const state = scoreReducer(getInitialScoreState(), {
        type: SET_NATIONALISM,
        payload: 75,
      });
      expect(state.nationalismMeter).toBe(75);
    });

    it('clamps above 100', () => {
      const state = scoreReducer(getInitialScoreState(), {
        type: SET_NATIONALISM,
        payload: 150,
      });
      expect(state.nationalismMeter).toBe(100);
    });
  });

  describe('GAME_RESET', () => {
    it('resets to initial state', () => {
      const dirty = { scores: { us: 50, british: 30, native: 20 }, nationalismMeter: 80 };
      expect(scoreReducer(dirty, { type: GAME_RESET })).toEqual(getInitialScoreState());
    });
  });

  describe('LOAD_SCORE_STATE', () => {
    it('loads saved scores and nationalism', () => {
      const state = scoreReducer(getInitialScoreState(), {
        type: LOAD_SCORE_STATE,
        payload: { scores: { us: 25, british: 15, native: 10 }, nationalismMeter: 40 },
      });
      expect(state.scores).toEqual({ us: 25, british: 15, native: 10 });
      expect(state.nationalismMeter).toBe(40);
    });
  });
});
