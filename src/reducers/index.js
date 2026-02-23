/**
 * Root Reducer - Combines all domain reducers
 *
 * This file exports:
 * 1. Individual reducer functions for testing
 * 2. Initial state getters
 * 3. A combined root reducer (if using single useReducer)
 * 4. Individual reducers for multi-reducer pattern (recommended)
 */

import { getInitialGameState } from './gameReducer';
import { getInitialMapState } from './mapReducer';
import { getInitialCombatState } from './combatReducer';
import { getInitialEventState } from './eventReducer';
import { getInitialKnowledgeState } from './knowledgeReducer';
import { getInitialScoreState } from './scoreReducer';
import { getInitialAIState } from './aiReducer';
import { getInitialLeaderState } from './leaderReducer';
import { getInitialHistoryState } from './historyReducer';

export { default as gameReducer, getInitialGameState } from './gameReducer';
export { default as mapReducer, getInitialMapState } from './mapReducer';
export { default as combatReducer, getInitialCombatState } from './combatReducer';
export { default as eventReducer, getInitialEventState } from './eventReducer';
export { default as knowledgeReducer, getInitialKnowledgeState } from './knowledgeReducer';
export { default as scoreReducer, getInitialScoreState } from './scoreReducer';
export { default as aiReducer, getInitialAIState } from './aiReducer';
export { default as leaderReducer, getInitialLeaderState } from './leaderReducer';
export { default as historyReducer, getInitialHistoryState } from './historyReducer';

export * from './types';

/**
 * Get complete initial state for all reducers
 * Useful for resetting game or initializing state
 */
export function getCompleteInitialState() {
  return {
    game: getInitialGameState(),
    map: getInitialMapState(),
    combat: getInitialCombatState(),
    event: getInitialEventState(),
    knowledge: getInitialKnowledgeState(),
    score: getInitialScoreState(),
    ai: getInitialAIState(),
    leader: getInitialLeaderState(),
    history: getInitialHistoryState(),
  };
}
