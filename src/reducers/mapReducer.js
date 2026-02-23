/**
 * Map Reducer - Territory ownership and troop placement
 *
 * Handles: territory ownership, troop counts, territory selection
 */

import territories from '../data/territories';
import {
  CAPTURE_TERRITORY,
  ADD_TROOPS,
  REMOVE_TROOPS,
  SET_TROOPS,
  SELECT_TERRITORY,
  DESELECT_TERRITORY,
  GAME_RESET,
} from './types';

/**
 * @typedef {Object} MapState
 * @property {Record<string, string>} territoryOwners - Map of territoryId -> faction ('us' | 'british' | 'native' | 'neutral')
 * @property {Record<string, number>} troops - Map of territoryId -> troop count
 * @property {string | null} selectedTerritory - Currently selected territory ID
 */

/** @returns {MapState} */
export function getInitialMapState() {
  return {
    territoryOwners: initTerritoryOwners(),
    troops: initTroops(),
    selectedTerritory: null,
  };
}

function initTerritoryOwners() {
  const owners = {};
  for (const [id, terr] of Object.entries(territories)) {
    owners[id] = terr.startingOwner;
  }
  return owners;
}

function initTroops() {
  const troops = {};
  for (const [id, terr] of Object.entries(territories)) {
    if (terr.startingOwner === 'neutral') {
      troops[id] = 0;
    } else if (terr.startingTroops) {
      troops[id] = terr.startingTroops;
    } else if (terr.hasFort) {
      troops[id] = 4;
    } else {
      troops[id] = 2;
    }
  }
  return troops;
}

/**
 * Map Reducer
 * @param {MapState} state
 * @param {Object} action
 * @returns {MapState}
 */
export default function mapReducer(state = getInitialMapState(), action) {
  switch (action.type) {
    case CAPTURE_TERRITORY:
      return {
        ...state,
        territoryOwners: {
          ...state.territoryOwners,
          [action.payload.territoryId]: action.payload.newOwner,
        },
      };

    case ADD_TROOPS: {
      const { territoryId, count } = action.payload;
      const currentTroops = state.troops[territoryId] || 0;
      return {
        ...state,
        troops: {
          ...state.troops,
          [territoryId]: currentTroops + count,
        },
      };
    }

    case REMOVE_TROOPS: {
      const { territoryId, count } = action.payload;
      const currentTroops = state.troops[territoryId] || 0;
      const newCount = Math.max(0, currentTroops - count);
      return {
        ...state,
        troops: {
          ...state.troops,
          [territoryId]: newCount,
        },
      };
    }

    case SET_TROOPS:
      return {
        ...state,
        troops: {
          ...state.troops,
          [action.payload.territoryId]: action.payload.count,
        },
      };

    case SELECT_TERRITORY:
      return {
        ...state,
        selectedTerritory: action.payload,
      };

    case DESELECT_TERRITORY:
      return {
        ...state,
        selectedTerritory: null,
      };

    case GAME_RESET:
      return getInitialMapState();

    default:
      return state;
  }
}
