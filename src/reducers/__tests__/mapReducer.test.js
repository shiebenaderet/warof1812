/**
 * Tests for mapReducer
 */

import mapReducer, { getInitialMapState } from '../mapReducer';
import {
  CAPTURE_TERRITORY,
  ADD_TROOPS,
  REMOVE_TROOPS,
  SET_TROOPS,
  SELECT_TERRITORY,
  DESELECT_TERRITORY,
  GAME_RESET,
} from '../types';

describe('mapReducer', () => {
  describe('getInitialMapState', () => {
    it('initializes territory owners from data', () => {
      const initial = getInitialMapState();
      expect(initial.territoryOwners).toBeDefined();
      expect(initial.territoryOwners['new_york']).toBe('us');
      expect(initial.territoryOwners['upper_canada']).toBe('british');
    });

    it('initializes troops for all territories', () => {
      const initial = getInitialMapState();
      expect(initial.troops).toBeDefined();
      expect(typeof initial.troops['new_york']).toBe('number');
      expect(initial.troops['new_york']).toBeGreaterThan(0);
    });

    it('starts with no selected territory', () => {
      const initial = getInitialMapState();
      expect(initial.selectedTerritory).toBe(null);
    });
  });

  describe('CAPTURE_TERRITORY', () => {
    it('changes territory owner', () => {
      const state = getInitialMapState();
      const originalOwner = state.territoryOwners['detroit'];

      const result = mapReducer(state, {
        type: CAPTURE_TERRITORY,
        payload: { territoryId: 'detroit', newOwner: 'british' },
      });

      expect(result.territoryOwners['detroit']).toBe('british');
      expect(result.territoryOwners['detroit']).not.toBe(originalOwner);
    });

    it('does not mutate other territories', () => {
      const state = getInitialMapState();
      const result = mapReducer(state, {
        type: CAPTURE_TERRITORY,
        payload: { territoryId: 'detroit', newOwner: 'british' },
      });

      // Other territories unchanged
      expect(result.territoryOwners['new_york']).toBe(state.territoryOwners['new_york']);
    });
  });

  describe('ADD_TROOPS', () => {
    it('adds troops to territory', () => {
      const state = getInitialMapState();
      const initialTroops = state.troops['new_york'];

      const result = mapReducer(state, {
        type: ADD_TROOPS,
        payload: { territoryId: 'new_york', count: 5 },
      });

      expect(result.troops['new_york']).toBe(initialTroops + 5);
    });

    it('handles adding to territory with 0 troops', () => {
      const state = {
        ...getInitialMapState(),
        troops: { ...getInitialMapState().troops, test_territory: 0 },
      };

      const result = mapReducer(state, {
        type: ADD_TROOPS,
        payload: { territoryId: 'test_territory', count: 3 },
      });

      expect(result.troops['test_territory']).toBe(3);
    });
  });

  describe('REMOVE_TROOPS', () => {
    it('removes troops from territory', () => {
      const state = {
        ...getInitialMapState(),
        troops: { ...getInitialMapState().troops, new_york: 10 },
      };

      const result = mapReducer(state, {
        type: REMOVE_TROOPS,
        payload: { territoryId: 'new_york', count: 3 },
      });

      expect(result.troops['new_york']).toBe(7);
    });

    it('does not go below 0', () => {
      const state = {
        ...getInitialMapState(),
        troops: { ...getInitialMapState().troops, new_york: 2 },
      };

      const result = mapReducer(state, {
        type: REMOVE_TROOPS,
        payload: { territoryId: 'new_york', count: 5 },
      });

      expect(result.troops['new_york']).toBe(0);
    });
  });

  describe('SET_TROOPS', () => {
    it('sets exact troop count', () => {
      const state = getInitialMapState();

      const result = mapReducer(state, {
        type: SET_TROOPS,
        payload: { territoryId: 'new_york', count: 99 },
      });

      expect(result.troops['new_york']).toBe(99);
    });

    it('can set to 0', () => {
      const state = getInitialMapState();

      const result = mapReducer(state, {
        type: SET_TROOPS,
        payload: { territoryId: 'new_york', count: 0 },
      });

      expect(result.troops['new_york']).toBe(0);
    });
  });

  describe('SELECT_TERRITORY', () => {
    it('selects territory', () => {
      const state = getInitialMapState();

      const result = mapReducer(state, {
        type: SELECT_TERRITORY,
        payload: 'new_york',
      });

      expect(result.selectedTerritory).toBe('new_york');
    });

    it('can change selection', () => {
      const state = { ...getInitialMapState(), selectedTerritory: 'detroit' };

      const result = mapReducer(state, {
        type: SELECT_TERRITORY,
        payload: 'new_york',
      });

      expect(result.selectedTerritory).toBe('new_york');
    });
  });

  describe('DESELECT_TERRITORY', () => {
    it('clears selection', () => {
      const state = { ...getInitialMapState(), selectedTerritory: 'new_york' };

      const result = mapReducer(state, { type: DESELECT_TERRITORY });

      expect(result.selectedTerritory).toBe(null);
    });
  });

  describe('GAME_RESET', () => {
    it('resets to initial map state', () => {
      const state = {
        territoryOwners: { detroit: 'british' },
        troops: { detroit: 99 },
        selectedTerritory: 'detroit',
      };

      const result = mapReducer(state, { type: GAME_RESET });
      const initial = getInitialMapState();

      expect(result).toEqual(initial);
    });
  });

  describe('unknown action', () => {
    it('returns current state unchanged', () => {
      const state = getInitialMapState();
      const result = mapReducer(state, { type: 'UNKNOWN_ACTION' });

      expect(result).toBe(state);
    });
  });
});
