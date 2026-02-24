/**
 * Root Reducer — barrel export for all domain reducers, initial states, and action types.
 */

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
