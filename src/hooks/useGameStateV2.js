/**
 * useGameState Hook - Version 2 (useReducer Architecture)
 *
 * This is a complete refactor using useReducer instead of useState.
 * Benefits:
 * - NO stale closure bugs
 * - NO refs needed
 * - Clean dependency arrays
 * - Testable reducers
 * - Industry-standard React patterns
 *
 * Migration strategy: Create this as V2, test thoroughly, then replace original
 */

import { useReducer, useCallback, useMemo } from 'react';
import territories, { areAdjacent } from '../data/territories';
import { drawEventCard } from '../data/eventCards';
import { drawKnowledgeCheck } from '../data/knowledgeChecks';
import { checkObjectives, getObjectiveBonus } from '../data/objectives';
import { getLeaderBonus, getLeaderRallyBonus, getFirstStrikeBonus } from '../data/leaders';
import { runAITurn } from './useAI';

// Import all reducers and action types
import {
  gameReducer,
  mapReducer,
  combatReducer,
  eventReducer,
  knowledgeReducer,
  scoreReducer,
  aiReducer,
  leaderReducer,
  historyReducer,
  getInitialGameState,
  getInitialMapState,
  getInitialCombatState,
  getInitialEventState,
  getInitialKnowledgeState,
  getInitialScoreState,
  getInitialAIState,
  getInitialLeaderState,
  getInitialHistoryState,
  // Action types
  GAME_START,
  GAME_OVER,
  HIDE_INTRO,
  ADVANCE_PHASE,
  SET_MESSAGE,
  SELECT_TERRITORY,
  DESELECT_TERRITORY,
  ADD_TROOPS,
  REMOVE_TROOPS,
  SET_TROOPS,
  CAPTURE_TERRITORY,
  SET_REINFORCEMENTS,
  USE_REINFORCEMENT,
  START_BATTLE,
  DISMISS_BATTLE,
  UPDATE_BATTLE_STATS,
  START_MANEUVER,
  EXECUTE_MANEUVER,
  CANCEL_MANEUVER,
  SET_MANEUVERS,
  DRAW_EVENT,
  SHOW_EVENT_CARD,
  HIDE_EVENT_CARD,
  MARK_EVENT_USED,
  DRAW_KNOWLEDGE_CHECK,
  SHOW_KNOWLEDGE_CHECK,
  HIDE_KNOWLEDGE_CHECK,
  ANSWER_KNOWLEDGE_CHECK,
  MARK_CHECK_USED,
  UPDATE_SCORES,
  DELTA_NATIONALISM,
  ADD_JOURNAL_ENTRY,
  ADD_AI_LOG,
  SET_AI_ACTIONS,
  SHOW_AI_REPLAY,
  HIDE_AI_REPLAY,
} from '../reducers';

const TOTAL_ROUNDS = 12;
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];

const getSeasonYear = (round) => {
  const year = 1812 + Math.floor((round - 1) / 4);
  const season = SEASONS[(round - 1) % 4];
  return `${season} ${year}`;
};

