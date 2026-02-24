/**
 * Tests for eventReducer
 */

import eventReducer, { getInitialEventState } from '../eventReducer';
import {
  DRAW_EVENT,
  SHOW_EVENT_CARD,
  HIDE_EVENT_CARD,
  MARK_EVENT_USED,
  ADD_INVULNERABLE_TERRITORY,
  CLEAR_INVULNERABLE_TERRITORIES,
  GAME_RESET,
  LOAD_EVENT_STATE,
} from '../types';

describe('eventReducer', () => {
  describe('getInitialEventState', () => {
    it('returns correct initial state', () => {
      expect(getInitialEventState()).toEqual({
        currentEvent: null,
        usedEventIds: [],
        showEventCard: false,
        invulnerableTerritories: [],
      });
    });
  });

  describe('DRAW_EVENT', () => {
    it('sets current event', () => {
      const event = { id: 'e1', title: 'Battle of York' };
      const state = eventReducer(getInitialEventState(), {
        type: DRAW_EVENT,
        payload: event,
      });
      expect(state.currentEvent).toEqual(event);
    });
  });

  describe('SHOW/HIDE_EVENT_CARD', () => {
    it('toggles event card visibility', () => {
      let state = eventReducer(getInitialEventState(), { type: SHOW_EVENT_CARD });
      expect(state.showEventCard).toBe(true);
      state = eventReducer(state, { type: HIDE_EVENT_CARD });
      expect(state.showEventCard).toBe(false);
    });
  });

  describe('MARK_EVENT_USED', () => {
    it('tracks used event IDs', () => {
      let state = getInitialEventState();
      state = eventReducer(state, { type: MARK_EVENT_USED, payload: 'e1' });
      state = eventReducer(state, { type: MARK_EVENT_USED, payload: 'e2' });
      expect(state.usedEventIds).toEqual(['e1', 'e2']);
    });
  });

  describe('invulnerable territories', () => {
    it('ADD_INVULNERABLE_TERRITORY adds territory', () => {
      const state = eventReducer(getInitialEventState(), {
        type: ADD_INVULNERABLE_TERRITORY,
        payload: 'fort_mchenry',
      });
      expect(state.invulnerableTerritories).toEqual(['fort_mchenry']);
    });

    it('does not duplicate invulnerable territory', () => {
      let state = eventReducer(getInitialEventState(), {
        type: ADD_INVULNERABLE_TERRITORY,
        payload: 'fort_mchenry',
      });
      state = eventReducer(state, {
        type: ADD_INVULNERABLE_TERRITORY,
        payload: 'fort_mchenry',
      });
      expect(state.invulnerableTerritories).toEqual(['fort_mchenry']);
    });

    it('CLEAR_INVULNERABLE_TERRITORIES empties list', () => {
      const state = eventReducer(
        { ...getInitialEventState(), invulnerableTerritories: ['a', 'b'] },
        { type: CLEAR_INVULNERABLE_TERRITORIES }
      );
      expect(state.invulnerableTerritories).toEqual([]);
    });
  });

  describe('GAME_RESET', () => {
    it('resets to initial state', () => {
      const dirty = {
        currentEvent: { id: 'e1' },
        usedEventIds: ['e1', 'e2'],
        showEventCard: true,
        invulnerableTerritories: ['fort_mchenry'],
      };
      expect(eventReducer(dirty, { type: GAME_RESET })).toEqual(getInitialEventState());
    });
  });

  describe('LOAD_EVENT_STATE', () => {
    it('loads saved state while resetting transient UI', () => {
      const state = eventReducer(getInitialEventState(), {
        type: LOAD_EVENT_STATE,
        payload: {
          usedEventIds: ['e1', 'e2'],
          invulnerableTerritories: ['fort_mchenry'],
          currentEvent: { shouldBeCleared: true },
          showEventCard: true,
        },
      });
      expect(state.usedEventIds).toEqual(['e1', 'e2']);
      expect(state.invulnerableTerritories).toEqual(['fort_mchenry']);
      expect(state.currentEvent).toBeNull();
      expect(state.showEventCard).toBe(false);
    });
  });
});
