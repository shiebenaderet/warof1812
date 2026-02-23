/**
 * Tests for gameReducer
 */

import gameReducer, { getInitialGameState } from '../gameReducer';
import {
  GAME_START,
  GAME_OVER,
  GAME_RESET,
  SET_PLAYER_INFO,
  ADVANCE_PHASE,
  ADVANCE_ROUND,
  SET_MESSAGE,
  HIDE_INTRO,
} from '../types';

describe('gameReducer', () => {
  describe('getInitialGameState', () => {
    it('returns correct initial state', () => {
      const initial = getInitialGameState();
      expect(initial).toEqual({
        status: 'not_started',
        playerFaction: null,
        playerName: '',
        classPeriod: '',
        round: 1,
        phase: 'event',
        message: 'Welcome to the War of 1812',
        showIntro: true,
      });
    });
  });

  describe('GAME_START', () => {
    it('starts game with player info', () => {
      const initial = getInitialGameState();
      const action = {
        type: GAME_START,
        payload: {
          faction: 'us',
          name: 'Commander Jackson',
          period: 'Period 3',
        },
      };

      const result = gameReducer(initial, action);

      expect(result.status).toBe('in_progress');
      expect(result.playerFaction).toBe('us');
      expect(result.playerName).toBe('Commander Jackson');
      expect(result.classPeriod).toBe('Period 3');
      expect(result.round).toBe(1);
      expect(result.phase).toBe('event');
      expect(result.message).toContain('Commander Jackson');
    });

    it('works for all factions', () => {
      const factions = ['us', 'british', 'native'];
      factions.forEach((faction) => {
        const result = gameReducer(getInitialGameState(), {
          type: GAME_START,
          payload: { faction, name: 'Test', period: 'P1' },
        });
        expect(result.playerFaction).toBe(faction);
      });
    });
  });

  describe('GAME_OVER', () => {
    it('sets status to game_over', () => {
      const state = { ...getInitialGameState(), status: 'in_progress' };
      const result = gameReducer(state, { type: GAME_OVER });

      expect(result.status).toBe('game_over');
    });

    it('accepts custom message', () => {
      const state = { ...getInitialGameState(), status: 'in_progress' };
      const result = gameReducer(state, {
        type: GAME_OVER,
        payload: { message: 'Victory!' },
      });

      expect(result.message).toBe('Victory!');
    });

    it('uses default message if none provided', () => {
      const state = { ...getInitialGameState(), status: 'in_progress' };
      const result = gameReducer(state, { type: GAME_OVER });

      expect(result.message).toContain('War of 1812 has ended');
    });
  });

  describe('GAME_RESET', () => {
    it('resets to initial state', () => {
      const state = {
        status: 'game_over',
        playerFaction: 'us',
        playerName: 'Test',
        classPeriod: 'P1',
        round: 12,
        phase: 'score',
        message: 'Game over',
        showIntro: false,
      };

      const result = gameReducer(state, { type: GAME_RESET });

      expect(result).toEqual(getInitialGameState());
    });
  });

  describe('SET_PLAYER_INFO', () => {
    it('updates player info', () => {
      const state = getInitialGameState();
      const result = gameReducer(state, {
        type: SET_PLAYER_INFO,
        payload: {
          name: 'New Name',
          period: 'Period 5',
          faction: 'british',
        },
      });

      expect(result.playerName).toBe('New Name');
      expect(result.classPeriod).toBe('Period 5');
      expect(result.playerFaction).toBe('british');
    });

    it('partially updates player info', () => {
      const state = {
        ...getInitialGameState(),
        playerName: 'Original',
        classPeriod: 'P1',
        playerFaction: 'us',
      };

      const result = gameReducer(state, {
        type: SET_PLAYER_INFO,
        payload: { name: 'Updated' },
      });

      expect(result.playerName).toBe('Updated');
      expect(result.classPeriod).toBe('P1'); // unchanged
      expect(result.playerFaction).toBe('us'); // unchanged
    });
  });

  describe('ADVANCE_PHASE', () => {
    it('advances through phases in order', () => {
      const phases = ['event', 'allocate', 'battle', 'maneuver', 'score'];

      let state = { ...getInitialGameState(), phase: 'event' };

      phases.forEach((expectedPhase, i) => {
        expect(state.phase).toBe(expectedPhase);
        if (i < phases.length - 1) {
          state = gameReducer(state, { type: ADVANCE_PHASE });
        }
      });
    });

    it('advances round when wrapping from score to event', () => {
      const state = { ...getInitialGameState(), phase: 'score', round: 1 };
      const result = gameReducer(state, { type: ADVANCE_PHASE });

      expect(result.phase).toBe('event');
      expect(result.round).toBe(2);
    });

    it('ends game after round 12', () => {
      const state = { ...getInitialGameState(), phase: 'score', round: 12 };
      const result = gameReducer(state, { type: ADVANCE_PHASE });

      expect(result.status).toBe('game_over');
      expect(result.message).toContain('Treaty of Ghent');
    });

    it('accepts custom message', () => {
      const state = { ...getInitialGameState(), phase: 'event' };
      const result = gameReducer(state, {
        type: ADVANCE_PHASE,
        payload: { message: 'Custom phase message' },
      });

      expect(result.message).toBe('Custom phase message');
    });
  });

  describe('ADVANCE_ROUND', () => {
    it('increments round and resets to event phase', () => {
      const state = { ...getInitialGameState(), round: 5, phase: 'score' };
      const result = gameReducer(state, { type: ADVANCE_ROUND });

      expect(result.round).toBe(6);
      expect(result.phase).toBe('event');
    });

    it('ends game if already at round 12', () => {
      const state = { ...getInitialGameState(), round: 12 };
      const result = gameReducer(state, { type: ADVANCE_ROUND });

      expect(result.status).toBe('game_over');
      expect(result.message).toContain('Treaty of Ghent');
    });
  });

  describe('SET_MESSAGE', () => {
    it('updates message', () => {
      const state = getInitialGameState();
      const result = gameReducer(state, {
        type: SET_MESSAGE,
        payload: 'New message!',
      });

      expect(result.message).toBe('New message!');
    });
  });

  describe('HIDE_INTRO', () => {
    it('hides intro screen', () => {
      const state = { ...getInitialGameState(), showIntro: true };
      const result = gameReducer(state, { type: HIDE_INTRO });

      expect(result.showIntro).toBe(false);
    });
  });

  describe('unknown action', () => {
    it('returns current state unchanged', () => {
      const state = getInitialGameState();
      const result = gameReducer(state, { type: 'UNKNOWN_ACTION' });

      expect(result).toBe(state);
    });
  });
});