export default function useGameStateV2() {
  // ═══════════════════════════════════════════════════════════
  // REDUCER INITIALIZATION
  // ═══════════════════════════════════════════════════════════

  const [gameState, dispatchGame] = useReducer(gameReducer, null, getInitialGameState);
  const [mapState, dispatchMap] = useReducer(mapReducer, null, getInitialMapState);
  const [combatState, dispatchCombat] = useReducer(combatReducer, null, getInitialCombatState);
  const [eventState, dispatchEvent] = useReducer(eventReducer, null, getInitialEventState);
  const [knowledgeState, dispatchKnowledge] = useReducer(knowledgeReducer, null, getInitialKnowledgeState);
  const [scoreState, dispatchScore] = useReducer(scoreReducer, null, getInitialScoreState);
  const [aiState, dispatchAI] = useReducer(aiReducer, null, getInitialAIState);
  const [leaderState, dispatchLeader] = useReducer(leaderReducer, null, getInitialLeaderState);
  const [historyState, dispatchHistory] = useReducer(historyReducer, null, getInitialHistoryState);

  // ═══════════════════════════════════════════════════════════
  // DERIVED STATE (using current state, no stale closures!)
  // ═══════════════════════════════════════════════════════════

  const currentPhaseLabel = useMemo(() => {
    const labels = {
      event: 'Draw Event Card',
      allocate: 'Allocate Forces',
      battle: 'Battle',
      maneuver: 'Maneuver',
      score: 'Score Update',
    };
    return labels[gameState.phase] || '';
  }, [gameState.phase]);

  const seasonYear = useMemo(() => getSeasonYear(gameState.round), [gameState.round]);

  const playerTerritoryCount = useMemo(
    () => Object.values(mapState.territoryOwners).filter((o) => o === gameState.playerFaction).length,
    [mapState.territoryOwners, gameState.playerFaction]
  );

  const playerObjectives = useMemo(
    () =>
      gameState.playerFaction
        ? checkObjectives(gameState.playerFaction, {
            territoryOwners: mapState.territoryOwners,
            troops: mapState.troops,
            nationalismMeter: scoreState.nationalismMeter,
          })
        : [],
    [gameState.playerFaction, mapState.territoryOwners, mapState.troops, scoreState.nationalismMeter]
  );

  const objectiveBonus = useMemo(
    () =>
      gameState.playerFaction
        ? getObjectiveBonus(gameState.playerFaction, {
            territoryOwners: mapState.territoryOwners,
            troops: mapState.troops,
            nationalismMeter: scoreState.nationalismMeter,
          })
        : 0,
    [gameState.playerFaction, mapState.territoryOwners, mapState.troops, scoreState.nationalismMeter]
  );

  // ═══════════════════════════════════════════════════════════
  // GAME ACTIONS (No stale closures - reducers have current state!)
  // ═══════════════════════════════════════════════════════════

  const startGame = useCallback(
    (faction, name, period) => {
      dispatchGame({ type: GAME_START, payload: { faction, name, period } });
      dispatchGame({ type: HIDE_INTRO });

      // Add initial journal entry
      dispatchHistory({
        type: ADD_JOURNAL_ENTRY,
        payload: {
          season: 'Summer 1812',
          items: [`${name} takes command`],
        },
      });
    },
    [] // No dependencies! Dispatch functions are stable
  );

  const placeTroop = useCallback((territoryId) => {
    // No need to check reinforcementsRemaining here - reducer handles it
    dispatchMap({ type: ADD_TROOPS, payload: { territoryId, count: 1 } });
    dispatchCombat({ type: USE_REINFORCEMENT });
  }, []); // No dependencies!

  const selectTerritory = useCallback((id) => {
    dispatchMap({ type: SELECT_TERRITORY, payload: id });
  }, []);

  const attack = useCallback((fromId, toId) => {
    // Battle logic will be here
    // For now, just a placeholder
    console.log('Attack from', fromId, 'to', toId);

    // This would call battle resolution logic
    // then dispatch START_BATTLE with the result
  }, []);

  const dismissBattle = useCallback(() => {
    dispatchCombat({ type: DISMISS_BATTLE });
    dispatchMap({ type: DESELECT_TERRITORY });
  }, []);

  const maneuverTroops = useCallback((fromId, toId) => {
    // Get troop count to move (simplified - in real version this would be from UI)
    const troopsToMove = 1; // Placeholder

    dispatchMap({ type: REMOVE_TROOPS, payload: { territoryId: fromId, count: troopsToMove } });
    dispatchMap({ type: ADD_TROOPS, payload: { territoryId: toId, count: troopsToMove } });
    dispatchCombat({ type: EXECUTE_MANEUVER });
  }, []);

  // ═══════════════════════════════════════════════════════════
  // TERRITORY CLICK HANDLER (The main culprit of stale closures!)
  // ═══════════════════════════════════════════════════════════

  const handleTerritoryClick = useCallback(
    (id) => {
      // NO STALE CLOSURES!
      // We can safely access gameState.phase, mapState.territoryOwners, etc.
      // because they're in the dependency array and React will recreate this
      // callback when they change. But since we're using dispatch for all
      // mutations, the callback rarely needs to change anyway.

      const currentPhase = gameState.phase;
      const isPlayerTerritory = mapState.territoryOwners[id] === gameState.playerFaction;

      // Block if modals are open
      if (eventState.showEventCard || combatState.showBattleModal || knowledgeState.showKnowledgeCheck) {
        return;
      }

      if (currentPhase === 'allocate') {
        if (!isPlayerTerritory) {
          dispatchGame({ type: SET_MESSAGE, payload: 'You can only place troops on your own territories.' });
          return;
        }
        if (combatState.reinforcementsRemaining <= 0) {
          dispatchGame({ type: SET_MESSAGE, payload: 'No reinforcements remaining.' });
          return;
        }
        placeTroop(id);
        dispatchGame({
          type: SET_MESSAGE,
          payload: `Placed 1 troop on ${territories[id]?.name}. ${combatState.reinforcementsRemaining - 1} remaining.`,
        });
      } else if (currentPhase === 'battle') {
        // Battle logic
        if (!mapState.selectedTerritory) {
          // Select attacker
          if (!isPlayerTerritory) {
            dispatchGame({ type: SET_MESSAGE, payload: 'Select one of your territories to attack from.' });
            return;
          }
          selectTerritory(id);
          dispatchGame({ type: SET_MESSAGE, payload: `Selected ${territories[id]?.name}. Now select enemy territory.` });
        } else if (mapState.selectedTerritory === id) {
          // Deselect
          dispatchMap({ type: DESELECT_TERRITORY });
          dispatchGame({ type: SET_MESSAGE, payload: 'Selection cleared.' });
        } else {
          // Attack!
          attack(mapState.selectedTerritory, id);
        }
      } else if (currentPhase === 'maneuver') {
        if (!combatState.maneuverFrom) {
          // Select source
          if (!isPlayerTerritory) return;
          if ((mapState.troops[id] || 0) < 2) {
            dispatchGame({ type: SET_MESSAGE, payload: 'Need at least 2 troops to maneuver from.' });
            return;
          }
          dispatchCombat({ type: START_MANEUVER, payload: id });
          dispatchGame({ type: SET_MESSAGE, payload: `Selected ${territories[id]?.name}. Select adjacent territory.` });
        } else if (combatState.maneuverFrom === id) {
          // Deselect
          dispatchCombat({ type: CANCEL_MANEUVER });
          dispatchGame({ type: SET_MESSAGE, payload: 'Maneuver cancelled.' });
        } else {
          // Execute maneuver
          maneuverTroops(combatState.maneuverFrom, id);
          dispatchGame({ type: SET_MESSAGE, payload: 'Troops maneuvered.' });
        }
      } else {
        selectTerritory(id);
      }
    },
    [
      gameState.phase,
      gameState.playerFaction,
      mapState.territoryOwners,
      mapState.selectedTerritory,
      mapState.troops,
      combatState.reinforcementsRemaining,
      combatState.showBattleModal,
      combatState.maneuverFrom,
      eventState.showEventCard,
      knowledgeState.showKnowledgeCheck,
      placeTroop,
      selectTerritory,
      attack,
      maneuverTroops,
    ]
  );
  // ☝️ Clean dependency array! No stale closures because:
  // 1. All state comes from reducers (current values)
  // 2. All mutations use dispatch (stable references)
  // 3. Helper functions are in dependency array

  // ═══════════════════════════════════════════════════════════
  // RETURN PUBLIC API
  // ═══════════════════════════════════════════════════════════

  return {
    // Game state
    gameStarted: gameState.status === 'in_progress',
    gameOver: gameState.status === 'game_over',
    playerFaction: gameState.playerFaction,
    playerName: gameState.playerName,
    classPeriod: gameState.classPeriod,
    round: gameState.round,
    phase: gameState.phase,
    currentPhaseLabel,
    message: gameState.message,
    showIntro: gameState.showIntro,
    seasonYear,

    // Map state
    territoryOwners: mapState.territoryOwners,
    troops: mapState.troops,
    selectedTerritory: mapState.selectedTerritory,
    playerTerritoryCount,

    // Combat state
    reinforcementsRemaining: combatState.reinforcementsRemaining,
    battleResult: combatState.battleResult,
    showBattleModal: combatState.showBattleModal,
    battleStats: combatState.battleStats,
    maneuverFrom: combatState.maneuverFrom,
    maneuversRemaining: combatState.maneuversRemaining,

    // Event state
    currentEvent: eventState.currentEvent,
    showEventCard: eventState.showEventCard,
    invulnerableTerritories: eventState.invulnerableTerritories,

    // Knowledge state
    currentKnowledgeCheck: knowledgeState.currentKnowledgeCheck,
    showKnowledgeCheck: knowledgeState.showKnowledgeCheck,
    knowledgeCheckResults: knowledgeState.knowledgeCheckResults,
    knowledgeCheckHistory: knowledgeState.knowledgeCheckHistory,

    // Score state
    scores: scoreState.scores,
    nationalismMeter: scoreState.nationalismMeter,

    // AI state
    aiLog: aiState.aiLog,
    aiActions: aiState.aiActions,
    showAIReplay: aiState.showAIReplay,

    // Leader state
    leaderStates: leaderState.leaderStates,

    // History state
    journalEntries: historyState.journalEntries,
    pendingAdvance: historyState.pendingAdvance,

    // Derived state
    playerObjectives,
    objectiveBonus,

    // Actions
    startGame,
    handleTerritoryClick,
    dismissBattle,

    // TODO: Add remaining action methods as we migrate them
  };
}
