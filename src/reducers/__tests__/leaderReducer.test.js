/**
 * Tests for leaderReducer
 */

import leaderReducer, { getInitialLeaderState } from '../leaderReducer';
import {
  KILL_LEADER,
  REVIVE_LEADER,
  GAME_RESET,
  LOAD_LEADER_STATE,
} from '../types';

describe('leaderReducer', () => {
  describe('getInitialLeaderState', () => {
    it('returns leader states object', () => {
      const initial = getInitialLeaderState();
      expect(initial.leaderStates).toBeDefined();
      expect(typeof initial.leaderStates).toBe('object');
      // All leaders should start alive
      for (const leader of Object.values(initial.leaderStates)) {
        expect(leader.alive).toBe(true);
      }
    });
  });

  describe('KILL_LEADER', () => {
    it('marks leader as dead', () => {
      const initial = getInitialLeaderState();
      const leaderId = Object.keys(initial.leaderStates)[0];
      const state = leaderReducer(initial, {
        type: KILL_LEADER,
        payload: leaderId,
      });
      expect(state.leaderStates[leaderId].alive).toBe(false);
    });
  });

  describe('REVIVE_LEADER', () => {
    it('marks leader as alive', () => {
      const initial = getInitialLeaderState();
      const leaderId = Object.keys(initial.leaderStates)[0];
      // Kill then revive
      let state = leaderReducer(initial, { type: KILL_LEADER, payload: leaderId });
      expect(state.leaderStates[leaderId].alive).toBe(false);
      state = leaderReducer(state, { type: REVIVE_LEADER, payload: leaderId });
      expect(state.leaderStates[leaderId].alive).toBe(true);
    });
  });

  describe('GAME_RESET', () => {
    it('resets all leaders to initial state', () => {
      const initial = getInitialLeaderState();
      const leaderId = Object.keys(initial.leaderStates)[0];
      const dirty = leaderReducer(initial, { type: KILL_LEADER, payload: leaderId });
      const state = leaderReducer(dirty, { type: GAME_RESET });
      expect(state.leaderStates[leaderId].alive).toBe(true);
    });
  });

  describe('LOAD_LEADER_STATE', () => {
    it('merges saved leader states over initial', () => {
      const initial = getInitialLeaderState();
      const leaderId = Object.keys(initial.leaderStates)[0];
      const state = leaderReducer(initial, {
        type: LOAD_LEADER_STATE,
        payload: {
          leaderStates: { [leaderId]: { alive: false } },
        },
      });
      expect(state.leaderStates[leaderId].alive).toBe(false);
      // Other leaders remain alive
      const otherLeaders = Object.keys(state.leaderStates).filter(id => id !== leaderId);
      for (const id of otherLeaders) {
        expect(state.leaderStates[id].alive).toBe(true);
      }
    });
  });
});
