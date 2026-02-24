/**
 * Action Types for War of 1812 Game State
 *
 * All state mutations go through these action types.
 * This ensures predictable state changes and easier debugging.
 */

// ═══════════════════════════════════════════════════════════
// GAME REDUCER - Core game flow
// ═══════════════════════════════════════════════════════════

export const GAME_START = 'GAME_START';
export const GAME_OVER = 'GAME_OVER';
export const GAME_RESET = 'GAME_RESET';
export const SET_PLAYER_INFO = 'SET_PLAYER_INFO';
export const ADVANCE_PHASE = 'ADVANCE_PHASE';
export const ADVANCE_ROUND = 'ADVANCE_ROUND';
export const SET_MESSAGE = 'SET_MESSAGE';
export const HIDE_INTRO = 'HIDE_INTRO';

// ═══════════════════════════════════════════════════════════
// MAP REDUCER - Territory ownership and troops
// ═══════════════════════════════════════════════════════════

export const CAPTURE_TERRITORY = 'CAPTURE_TERRITORY';
export const ADD_TROOPS = 'ADD_TROOPS';
export const REMOVE_TROOPS = 'REMOVE_TROOPS';
export const SET_TROOPS = 'SET_TROOPS';
export const SELECT_TERRITORY = 'SELECT_TERRITORY';
export const DESELECT_TERRITORY = 'DESELECT_TERRITORY';

// ═══════════════════════════════════════════════════════════
// COMBAT REDUCER - Battles, reinforcements, maneuvers
// ═══════════════════════════════════════════════════════════

export const SET_REINFORCEMENTS = 'SET_REINFORCEMENTS';
export const USE_REINFORCEMENT = 'USE_REINFORCEMENT';
export const START_BATTLE = 'START_BATTLE';
export const RESOLVE_BATTLE = 'RESOLVE_BATTLE';
export const DISMISS_BATTLE = 'DISMISS_BATTLE';
export const UPDATE_BATTLE_STATS = 'UPDATE_BATTLE_STATS';
export const START_MANEUVER = 'START_MANEUVER';
export const EXECUTE_MANEUVER = 'EXECUTE_MANEUVER';
export const CANCEL_MANEUVER = 'CANCEL_MANEUVER';
export const USE_MANEUVER = 'USE_MANEUVER';
export const SET_MANEUVERS = 'SET_MANEUVERS';

// ═══════════════════════════════════════════════════════════
// EVENT REDUCER - Event cards
// ═══════════════════════════════════════════════════════════

export const DRAW_EVENT = 'DRAW_EVENT';
export const SHOW_EVENT_CARD = 'SHOW_EVENT_CARD';
export const HIDE_EVENT_CARD = 'HIDE_EVENT_CARD';
export const MARK_EVENT_USED = 'MARK_EVENT_USED';
export const ADD_INVULNERABLE_TERRITORY = 'ADD_INVULNERABLE_TERRITORY';
export const CLEAR_INVULNERABLE_TERRITORIES = 'CLEAR_INVULNERABLE_TERRITORIES';

// ═══════════════════════════════════════════════════════════
// KNOWLEDGE REDUCER - Quiz system
// ═══════════════════════════════════════════════════════════

export const DRAW_KNOWLEDGE_CHECK = 'DRAW_KNOWLEDGE_CHECK';
export const SHOW_KNOWLEDGE_CHECK = 'SHOW_KNOWLEDGE_CHECK';
export const HIDE_KNOWLEDGE_CHECK = 'HIDE_KNOWLEDGE_CHECK';
export const ANSWER_KNOWLEDGE_CHECK = 'ANSWER_KNOWLEDGE_CHECK';
export const MARK_CHECK_USED = 'MARK_CHECK_USED';
export const MARK_REQUIRED_CHECK_SEEN = 'MARK_REQUIRED_CHECK_SEEN';

// ═══════════════════════════════════════════════════════════
// SCORE REDUCER - Scores and faction-specific meters
// ═══════════════════════════════════════════════════════════

export const UPDATE_SCORES = 'UPDATE_SCORES';
export const DELTA_NATIONALISM = 'DELTA_NATIONALISM';
export const SET_NATIONALISM = 'SET_NATIONALISM';

// ═══════════════════════════════════════════════════════════
// AI REDUCER - AI opponent actions
// ═══════════════════════════════════════════════════════════

export const ADD_AI_LOG = 'ADD_AI_LOG';
export const CLEAR_AI_LOG = 'CLEAR_AI_LOG';
export const SET_AI_ACTIONS = 'SET_AI_ACTIONS';
export const SHOW_AI_REPLAY = 'SHOW_AI_REPLAY';
export const HIDE_AI_REPLAY = 'HIDE_AI_REPLAY';

// ═══════════════════════════════════════════════════════════
// LEADER REDUCER - Leader alive/dead states
// ═══════════════════════════════════════════════════════════

export const KILL_LEADER = 'KILL_LEADER';
export const REVIVE_LEADER = 'REVIVE_LEADER'; // For undo functionality

// ═══════════════════════════════════════════════════════════
// HISTORY REDUCER - Undo, journal, pending actions
// ═══════════════════════════════════════════════════════════

export const ADD_JOURNAL_ENTRY = 'ADD_JOURNAL_ENTRY';
export const SAVE_PHASE_SNAPSHOT = 'SAVE_PHASE_SNAPSHOT';
export const SET_PENDING_ADVANCE = 'SET_PENDING_ADVANCE';
export const CLEAR_PENDING_ADVANCE = 'CLEAR_PENDING_ADVANCE';
export const SET_PENDING_ACTION = 'SET_PENDING_ACTION';
export const CLEAR_PENDING_ACTION = 'CLEAR_PENDING_ACTION';
export const SAVE_ACTION_SNAPSHOT = 'SAVE_ACTION_SNAPSHOT';
export const REMOVE_LAST_ACTION = 'REMOVE_LAST_ACTION';

// ═══════════════════════════════════════════════════════════
// LOAD STATE - Restore saved game state
// ═══════════════════════════════════════════════════════════

export const LOAD_GAME_STATE = 'LOAD_GAME_STATE';
export const LOAD_MAP_STATE = 'LOAD_MAP_STATE';
export const LOAD_COMBAT_STATE = 'LOAD_COMBAT_STATE';
export const LOAD_EVENT_STATE = 'LOAD_EVENT_STATE';
export const LOAD_KNOWLEDGE_STATE = 'LOAD_KNOWLEDGE_STATE';
export const LOAD_SCORE_STATE = 'LOAD_SCORE_STATE';
export const LOAD_AI_STATE = 'LOAD_AI_STATE';
export const LOAD_LEADER_STATE = 'LOAD_LEADER_STATE';
export const LOAD_HISTORY_STATE = 'LOAD_HISTORY_STATE';
