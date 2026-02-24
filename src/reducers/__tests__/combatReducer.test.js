/**
 * Tests for combatReducer
 */

import combatReducer, { getInitialCombatState } from '../combatReducer';
import {
  SET_REINFORCEMENTS,
  USE_REINFORCEMENT,
  START_BATTLE,
  DISMISS_BATTLE,
  UPDATE_BATTLE_STATS,
  START_MANEUVER,
  EXECUTE_MANEUVER,
  CANCEL_MANEUVER,
  SET_MANEUVERS,
  GAME_RESET,
  LOAD_COMBAT_STATE,
} from '../types';

describe('combatReducer', () => {
  describe('getInitialCombatState', () => {
    it('returns correct initial state', () => {
      const initial = getInitialCombatState();
      expect(initial).toEqual({
        reinforcementsRemaining: 0,
        battleResult: null,
        showBattleModal: false,
        battleStats: { fought: 0, won: 0, lost: 0 },
        maneuverFrom: null,
        maneuversRemaining: 0,
      });
    });
  });

  describe('SET_REINFORCEMENTS', () => {
    it('sets reinforcements to valid count', () => {
      const state = combatReducer(getInitialCombatState(), {
        type: SET_REINFORCEMENTS,
        payload: 5,
      });
      expect(state.reinforcementsRemaining).toBe(5);
    });

    it('rejects NaN payload', () => {
      const initial = getInitialCombatState();
      const state = combatReducer(initial, {
        type: SET_REINFORCEMENTS,
        payload: NaN,
      });
      expect(state.reinforcementsRemaining).toBe(0);
    });

    it('rejects negative payload', () => {
      const initial = getInitialCombatState();
      const state = combatReducer(initial, {
        type: SET_REINFORCEMENTS,
        payload: -3,
      });
      expect(state.reinforcementsRemaining).toBe(0);
    });
  });

  describe('USE_REINFORCEMENT', () => {
    it('decrements reinforcements', () => {
      const state = combatReducer(
        { ...getInitialCombatState(), reinforcementsRemaining: 3 },
        { type: USE_REINFORCEMENT }
      );
      expect(state.reinforcementsRemaining).toBe(2);
    });

    it('does not go below zero', () => {
      const state = combatReducer(
        { ...getInitialCombatState(), reinforcementsRemaining: 0 },
        { type: USE_REINFORCEMENT }
      );
      expect(state.reinforcementsRemaining).toBe(0);
    });
  });

  describe('battle actions', () => {
    it('START_BATTLE sets result and shows modal', () => {
      const battle = { attacker: 'us', defender: 'british' };
      const state = combatReducer(getInitialCombatState(), {
        type: START_BATTLE,
        payload: battle,
      });
      expect(state.battleResult).toEqual(battle);
      expect(state.showBattleModal).toBe(true);
    });

    it('DISMISS_BATTLE clears result and hides modal', () => {
      const state = combatReducer(
        { ...getInitialCombatState(), battleResult: {}, showBattleModal: true },
        { type: DISMISS_BATTLE }
      );
      expect(state.battleResult).toBeNull();
      expect(state.showBattleModal).toBe(false);
    });
  });

  describe('UPDATE_BATTLE_STATS', () => {
    it('accumulates battle statistics', () => {
      let state = getInitialCombatState();
      state = combatReducer(state, {
        type: UPDATE_BATTLE_STATS,
        payload: { fought: 1, won: 1, lost: 0 },
      });
      state = combatReducer(state, {
        type: UPDATE_BATTLE_STATS,
        payload: { fought: 1, won: 0, lost: 1 },
      });
      expect(state.battleStats).toEqual({ fought: 2, won: 1, lost: 1 });
    });
  });

  describe('maneuver actions', () => {
    it('START_MANEUVER sets source territory', () => {
      const state = combatReducer(getInitialCombatState(), {
        type: START_MANEUVER,
        payload: 'detroit',
      });
      expect(state.maneuverFrom).toBe('detroit');
    });

    it('CANCEL_MANEUVER clears source', () => {
      const state = combatReducer(
        { ...getInitialCombatState(), maneuverFrom: 'detroit' },
        { type: CANCEL_MANEUVER }
      );
      expect(state.maneuverFrom).toBeNull();
    });

    it('EXECUTE_MANEUVER clears source and decrements count', () => {
      const state = combatReducer(
        { ...getInitialCombatState(), maneuverFrom: 'detroit', maneuversRemaining: 2 },
        { type: EXECUTE_MANEUVER }
      );
      expect(state.maneuverFrom).toBeNull();
      expect(state.maneuversRemaining).toBe(1);
    });

    it('SET_MANEUVERS rejects NaN', () => {
      const initial = getInitialCombatState();
      const state = combatReducer(initial, {
        type: SET_MANEUVERS,
        payload: NaN,
      });
      expect(state.maneuversRemaining).toBe(0);
    });
  });

  describe('GAME_RESET', () => {
    it('resets to initial state', () => {
      const dirty = {
        reinforcementsRemaining: 5,
        battleResult: { attacker: 'us' },
        showBattleModal: true,
        battleStats: { fought: 10, won: 7, lost: 3 },
        maneuverFrom: 'detroit',
        maneuversRemaining: 2,
      };
      const state = combatReducer(dirty, { type: GAME_RESET });
      expect(state).toEqual(getInitialCombatState());
    });
  });

  describe('LOAD_COMBAT_STATE', () => {
    it('loads saved state while resetting transient UI', () => {
      const state = combatReducer(getInitialCombatState(), {
        type: LOAD_COMBAT_STATE,
        payload: {
          reinforcementsRemaining: 3,
          battleStats: { fought: 5, won: 3, lost: 2 },
          battleResult: { shouldBeCleared: true },
          showBattleModal: true,
        },
      });
      expect(state.reinforcementsRemaining).toBe(3);
      expect(state.battleStats).toEqual({ fought: 5, won: 3, lost: 2 });
      expect(state.battleResult).toBeNull();
      expect(state.showBattleModal).toBe(false);
      expect(state.maneuverFrom).toBeNull();
    });
  });
});
