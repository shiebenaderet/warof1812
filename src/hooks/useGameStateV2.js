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

import { useReducer, useCallback, useMemo, useRef } from 'react';
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
  GAME_RESET,
  HIDE_INTRO,
  ADVANCE_PHASE,
  ADVANCE_ROUND,
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
  ADD_INVULNERABLE_TERRITORY,
  CLEAR_INVULNERABLE_TERRITORIES,
  DRAW_KNOWLEDGE_CHECK,
  SHOW_KNOWLEDGE_CHECK,
  HIDE_KNOWLEDGE_CHECK,
  ANSWER_KNOWLEDGE_CHECK,
  MARK_CHECK_USED,
  MARK_REQUIRED_CHECK_SEEN,
  UPDATE_SCORES,
  DELTA_NATIONALISM,
  SET_NATIONALISM,
  ADD_JOURNAL_ENTRY,
  ADD_AI_LOG,
  CLEAR_AI_LOG,
  SET_AI_ACTIONS,
  SHOW_AI_REPLAY,
  HIDE_AI_REPLAY,
  KILL_LEADER,
  SAVE_PHASE_SNAPSHOT,
  SET_PENDING_ADVANCE,
  CLEAR_PENDING_ADVANCE,
  SET_PENDING_ACTION,
  CLEAR_PENDING_ACTION,
  SAVE_ACTION_SNAPSHOT,
  REMOVE_LAST_ACTION,
  LOAD_GAME_STATE,
  LOAD_MAP_STATE,
  LOAD_COMBAT_STATE,
  LOAD_EVENT_STATE,
  LOAD_KNOWLEDGE_STATE,
  LOAD_SCORE_STATE,
  LOAD_AI_STATE,
  LOAD_LEADER_STATE,
  LOAD_HISTORY_STATE,
} from '../reducers';

const TOTAL_ROUNDS = 12;
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const PHASES = ['event', 'allocate', 'battle', 'maneuver', 'score'];
const PHASE_LABELS = {
  event: 'Draw Event Card',
  allocate: 'Allocate Forces',
  battle: 'Battle',
  maneuver: 'Maneuver',
  score: 'Score Update',
};
const ALL_FACTIONS = ['us', 'british', 'native'];

const getSeasonYear = (round) => {
  const year = 1812 + Math.floor((round - 1) / 4);
  const season = SEASONS[(round - 1) % 4];
  return `${season} ${year}`;
};

function calculateReinforcements(territoryOwners, faction, leaderStates, round) {
  const owned = Object.entries(territoryOwners).filter(([, owner]) => owner === faction);
  if (owned.length === 0) return 0;
  const base = 3 + Math.floor(owned.length / 2);
  const leaderBonus = getLeaderRallyBonus(faction, leaderStates);
  const nativeBonus = (faction === 'native' && round <= 4) ? 1 : 0;
  return base + leaderBonus + nativeBonus;
}

function checkDomination(territoryOwners) {
  const ownedTerritories = Object.entries(territoryOwners)
    .filter(([, owner]) => owner !== 'neutral');
  if (ownedTerritories.length === 0) return null;
  const firstOwner = ownedTerritories[0][1];
  const allSame = ownedTerritories.every(([, owner]) => owner === firstOwner);
  return allSame ? firstOwner : null;
}

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

  // Track whether we need to show an event card after AI replay closes
  const pendingEventAfterReplay = useRef(false);

  // ═══════════════════════════════════════════════════════════
  // DERIVED STATE (using current state, no stale closures!)
  // ═══════════════════════════════════════════════════════════

  const currentPhase = PHASES[gameState.phaseIndex];
  const currentPhaseLabel = PHASE_LABELS[currentPhase] || '';
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

  const nativeResistance = useMemo(() => {
    if (gameState.playerFaction !== 'native') return 0;
    return Math.min(playerTerritoryCount, 6);
  }, [gameState.playerFaction, playerTerritoryCount]);

  const navalDominance = useMemo(() => {
    if (gameState.playerFaction !== 'british') return 0;
    return Object.entries(mapState.territoryOwners)
      .filter(([id, owner]) => owner === 'british' && territories[id]?.isNaval)
      .length;
  }, [gameState.playerFaction, mapState.territoryOwners]);

  const factionMultiplier = useMemo(() => {
    if (gameState.playerFaction === 'us') return 1 + scoreState.nationalismMeter / 100;
    if (gameState.playerFaction === 'native') return 1 + (Math.min(nativeResistance, 6) / 6) * 0.5;
    if (gameState.playerFaction === 'british') return 1 + (Math.min(navalDominance, 4) / 4) * 0.3;
    return 1;
  }, [gameState.playerFaction, scoreState.nationalismMeter, nativeResistance, navalDominance]);

  const finalScore = useMemo(() => {
    if (!gameState.playerFaction) return 0;
    const base = scoreState.scores[gameState.playerFaction] || 0;
    return Math.round(base * factionMultiplier) + objectiveBonus;
  }, [scoreState.scores, gameState.playerFaction, factionMultiplier, objectiveBonus]);

  // ═══════════════════════════════════════════════════════════
  // EVENT CARD EFFECTS HELPER
  // ═══════════════════════════════════════════════════════════

  const applyEventEffects = useCallback((event, currentOwners, currentTroops, currentNationalism, currentLeaders) => {
    if (!event || !event.apply) return { owners: currentOwners, troops: currentTroops, nationalism: currentNationalism, leaders: currentLeaders };

    const gameStateForEvent = {
      territoryOwners: currentOwners,
      troops: currentTroops,
      scores: scoreState.scores,
      playerFaction: gameState.playerFaction,
    };
    const effects = event.apply(gameStateForEvent);
    let newOwners = { ...currentOwners };
    let newTroops = { ...currentTroops };
    let newNationalism = currentNationalism;
    let newLeaders = { ...currentLeaders };

    // Territory ownership change
    if (effects.territoryChange) {
      const { territory, newOwner } = effects.territoryChange;
      if (territory && newOwner) {
        newOwners[territory] = newOwner;
      }
    }

    // Troop bonus
    if (effects.troopBonus) {
      const { faction, count, territories: targetTerrs, theater, territory } = effects.troopBonus;
      const safeCount = Number.isFinite(count) ? Math.max(0, count) : 0;
      if (targetTerrs && targetTerrs.length > 0) {
        let remaining = safeCount;
        let idx = 0;
        while (remaining > 0 && idx < 200) {
          const tid = targetTerrs[idx % targetTerrs.length];
          newTroops[tid] = (newTroops[tid] || 0) + 1;
          remaining--;
          idx++;
        }
      } else if (theater) {
        const candidates = Object.entries(newOwners)
          .filter(([id, owner]) => owner === faction && territories[id]?.theater === theater);
        if (candidates.length > 0) {
          let remaining = safeCount;
          let idx = 0;
          while (remaining > 0 && idx < 200) {
            const [tid] = candidates[idx % candidates.length];
            newTroops[tid] = (newTroops[tid] || 0) + 1;
            remaining--;
            idx++;
          }
        }
      } else if (territory) {
        newTroops[territory] = (newTroops[territory] || 0) + safeCount;
      }
    }

    // Troop penalty
    if (effects.troopPenalty) {
      const { territory, territories: penaltyTerrs, faction: penaltyFaction, count } = effects.troopPenalty;
      if (territory) {
        newTroops[territory] = Math.max(0, (newTroops[territory] || 0) - count);
      } else if (penaltyTerrs) {
        for (const tid of penaltyTerrs) {
          newTroops[tid] = Math.max(0, (newTroops[tid] || 0) - count);
        }
      } else if (penaltyFaction) {
        const factionTerrs = Object.entries(newOwners)
          .filter(([, owner]) => owner === penaltyFaction)
          .map(([id]) => id);
        let remaining = count;
        for (const tid of factionTerrs) {
          if (remaining <= 0) break;
          const loss = Math.min(remaining, Math.max(0, (newTroops[tid] || 0) - 1));
          newTroops[tid] = (newTroops[tid] || 0) - loss;
          remaining -= loss;
        }
      }
    }

    // Nationalism change
    if (effects.nationalismChange && gameState.playerFaction === 'us') {
      newNationalism = Math.max(0, Math.min(100, newNationalism + effects.nationalismChange));
    }

    // Leader removal
    if (effects.removeLeader && newLeaders[effects.removeLeader]) {
      newLeaders[effects.removeLeader] = { ...newLeaders[effects.removeLeader], alive: false };
    }

    // Fort McHenry / invulnerable territory
    const invulnerable = [];
    if (effects.fortify && effects.fortify.invulnerable && effects.fortify.territory) {
      invulnerable.push(effects.fortify.territory);
    }

    return { owners: newOwners, troops: newTroops, nationalism: newNationalism, leaders: newLeaders, invulnerable };
  }, [scoreState.scores, gameState.playerFaction]);

  // ═══════════════════════════════════════════════════════════
  // JOURNAL HELPER
  // ═══════════════════════════════════════════════════════════

  const addJournalEntry = useCallback((items) => {
    dispatchHistory({
      type: ADD_JOURNAL_ENTRY,
      payload: {
        round: gameState.round,
        season: getSeasonYear(gameState.round),
        items,
      },
    });
  }, [gameState.round]);

  // ═══════════════════════════════════════════════════════════
  // GAME ACTIONS
  // ═══════════════════════════════════════════════════════════

  const startGame = useCallback(({ faction, playerName: name, classPeriod: period, gameMode }) => {
    // Reset all reducers
    dispatchGame({ type: GAME_RESET });
    dispatchMap({ type: GAME_RESET });
    dispatchCombat({ type: GAME_RESET });
    dispatchEvent({ type: GAME_RESET });
    dispatchKnowledge({ type: GAME_RESET });
    dispatchScore({ type: GAME_RESET });
    dispatchAI({ type: GAME_RESET });
    dispatchLeader({ type: GAME_RESET });
    dispatchHistory({ type: GAME_RESET });

    // Start the game
    dispatchGame({ type: GAME_START, payload: { faction, name, period, gameMode } });
    dispatchGame({ type: HIDE_INTRO });
    dispatchGame({
      type: SET_MESSAGE,
      payload: `The war begins! You command the ${faction === 'us' ? 'United States' : faction === 'british' ? 'British/Canadian' : 'Native Coalition'} forces.`
    });

    // Draw first event card
    const event = drawEventCard(1, []);
    if (event) {
      dispatchEvent({ type: DRAW_EVENT, payload: event });
      dispatchEvent({ type: SHOW_EVENT_CARD });
      dispatchEvent({ type: MARK_EVENT_USED, payload: event.id });
    }
  }, []);

  const resetGame = useCallback(() => {
    dispatchGame({ type: GAME_RESET });
    dispatchMap({ type: GAME_RESET });
    dispatchCombat({ type: GAME_RESET });
    dispatchEvent({ type: GAME_RESET });
    dispatchKnowledge({ type: GAME_RESET });
    dispatchScore({ type: GAME_RESET });
    dispatchAI({ type: GAME_RESET });
    dispatchLeader({ type: GAME_RESET });
    dispatchHistory({ type: GAME_RESET });
    pendingEventAfterReplay.current = false;
  }, []);

  const dismissIntro = useCallback(() => {
    dispatchGame({ type: HIDE_INTRO });
  }, []);

  const selectTerritory = useCallback((id) => {
    if (mapState.selectedTerritory === id) {
      dispatchMap({ type: DESELECT_TERRITORY });
    } else {
      dispatchMap({ type: SELECT_TERRITORY, payload: id });
    }
  }, [mapState.selectedTerritory]);

  const placeTroop = useCallback((territoryId) => {
    if (currentPhase !== 'allocate') return;
    if (mapState.territoryOwners[territoryId] !== gameState.playerFaction) return;
    if (combatState.reinforcementsRemaining <= 0) return;

    dispatchMap({ type: ADD_TROOPS, payload: { territoryId, count: 1 } });
    dispatchCombat({ type: USE_REINFORCEMENT });
    dispatchMap({ type: DESELECT_TERRITORY });
    dispatchGame({
      type: SET_MESSAGE,
      payload: `Deployed 1 troop to ${territories[territoryId]?.name}. ${combatState.reinforcementsRemaining - 1} reinforcements remaining.`
    });
  }, [currentPhase, mapState.territoryOwners, gameState.playerFaction, combatState.reinforcementsRemaining]);

  // ═══════════════════════════════════════════════════════════
  // BATTLE RESOLUTION
  // ═══════════════════════════════════════════════════════════

  const attack = useCallback((fromId, toId) => {
    if (currentPhase !== 'battle') return { success: false };
    if (!areAdjacent(fromId, toId)) return { success: false, reason: 'Not adjacent' };
    if (mapState.territoryOwners[fromId] !== gameState.playerFaction) return { success: false, reason: 'Not your territory' };
    if (mapState.territoryOwners[toId] === gameState.playerFaction) return { success: false, reason: 'Already yours' };
    if ((mapState.troops[fromId] || 0) < 2) return { success: false, reason: 'Need at least 2 troops to attack' };

    // Fort McHenry invulnerability check
    if (eventState.invulnerableTerritories.includes(toId)) {
      dispatchGame({ type: SET_MESSAGE, payload: `${territories[toId]?.name} is invulnerable this round! The bombardment failed.` });
      return { success: false, reason: 'Territory is invulnerable this round' };
    }

    let currentDefenderTroops = mapState.troops[toId] || 0;

    // Auto-capture undefended territories
    if (currentDefenderTroops === 0) {
      const movers = Math.min(mapState.troops[fromId] - 1, 3);
      dispatchMap({ type: SET_TROOPS, payload: { territoryId: fromId, count: Math.max(1, mapState.troops[fromId] - movers) } });
      dispatchMap({ type: SET_TROOPS, payload: { territoryId: toId, count: Math.max(1, movers) } });
      dispatchMap({ type: CAPTURE_TERRITORY, payload: { territoryId: toId, newOwner: gameState.playerFaction } });

      if (gameState.playerFaction === 'us') {
        dispatchScore({ type: DELTA_NATIONALISM, payload: 2 });
      }

      const result = {
        success: true, conquered: true,
        attackRolls: [], defendRolls: [],
        attackerLosses: 0, defenderLosses: 0,
        attackLeaderBonus: 0, defendLeaderBonus: 0,
        fortBonus: false, firstStrike: false, fromId, toId,
        undefended: true,
      };
      dispatchCombat({ type: START_BATTLE, payload: result });
      dispatchCombat({ type: UPDATE_BATTLE_STATS, payload: { fought: 1, won: 1, lost: 0 } });
      addJournalEntry([`Battle: Your forces occupied the undefended ${territories[toId]?.name}.`]);
      dispatchGame({ type: SET_MESSAGE, payload: `Your forces march into the undefended ${territories[toId]?.name}!` });
      return result;
    }

    // First strike check
    const firstStrikeBonus = getFirstStrikeBonus(gameState.playerFaction, territories[toId], leaderState.leaderStates);
    let firstStrikeDamage = 0;
    if (firstStrikeBonus > 0) {
      firstStrikeDamage = 1;
      currentDefenderTroops = Math.max(0, currentDefenderTroops - firstStrikeDamage);
      if (currentDefenderTroops === 0) {
        const movers = Math.min(mapState.troops[fromId] - 1, 3);
        dispatchMap({ type: SET_TROOPS, payload: { territoryId: fromId, count: Math.max(1, mapState.troops[fromId] - movers) } });
        dispatchMap({ type: SET_TROOPS, payload: { territoryId: toId, count: Math.max(1, movers) } });
        dispatchMap({ type: CAPTURE_TERRITORY, payload: { territoryId: toId, newOwner: gameState.playerFaction } });

        if (gameState.playerFaction === 'us') {
          dispatchScore({ type: DELTA_NATIONALISM, payload: 3 });
        }

        const result = {
          success: true, conquered: true,
          attackRolls: [], defendRolls: [],
          attackerLosses: 0, defenderLosses: firstStrikeDamage,
          attackLeaderBonus: 0, defendLeaderBonus: 0,
          fortBonus: false, firstStrike: true, fromId, toId,
        };
        dispatchCombat({ type: START_BATTLE, payload: result });
        dispatchCombat({ type: UPDATE_BATTLE_STATS, payload: { fought: 1, won: 1, lost: 0 } });
        addJournalEntry([`Battle: Ambush! First strike wiped out defenders at ${territories[toId]?.name}!`]);
        dispatchGame({ type: SET_MESSAGE, payload: `Ambush! First strike wipes out defenders at ${territories[toId]?.name}!` });
        return result;
      }
    }

    const attackerTroops = mapState.troops[fromId] - 1;
    const attackDice = Math.min(attackerTroops, 3);
    const defendDice = Math.min(currentDefenderTroops, 2);

    const attackRolls = Array.from({ length: attackDice }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
    const defendRolls = Array.from({ length: defendDice }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);

    // Leader bonuses
    const MAX_BONUS = 2;
    let attackLeaderBonus = getLeaderBonus({
      faction: gameState.playerFaction,
      territory: territories[fromId],
      isAttacking: true,
      leaderStates: leaderState.leaderStates,
    });

    if (gameState.playerFaction === 'british' && territories[toId]?.isNaval) {
      attackLeaderBonus += 1;
    }
    attackLeaderBonus = Math.min(attackLeaderBonus, MAX_BONUS);

    if (attackLeaderBonus > 0 && attackRolls.length > 0) {
      attackRolls[0] = Math.min(attackRolls[0] + attackLeaderBonus, 9);
    }

    const defenderFaction = mapState.territoryOwners[toId];
    let defendLeaderBonus = getLeaderBonus({
      faction: defenderFaction,
      territory: territories[toId],
      isAttacking: false,
      leaderStates: leaderState.leaderStates,
    });

    if (defenderFaction === 'british' && territories[toId]?.isNaval) {
      defendLeaderBonus += 1;
    }

    const fortBonus = territories[toId]?.hasFort;
    if (fortBonus) {
      defendLeaderBonus += 1;
    }
    defendLeaderBonus = Math.min(defendLeaderBonus, MAX_BONUS);

    if (defendLeaderBonus > 0 && defendRolls.length > 0) {
      defendRolls[0] = Math.min(defendRolls[0] + defendLeaderBonus, 9);
    }

    let attackerLosses = 0;
    let defenderLosses = firstStrikeDamage;
    const comparisons = Math.min(attackRolls.length, defendRolls.length);
    for (let i = 0; i < comparisons; i++) {
      if (attackRolls[i] > defendRolls[i]) {
        defenderLosses++;
      } else {
        attackerLosses++;
      }
    }

    const totalDefenderTroops = mapState.troops[toId] || 0;
    const newDefenderTroops = Math.max(0, totalDefenderTroops - defenderLosses);
    const conquered = newDefenderTroops === 0;

    if (conquered) {
      const movers = Math.min(attackerTroops - attackerLosses, mapState.troops[fromId] - 1);
      dispatchMap({ type: SET_TROOPS, payload: { territoryId: fromId, count: Math.max(1, mapState.troops[fromId] - movers) } });
      dispatchMap({ type: SET_TROOPS, payload: { territoryId: toId, count: Math.max(1, movers) } });
      dispatchMap({ type: CAPTURE_TERRITORY, payload: { territoryId: toId, newOwner: gameState.playerFaction } });

      if (gameState.playerFaction === 'us') {
        if (toId === 'baltimore' || toId === 'new_orleans') {
          dispatchScore({ type: DELTA_NATIONALISM, payload: 10 });
        } else {
          dispatchScore({ type: DELTA_NATIONALISM, payload: 3 });
        }
      }
    } else {
      dispatchMap({ type: REMOVE_TROOPS, payload: { territoryId: fromId, count: attackerLosses } });
      dispatchMap({ type: REMOVE_TROOPS, payload: { territoryId: toId, count: defenderLosses } });
    }

    const result = {
      success: true,
      conquered,
      attackRolls,
      defendRolls,
      attackerLosses,
      defenderLosses,
      attackLeaderBonus,
      defendLeaderBonus,
      fortBonus: !!fortBonus,
      firstStrike: firstStrikeDamage > 0,
      fromId,
      toId,
    };

    dispatchCombat({ type: START_BATTLE, payload: result });
    dispatchCombat({
      type: UPDATE_BATTLE_STATS,
      payload: { fought: 1, won: conquered ? 1 : 0, lost: conquered ? 0 : 1 },
    });
    addJournalEntry([
      conquered
        ? `Battle: Your forces captured ${territories[toId]?.name}! (lost ${attackerLosses} troops)`
        : `Battle: Attack on ${territories[toId]?.name} repelled (lost ${attackerLosses}, enemy lost ${defenderLosses})`,
    ]);
    dispatchGame({
      type: SET_MESSAGE,
      payload: conquered
        ? `Victory! ${territories[toId]?.name} has been captured!`
        : `Battle at ${territories[toId]?.name}: you lost ${attackerLosses}, defender lost ${defenderLosses}.`,
    });

    // Check for player domination after capture
    if (conquered) {
      const postAttackOwners = { ...mapState.territoryOwners, [toId]: gameState.playerFaction };
      const dominator = checkDomination(postAttackOwners);
      if (dominator === gameState.playerFaction) {
        dispatchGame({ type: GAME_OVER, payload: {
          reason: 'domination',
          winner: gameState.playerFaction,
          message: 'Total Victory! Your forces have achieved complete domination!',
        }});
      }
    }

    return result;
  }, [currentPhase, mapState.territoryOwners, mapState.troops, gameState.playerFaction, eventState.invulnerableTerritories, leaderState.leaderStates, addJournalEntry]);

  const dismissBattle = useCallback(() => {
    dispatchCombat({ type: DISMISS_BATTLE });
    dispatchMap({ type: DESELECT_TERRITORY });
  }, []);

  // ═══════════════════════════════════════════════════════════
  // EVENT CARD HANDLING
  // ═══════════════════════════════════════════════════════════

  const dismissEvent = useCallback((quizResult) => {
    if (eventState.currentEvent) {
      const result = applyEventEffects(
        eventState.currentEvent,
        mapState.territoryOwners,
        mapState.troops,
        scoreState.nationalismMeter,
        leaderState.leaderStates
      );

      let newNationalism = result.nationalism;

      // Apply event effects
      Object.keys(result.owners).forEach(tid => {
        if (result.owners[tid] !== mapState.territoryOwners[tid]) {
          dispatchMap({ type: CAPTURE_TERRITORY, payload: { territoryId: tid, newOwner: result.owners[tid] } });
        }
      });

      Object.keys(result.troops).forEach(tid => {
        const diff = result.troops[tid] - (mapState.troops[tid] || 0);
        if (diff > 0) {
          dispatchMap({ type: ADD_TROOPS, payload: { territoryId: tid, count: diff } });
        } else if (diff < 0) {
          dispatchMap({ type: REMOVE_TROOPS, payload: { territoryId: tid, count: Math.abs(diff) } });
        }
      });

      Object.keys(result.leaders).forEach(lid => {
        if (!result.leaders[lid].alive && leaderState.leaderStates[lid].alive) {
          dispatchLeader({ type: KILL_LEADER, payload: lid });
        }
      });

      if (result.invulnerable && result.invulnerable.length > 0) {
        result.invulnerable.forEach(tid => {
          dispatchEvent({ type: ADD_INVULNERABLE_TERRITORY, payload: tid });
        });
      }

      // Apply quiz nationalism reward/penalty (troops are handled later with reinforcement calculation)
      if (quizResult?.answered && eventState.currentEvent.quiz) {
        if (quizResult.correct) {
          const reward = eventState.currentEvent.quiz.reward;
          if (reward?.nationalism && gameState.playerFaction === 'us') {
            newNationalism = Math.max(0, Math.min(100, newNationalism + reward.nationalism));
          }
          addJournalEntry([
            `Event: ${eventState.currentEvent.title} — ${eventState.currentEvent.effect}`,
            `Quiz correct! ${reward?.troops ? `+${reward.troops} bonus troops` : ''}${reward?.nationalism ? `+${reward.nationalism} nationalism` : ''}`,
          ]);
        } else {
          const penalty = eventState.currentEvent.quiz.penalty;
          if (penalty?.nationalism && gameState.playerFaction === 'us') {
            newNationalism = Math.max(0, Math.min(100, newNationalism + penalty.nationalism));
          }
          addJournalEntry([
            `Event: ${eventState.currentEvent.title} — ${eventState.currentEvent.effect}`,
            `Quiz missed. ${penalty?.nationalism ? `${penalty.nationalism} nationalism` : ''}`,
          ]);
        }
      } else {
        addJournalEntry([`Event: ${eventState.currentEvent.title} — ${eventState.currentEvent.effect}`]);
      }

      dispatchScore({ type: SET_NATIONALISM, payload: newNationalism });

      // Recalculate scores after event effects may have changed territory ownership
      const postEventOwners = result.owners;
      const newScores = { us: 0, british: 0, native: 0 };
      for (const [id, owner] of Object.entries(postEventOwners)) {
        if (owner !== 'neutral') {
          newScores[owner] = (newScores[owner] || 0) + (territories[id]?.points || 0);
        }
      }
      dispatchScore({ type: UPDATE_SCORES, payload: newScores });
    }

    dispatchEvent({ type: HIDE_EVENT_CARD });

    // Auto-advance from EVENT to ALLOCATE phase
    if (!gameState.playerFaction) {
      console.error('dismissEvent: playerFaction is null!');
      return;
    }

    // Calculate base reinforcements
    let reinforcements = calculateReinforcements(mapState.territoryOwners, gameState.playerFaction, leaderState.leaderStates, gameState.round);

    // Apply quiz troop bonus/penalty if quiz was answered
    if (quizResult?.answered && eventState.currentEvent?.quiz) {
      if (quizResult.correct && eventState.currentEvent.quiz.reward?.troops) {
        reinforcements += eventState.currentEvent.quiz.reward.troops;
      } else if (!quizResult.correct && eventState.currentEvent.quiz.penalty?.troops) {
        reinforcements = Math.max(0, reinforcements + eventState.currentEvent.quiz.penalty.troops);
      }
    }

    // Dispatch all synchronously — React 18+ batches these into one render
    dispatchCombat({ type: SET_REINFORCEMENTS, payload: reinforcements });
    dispatchGame({ type: SET_MESSAGE, payload: `You receive ${reinforcements} reinforcements. Click your territories to place troops.` });
    dispatchGame({ type: ADVANCE_PHASE });
  }, [eventState.currentEvent, mapState.territoryOwners, mapState.troops, scoreState.nationalismMeter, leaderState.leaderStates, gameState.playerFaction, gameState.round, applyEventEffects, addJournalEntry]);

  // ═══════════════════════════════════════════════════════════
  // KNOWLEDGE CHECK HANDLING
  // ═══════════════════════════════════════════════════════════

  const answerKnowledgeCheck = useCallback((correct, selectedIndex) => {
    dispatchKnowledge({ type: ANSWER_KNOWLEDGE_CHECK, payload: { correct, selectedIndex, round: gameState.round, check: knowledgeState.currentKnowledgeCheck } });

    if (knowledgeState.currentKnowledgeCheck?.required) {
      dispatchKnowledge({ type: MARK_REQUIRED_CHECK_SEEN, payload: knowledgeState.currentKnowledgeCheck.id });
    }

    if (correct && knowledgeState.currentKnowledgeCheck?.reward) {
      const reward = knowledgeState.currentKnowledgeCheck.reward;
      if (reward.type === 'troops') {
        dispatchCombat({ type: SET_REINFORCEMENTS, payload: combatState.reinforcementsRemaining + reward.count });
      } else if (reward.type === 'nationalism' && gameState.playerFaction === 'us') {
        dispatchScore({ type: DELTA_NATIONALISM, payload: reward.count });
      }
    }

    dispatchKnowledge({ type: HIDE_KNOWLEDGE_CHECK });
  }, [knowledgeState.currentKnowledgeCheck, gameState.playerFaction, gameState.round, combatState.reinforcementsRemaining]);

  const requestKnowledgeCheck = useCallback(() => {
    if (knowledgeState.showKnowledgeCheck || eventState.showEventCard || combatState.showBattleModal) return;
    const kc = drawKnowledgeCheck(gameState.round, knowledgeState.usedCheckIds, knowledgeState.requiredChecksSeen);
    if (kc) {
      dispatchKnowledge({ type: DRAW_KNOWLEDGE_CHECK, payload: kc });
      dispatchKnowledge({ type: SHOW_KNOWLEDGE_CHECK });
      dispatchKnowledge({ type: MARK_CHECK_USED, payload: kc.id });
    }
  }, [gameState.round, knowledgeState.usedCheckIds, knowledgeState.requiredChecksSeen, knowledgeState.showKnowledgeCheck, eventState.showEventCard, combatState.showBattleModal]);

  // ═══════════════════════════════════════════════════════════
  // MANEUVER HANDLING
  // ═══════════════════════════════════════════════════════════

  const requestManeuver = useCallback((fromId, toId) => {
    if (currentPhase !== 'maneuver') return;
    if (combatState.maneuversRemaining <= 0) return;
    if (mapState.territoryOwners[fromId] !== gameState.playerFaction || mapState.territoryOwners[toId] !== gameState.playerFaction) return;
    if (!areAdjacent(fromId, toId)) return;
    if ((mapState.troops[fromId] || 0) < 2) return;

    const movers = Math.min((mapState.troops[fromId] || 0) - 1, 3);

    dispatchHistory({
      type: SET_PENDING_ACTION,
      payload: {
        type: 'maneuver',
        fromId,
        toId,
        fromTerritoryName: territories[fromId]?.name,
        territoryName: territories[toId]?.name,
        troopCount: movers,
        fromCurrentTroops: mapState.troops[fromId] || 0,
        fromNewTroops: (mapState.troops[fromId] || 0) - movers,
        currentTroops: mapState.troops[toId] || 0,
        newTroops: (mapState.troops[toId] || 0) + movers,
      },
    });
  }, [currentPhase, combatState.maneuversRemaining, mapState.territoryOwners, mapState.troops, gameState.playerFaction]);

  const confirmManeuver = useCallback(() => {
    if (!historyState.pendingAction || historyState.pendingAction.type !== 'maneuver') return;
    const { fromId, toId, troopCount } = historyState.pendingAction;

    dispatchHistory({ type: SAVE_ACTION_SNAPSHOT, payload: { phase: currentPhase, type: 'maneuver', fromId, toId, movers: troopCount, previousFromTroops: mapState.troops[fromId] || 0, previousToTroops: mapState.troops[toId] || 0, previousManeuversRemaining: combatState.maneuversRemaining } });

    dispatchMap({ type: REMOVE_TROOPS, payload: { territoryId: fromId, count: troopCount } });
    dispatchMap({ type: ADD_TROOPS, payload: { territoryId: toId, count: troopCount } });
    dispatchCombat({ type: EXECUTE_MANEUVER });
    dispatchCombat({ type: CANCEL_MANEUVER });
    dispatchMap({ type: DESELECT_TERRITORY });
    dispatchHistory({ type: CLEAR_PENDING_ACTION });

    addJournalEntry([`Maneuver: Moved ${troopCount} troops from ${territories[fromId]?.name} to ${territories[toId]?.name}.`]);

    const remaining = combatState.maneuversRemaining - 1;
    dispatchGame({
      type: SET_MESSAGE,
      payload: remaining > 0
        ? `Moved ${troopCount} troops to ${territories[toId]?.name}. ${remaining} move(s) remaining.`
        : `Moved ${troopCount} troops to ${territories[toId]?.name}. No moves remaining — advance when ready.`,
    });
  }, [historyState.pendingAction, currentPhase, mapState.troops, combatState.maneuversRemaining, addJournalEntry]);

  const maneuverTroops = requestManeuver;

  const cancelAction = useCallback(() => {
    dispatchHistory({ type: CLEAR_PENDING_ACTION });
    dispatchMap({ type: DESELECT_TERRITORY });
  }, []);

  const confirmPlaceTroop = useCallback(() => {
    if (!historyState.pendingAction || historyState.pendingAction.type !== 'placement') return;
    const { territoryId } = historyState.pendingAction;

    dispatchHistory({ type: SAVE_ACTION_SNAPSHOT, payload: { phase: currentPhase, type: 'placement', territoryId, previousTroops: mapState.troops[territoryId] || 0, previousReinforcements: combatState.reinforcementsRemaining } });

    dispatchMap({ type: ADD_TROOPS, payload: { territoryId, count: 1 } });
    dispatchCombat({ type: USE_REINFORCEMENT });
    dispatchHistory({ type: CLEAR_PENDING_ACTION });
    dispatchMap({ type: DESELECT_TERRITORY });
  }, [historyState.pendingAction, currentPhase, mapState.troops, combatState.reinforcementsRemaining]);

  // ═══════════════════════════════════════════════════════════
  // PHASE ADVANCEMENT
  // ═══════════════════════════════════════════════════════════

  const doAdvancePhase = useCallback((skipConfirmation) => {
    if (eventState.showEventCard || combatState.showBattleModal || knowledgeState.showKnowledgeCheck) return;

    // Check for unused resources
    if (!skipConfirmation) {
      if (currentPhase === 'allocate' && combatState.reinforcementsRemaining > 0) {
        dispatchHistory({
          type: SET_PENDING_ADVANCE,
          payload: `You have ${combatState.reinforcementsRemaining} reinforcement${combatState.reinforcementsRemaining > 1 ? 's' : ''} remaining. They will be lost if you advance.`,
        });
        return;
      }
      if (currentPhase === 'maneuver' && combatState.maneuversRemaining > 0) {
        dispatchHistory({
          type: SET_PENDING_ADVANCE,
          payload: `You have ${combatState.maneuversRemaining} move${combatState.maneuversRemaining > 1 ? 's' : ''} remaining.`,
        });
        return;
      }
    }
    dispatchHistory({ type: CLEAR_PENDING_ADVANCE });

    // Auto-save
    try {
      const saveData = {
        version: 1,
        timestamp: Date.now(),
        playerFaction: gameState.playerFaction,
        playerName: gameState.playerName,
        classPeriod: gameState.classPeriod,
        gameMode: gameState.gameMode,
        round: gameState.round,
        phase: gameState.phaseIndex,
        territoryOwners: mapState.territoryOwners,
        troops: mapState.troops,
        scores: scoreState.scores,
        nationalismMeter: scoreState.nationalismMeter,
        reinforcementsRemaining: combatState.reinforcementsRemaining,
        leaderStates: leaderState.leaderStates,
        usedEventIds: eventState.usedEventIds,
        usedCheckIds: knowledgeState.usedCheckIds,
        requiredChecksSeen: knowledgeState.requiredChecksSeen,
        knowledgeCheckResults: knowledgeState.knowledgeCheckResults,
        knowledgeCheckHistory: knowledgeState.knowledgeCheckHistory,
        journalEntries: historyState.journalEntries,
        battleStats: combatState.battleStats,
        invulnerableTerritories: eventState.invulnerableTerritories,
      };
      localStorage.setItem('war1812_save', JSON.stringify(saveData));
    } catch (error) {
      console.error('Auto-save failed:', error);
    }

    // Save snapshot for undo
    dispatchHistory({
      type: SAVE_PHASE_SNAPSHOT,
      payload: {
        phase: gameState.phaseIndex,
        troops: mapState.troops,
        territoryOwners: mapState.territoryOwners,
        reinforcementsRemaining: combatState.reinforcementsRemaining,
        maneuversRemaining: combatState.maneuversRemaining,
      },
    });

    const nextPhaseIndex = gameState.phaseIndex + 1;

    if (nextPhaseIndex >= PHASES.length) {
      // End of player turn - run AI turns
      const opponentFactions = ALL_FACTIONS.filter((f) => f !== gameState.playerFaction);
      let aiOwners = { ...mapState.territoryOwners };
      let aiTroops = { ...mapState.troops };
      const allLogs = [];
      const allActions = [];

      for (const faction of opponentFactions) {
        const hasTerritories = Object.values(aiOwners).some((o) => o === faction);
        if (!hasTerritories) continue;

        const result = runAITurn(faction, aiOwners, aiTroops, leaderState.leaderStates, eventState.invulnerableTerritories, gameState.round);
        aiOwners = result.territoryOwners;
        aiTroops = result.troops;
        allLogs.push(...result.log);
        allActions.push(...result.actions);
      }

      // Apply AI changes
      Object.keys(aiOwners).forEach(tid => {
        if (aiOwners[tid] !== mapState.territoryOwners[tid]) {
          dispatchMap({ type: CAPTURE_TERRITORY, payload: { territoryId: tid, newOwner: aiOwners[tid] } });
        }
      });

      Object.keys(aiTroops).forEach(tid => {
        dispatchMap({ type: SET_TROOPS, payload: { territoryId: tid, count: aiTroops[tid] } });
      });

      allLogs.forEach(log => dispatchAI({ type: ADD_AI_LOG, payload: log }));
      dispatchAI({ type: SET_AI_ACTIONS, payload: allActions });

      if (allActions.length > 0) {
        dispatchAI({ type: SHOW_AI_REPLAY });
      }

      if (allLogs.length > 0) {
        addJournalEntry(allLogs.map((l) => `Opponent: ${l}`));
      }

      // Update scores
      const newScores = { us: 0, british: 0, native: 0 };
      for (const [id, owner] of Object.entries(aiOwners)) {
        if (owner !== 'neutral') {
          newScores[owner] = (newScores[owner] || 0) + (territories[id]?.points || 0);
        }
      }
      dispatchScore({ type: UPDATE_SCORES, payload: newScores });

      // Check for domination (any faction controls all territories)
      const dominator = checkDomination(aiOwners);
      if (dominator) {
        const factionNames = { us: 'United States', british: 'British/Canada', native: 'Native Coalition' };
        if (dominator === gameState.playerFaction) {
          dispatchGame({ type: GAME_OVER, payload: {
            reason: 'domination',
            winner: dominator,
            message: 'Total Victory! Your forces have achieved complete domination!',
          }});
        } else {
          dispatchGame({ type: GAME_OVER, payload: {
            reason: 'domination',
            winner: dominator,
            message: `Defeated! ${factionNames[dominator] || dominator} has achieved total control of the theater.`,
          }});
        }
        return;
      }

      // Check for US nationalism changes
      if (gameState.playerFaction === 'us') {
        const lostDC = mapState.territoryOwners.washington_dc === 'us' && aiOwners.washington_dc !== 'us';
        const lostBaltimore = mapState.territoryOwners.baltimore === 'us' && aiOwners.baltimore !== 'us';
        if (lostDC) dispatchScore({ type: DELTA_NATIONALISM, payload: -10 });
        if (lostBaltimore) dispatchScore({ type: DELTA_NATIONALISM, payload: -8 });
      }

      // Check for elimination
      const playerTerritories = Object.values(aiOwners).filter((o) => o === gameState.playerFaction).length;
      if (playerTerritories === 0) {
        dispatchGame({ type: GAME_OVER, payload: {
          reason: 'elimination',
          winner: null,
          message: 'Your faction has been eliminated! The war is over.',
        }});
        return;
      }

      // Advance to next round
      const nextRound = gameState.round + 1;
      if (nextRound > TOTAL_ROUNDS) {
        dispatchGame({ type: GAME_OVER, payload: {
          reason: 'treaty',
          winner: null,
          message: 'The Treaty of Ghent has been signed. The war is over!',
        }});
        return;
      }

      dispatchGame({ type: ADVANCE_ROUND });
      dispatchEvent({ type: CLEAR_INVULNERABLE_TERRITORIES });

      // Draw next event — defer showing it if AI replay is active
      const event = drawEventCard(nextRound, eventState.usedEventIds);
      if (event) {
        dispatchEvent({ type: DRAW_EVENT, payload: event });
        dispatchEvent({ type: MARK_EVENT_USED, payload: event.id });
        if (allActions.length > 0) {
          // AI replay is showing — defer event card until replay closes
          pendingEventAfterReplay.current = true;
        } else {
          dispatchEvent({ type: SHOW_EVENT_CARD });
        }
      }

      const logSummary = allLogs.length > 0 ? ' | ' + allLogs.join(' ') : '';
      dispatchGame({ type: SET_MESSAGE, payload: `Round ${nextRound} — ${getSeasonYear(nextRound)}${logSummary}` });
      return;
    }

    // Advance within player turn
    dispatchGame({ type: ADVANCE_PHASE });

    const nextPhase = PHASES[nextPhaseIndex];
    if (nextPhase === 'allocate') {
      const reinforcements = calculateReinforcements(mapState.territoryOwners, gameState.playerFaction, leaderState.leaderStates, gameState.round);
      dispatchCombat({ type: SET_REINFORCEMENTS, payload: reinforcements });
      dispatchGame({ type: SET_MESSAGE, payload: `You receive ${reinforcements} reinforcements. Click your territories to place troops.` });
    } else if (nextPhase === 'battle') {
      dispatchGame({ type: SET_MESSAGE, payload: 'Select one of your territories, then click an adjacent enemy territory to attack. Advance phase when done.' });
      dispatchMap({ type: DESELECT_TERRITORY });
    } else if (nextPhase === 'maneuver') {
      dispatchCombat({ type: SET_MANEUVERS, payload: 2 });
      dispatchCombat({ type: CANCEL_MANEUVER });
      dispatchMap({ type: DESELECT_TERRITORY });
      dispatchGame({ type: SET_MESSAGE, payload: 'Maneuver phase: select your territory to move troops FROM, then click an adjacent territory you own. (2 moves available)' });
    } else if (nextPhase === 'score') {
      dispatchCombat({ type: CANCEL_MANEUVER });
      dispatchAI({ type: CLEAR_AI_LOG });

      const kc = drawKnowledgeCheck(gameState.round, knowledgeState.usedCheckIds, knowledgeState.requiredChecksSeen);
      if (kc) {
        dispatchKnowledge({ type: DRAW_KNOWLEDGE_CHECK, payload: kc });
        dispatchKnowledge({ type: SHOW_KNOWLEDGE_CHECK });
        dispatchKnowledge({ type: MARK_CHECK_USED, payload: kc.id });
        dispatchGame({ type: SET_MESSAGE, payload: 'Review your turn and answer a knowledge check before ending.' });
      } else {
        dispatchGame({ type: SET_MESSAGE, payload: 'Review the board and scores. Advance to end your turn and let opponents move.' });
      }
    }
  }, [currentPhase, eventState.showEventCard, eventState.usedEventIds, eventState.invulnerableTerritories, combatState.showBattleModal, combatState.reinforcementsRemaining, combatState.maneuversRemaining, knowledgeState.showKnowledgeCheck, knowledgeState.usedCheckIds, knowledgeState.requiredChecksSeen, gameState.playerFaction, gameState.round, gameState.phaseIndex, gameState.playerName, gameState.classPeriod, gameState.gameMode, mapState.territoryOwners, mapState.troops, scoreState.scores, scoreState.nationalismMeter, leaderState.leaderStates, combatState.battleStats, knowledgeState.knowledgeCheckResults, knowledgeState.knowledgeCheckHistory, historyState.journalEntries, addJournalEntry]);

  const advancePhase = useCallback(() => doAdvancePhase(false), [doAdvancePhase]);
  const confirmAdvance = useCallback(() => doAdvancePhase(true), [doAdvancePhase]);
  const cancelAdvance = useCallback(() => {
    dispatchHistory({ type: CLEAR_PENDING_ADVANCE });
  }, []);

  // ═══════════════════════════════════════════════════════════
  // UNDO FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════

  const undoLastAction = useCallback(() => {
    if (historyState.actionHistory.length === 0) return;
    if (currentPhase === 'battle') return;

    const lastAction = historyState.actionHistory[historyState.actionHistory.length - 1];
    if (lastAction.phase !== currentPhase) {
      dispatchGame({ type: SET_MESSAGE, payload: 'Can only undo actions from the current phase.' });
      return;
    }

    if (lastAction.type === 'placement') {
      dispatchMap({ type: SET_TROOPS, payload: { territoryId: lastAction.territoryId, count: lastAction.previousTroops } });
      dispatchCombat({ type: SET_REINFORCEMENTS, payload: lastAction.previousReinforcements });
      dispatchGame({ type: SET_MESSAGE, payload: `Undid deployment to ${territories[lastAction.territoryId]?.name}.` });
    } else if (lastAction.type === 'maneuver') {
      dispatchMap({ type: SET_TROOPS, payload: { territoryId: lastAction.fromId, count: lastAction.previousFromTroops } });
      dispatchMap({ type: SET_TROOPS, payload: { territoryId: lastAction.toId, count: lastAction.previousToTroops } });
      dispatchCombat({ type: SET_MANEUVERS, payload: lastAction.previousManeuversRemaining });
      dispatchGame({ type: SET_MESSAGE, payload: `Undid maneuver from ${territories[lastAction.fromId]?.name} to ${territories[lastAction.toId]?.name}.` });
    }

    dispatchHistory({ type: REMOVE_LAST_ACTION });
  }, [historyState.actionHistory, currentPhase]);

  const goBackPhase = useCallback(() => {
    if (historyState.phaseHistory.length === 0) return;
    const snapshot = historyState.phaseHistory[historyState.phaseHistory.length - 1];

    dispatchGame({ type: ADVANCE_PHASE, payload: { overridePhaseIndex: snapshot.phase } });
    Object.keys(snapshot.troops).forEach(tid => {
      dispatchMap({ type: SET_TROOPS, payload: { territoryId: tid, count: snapshot.troops[tid] } });
    });
    Object.keys(snapshot.territoryOwners).forEach(tid => {
      if (snapshot.territoryOwners[tid] !== mapState.territoryOwners[tid]) {
        dispatchMap({ type: CAPTURE_TERRITORY, payload: { territoryId: tid, newOwner: snapshot.territoryOwners[tid] } });
      }
    });
    dispatchCombat({ type: SET_REINFORCEMENTS, payload: snapshot.reinforcementsRemaining });
    dispatchCombat({ type: SET_MANEUVERS, payload: snapshot.maneuversRemaining });
    dispatchMap({ type: DESELECT_TERRITORY });
    dispatchCombat({ type: CANCEL_MANEUVER });
    dispatchHistory({ type: CLEAR_PENDING_ADVANCE });

    dispatchGame({ type: SET_MESSAGE, payload: `Returned to ${PHASE_LABELS[PHASES[snapshot.phase]]} phase.` });
  }, [historyState.phaseHistory, mapState.territoryOwners]);

  // ═══════════════════════════════════════════════════════════
  // TERRITORY CLICK HANDLER
  // ═══════════════════════════════════════════════════════════

  const handleTerritoryClick = useCallback(
    (id) => {
      if (eventState.showEventCard || combatState.showBattleModal || knowledgeState.showKnowledgeCheck) {
        return;
      }

      if (currentPhase === 'allocate') {
        if (mapState.selectedTerritory === id) {
          placeTroop(id);
        } else {
          selectTerritory(id);
        }
      } else if (currentPhase === 'battle') {
        if (!mapState.selectedTerritory) {
          if (mapState.territoryOwners[id] === gameState.playerFaction) {
            if ((mapState.troops[id] || 0) < 2) {
              dispatchGame({ type: SET_MESSAGE, payload: `${territories[id]?.name} needs at least 2 troops to attack from.` });
              return;
            }
            selectTerritory(id);
            dispatchGame({ type: SET_MESSAGE, payload: `Selected ${territories[id]?.name}. Click an adjacent enemy territory to attack, or click again to deselect.` });
          }
        } else if (mapState.selectedTerritory === id) {
          dispatchMap({ type: DESELECT_TERRITORY });
          dispatchGame({ type: SET_MESSAGE, payload: 'Attack cancelled. Select a territory to attack from.' });
        } else {
          if (mapState.territoryOwners[id] === gameState.playerFaction) {
            if ((mapState.troops[id] || 0) >= 2) {
              selectTerritory(id);
              dispatchGame({ type: SET_MESSAGE, payload: `Switched to ${territories[id]?.name}. Click an adjacent enemy territory to attack.` });
            }
            return;
          }
          if (!areAdjacent(mapState.selectedTerritory, id)) {
            dispatchGame({ type: SET_MESSAGE, payload: `${territories[id]?.name} is not adjacent to ${territories[mapState.selectedTerritory]?.name}.` });
            return;
          }
          attack(mapState.selectedTerritory, id);
          dispatchMap({ type: DESELECT_TERRITORY });
        }
      } else if (currentPhase === 'maneuver') {
        if (combatState.maneuversRemaining <= 0) {
          dispatchGame({ type: SET_MESSAGE, payload: 'No maneuvers remaining. Advance to end your turn.' });
          return;
        }
        if (!combatState.maneuverFrom) {
          if (mapState.territoryOwners[id] !== gameState.playerFaction) return;
          if ((mapState.troops[id] || 0) < 2) {
            dispatchGame({ type: SET_MESSAGE, payload: `${territories[id]?.name} needs at least 2 troops to move from.` });
            return;
          }
          dispatchCombat({ type: START_MANEUVER, payload: id });
          selectTerritory(id);
          dispatchGame({ type: SET_MESSAGE, payload: `Selected ${territories[id]?.name} (${mapState.troops[id]} troops). Click an adjacent friendly territory to move troops, or click again to cancel.` });
        } else if (combatState.maneuverFrom === id) {
          dispatchCombat({ type: CANCEL_MANEUVER });
          selectTerritory(null);
          dispatchGame({ type: SET_MESSAGE, payload: 'Maneuver cancelled. Select a territory to move troops from.' });
        } else {
          if (mapState.territoryOwners[id] !== gameState.playerFaction) {
            dispatchGame({ type: SET_MESSAGE, payload: 'You can only maneuver troops to territories you own.' });
            return;
          }
          if (!areAdjacent(combatState.maneuverFrom, id)) {
            dispatchGame({ type: SET_MESSAGE, payload: `${territories[id]?.name} is not adjacent to ${territories[combatState.maneuverFrom]?.name}.` });
            return;
          }
          maneuverTroops(combatState.maneuverFrom, id);
        }
      } else {
        selectTerritory(id);
      }
    },
    [
      currentPhase,
      eventState.showEventCard,
      combatState.showBattleModal,
      combatState.maneuversRemaining,
      combatState.maneuverFrom,
      knowledgeState.showKnowledgeCheck,
      mapState.selectedTerritory,
      mapState.territoryOwners,
      mapState.troops,
      gameState.playerFaction,
      placeTroop,
      selectTerritory,
      attack,
      maneuverTroops,
    ]
  );

  // ═══════════════════════════════════════════════════════════
  // SAVE/LOAD FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════

  const saveGame = useCallback(() => {
    const saveData = {
      version: 1,
      timestamp: Date.now(),
      playerFaction: gameState.playerFaction,
      playerName: gameState.playerName,
      classPeriod: gameState.classPeriod,
      gameMode: gameState.gameMode,
      round: gameState.round,
      phase: gameState.phaseIndex,
      territoryOwners: mapState.territoryOwners,
      troops: mapState.troops,
      scores: scoreState.scores,
      nationalismMeter: scoreState.nationalismMeter,
      reinforcementsRemaining: combatState.reinforcementsRemaining,
      leaderStates: leaderState.leaderStates,
      usedEventIds: eventState.usedEventIds,
      usedCheckIds: knowledgeState.usedCheckIds,
      requiredChecksSeen: knowledgeState.requiredChecksSeen,
      knowledgeCheckResults: knowledgeState.knowledgeCheckResults,
      knowledgeCheckHistory: knowledgeState.knowledgeCheckHistory,
      journalEntries: historyState.journalEntries,
      battleStats: combatState.battleStats,
      invulnerableTerritories: eventState.invulnerableTerritories,
    };
    try {
      localStorage.setItem('war1812_save', JSON.stringify(saveData));
      return true;
    } catch {
      return false;
    }
  }, [gameState, mapState, combatState, eventState, knowledgeState, scoreState, leaderState, historyState]);

  const loadGame = useCallback(() => {
    try {
      const raw = localStorage.getItem('war1812_save');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.version !== 1) return false;

      // Loading a save means the player already knows how to play
      localStorage.setItem('war1812_tutorial_completed', 'true');

      // Restore all 9 reducer states from save data
      dispatchGame({ type: LOAD_GAME_STATE, payload: {
        status: 'in_progress',
        playerFaction: data.playerFaction,
        playerName: data.playerName,
        classPeriod: data.classPeriod,
        gameMode: data.gameMode || 'historian',
        round: data.round,
        phaseIndex: data.phase,
        message: `Game loaded — Round ${data.round}, ${getSeasonYear(data.round)}.`,
      }});

      dispatchMap({ type: LOAD_MAP_STATE, payload: {
        territoryOwners: data.territoryOwners,
        troops: data.troops,
      }});

      dispatchCombat({ type: LOAD_COMBAT_STATE, payload: {
        reinforcementsRemaining: data.reinforcementsRemaining || 0,
        battleStats: data.battleStats || { fought: 0, won: 0, lost: 0 },
      }});

      dispatchEvent({ type: LOAD_EVENT_STATE, payload: {
        usedEventIds: data.usedEventIds || [],
        invulnerableTerritories: data.invulnerableTerritories || [],
      }});

      dispatchKnowledge({ type: LOAD_KNOWLEDGE_STATE, payload: {
        usedCheckIds: data.usedCheckIds || [],
        requiredChecksSeen: data.requiredChecksSeen || [],
        knowledgeCheckResults: data.knowledgeCheckResults || { total: 0, correct: 0 },
        knowledgeCheckHistory: data.knowledgeCheckHistory || [],
      }});

      dispatchScore({ type: LOAD_SCORE_STATE, payload: {
        scores: data.scores || { us: 0, british: 0, native: 0 },
        nationalismMeter: data.nationalismMeter || 0,
      }});

      dispatchAI({ type: LOAD_AI_STATE });

      dispatchLeader({ type: LOAD_LEADER_STATE, payload: {
        leaderStates: data.leaderStates || {},
      }});

      dispatchHistory({ type: LOAD_HISTORY_STATE, payload: {
        journalEntries: data.journalEntries || [],
      }});

      return true;
    } catch {
      return false;
    }
  }, []);

  const hasSavedGame = useCallback(() => {
    try {
      const raw = localStorage.getItem('war1812_save');
      if (!raw) return null;
      const data = JSON.parse(raw);
      return {
        playerName: data.playerName,
        faction: data.playerFaction,
        round: data.round,
        season: getSeasonYear(data.round),
        timestamp: data.timestamp,
      };
    } catch {
      return null;
    }
  }, []);

  const deleteSave = useCallback(() => {
    localStorage.removeItem('war1812_save');
  }, []);

  const exportSaveFile = useCallback(() => {
    try {
      const saveData = localStorage.getItem('war1812_save');
      if (!saveData) {
        return { success: false, error: 'No save file found' };
      }

      const blob = new Blob([saveData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `war1812_save_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Failed to export save file:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const importSaveFile = useCallback((fileContent) => {
    try {
      const data = JSON.parse(fileContent);
      if (!data.version || !data.playerFaction) {
        return { success: false, error: 'Invalid save file format' };
      }
      localStorage.setItem('war1812_save', fileContent);
      const loaded = loadGame();
      if (!loaded) {
        return { success: false, error: 'Failed to load imported save' };
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to import save file:', error);
      return { success: false, error: 'Invalid JSON file' };
    }
  }, [loadGame]);

  // ═══════════════════════════════════════════════════════════
  // RETURN PUBLIC API (matches original)
  // ═══════════════════════════════════════════════════════════

  return {
    // State
    gameStarted: gameState.status === 'in_progress',
    gameOver: gameState.status === 'game_over',
    gameOverReason: gameState.gameOverReason,
    gameOverWinner: gameState.gameOverWinner,
    playerFaction: gameState.playerFaction,
    playerName: gameState.playerName,
    classPeriod: gameState.classPeriod,
    gameMode: gameState.gameMode,
    round: gameState.round,
    totalRounds: TOTAL_ROUNDS,
    currentPhase,
    currentPhaseLabel,
    seasonYear,
    territoryOwners: mapState.territoryOwners,
    troops: mapState.troops,
    selectedTerritory: mapState.selectedTerritory,
    scores: scoreState.scores,
    nationalismMeter: scoreState.nationalismMeter,
    reinforcementsRemaining: combatState.reinforcementsRemaining,
    showIntro: gameState.showIntro,
    currentEvent: eventState.currentEvent,
    showEventCard: eventState.showEventCard,
    battleResult: combatState.battleResult,
    showBattleModal: combatState.showBattleModal,
    message: gameState.message,
    playerTerritoryCount,
    finalScore,
    objectiveBonus,
    leaderStates: leaderState.leaderStates,
    aiLog: aiState.aiLog,
    aiActions: aiState.aiActions,
    showAIReplay: aiState.showAIReplay,
    playerObjectives,
    currentKnowledgeCheck: knowledgeState.currentKnowledgeCheck,
    showKnowledgeCheck: knowledgeState.showKnowledgeCheck,
    knowledgeCheckResults: knowledgeState.knowledgeCheckResults,
    knowledgeCheckHistory: knowledgeState.knowledgeCheckHistory,
    journalEntries: historyState.journalEntries,
    battleStats: combatState.battleStats,
    maneuverFrom: combatState.maneuverFrom,
    maneuversRemaining: combatState.maneuversRemaining,
    nativeResistance,
    navalDominance,
    factionMultiplier,
    phaseHistory: historyState.phaseHistory,
    pendingAdvance: historyState.pendingAdvance,
    pendingAdvanceMessage: historyState.pendingAdvanceMessage,
    pendingAction: historyState.pendingAction,
    actionHistory: historyState.actionHistory,

    // Actions
    startGame,
    resetGame,
    advancePhase,
    confirmAdvance,
    cancelAdvance,
    goBackPhase,
    undoLastAction,
    handleTerritoryClick,
    placeTroop,
    confirmPlaceTroop,
    confirmManeuver,
    cancelAction,
    attack,
    selectTerritory,
    dismissEvent,
    dismissBattle,
    answerKnowledgeCheck,
    requestKnowledgeCheck,
    setMessage: (msg) => dispatchGame({ type: SET_MESSAGE, payload: msg }),
    setBattleResult: (result) => dispatchCombat({ type: START_BATTLE, payload: result }),
    saveGame,
    loadGame,
    hasSavedGame,
    deleteSave,
    exportSaveFile,
    importSaveFile,
    dismissIntro,
    closeAIReplay: () => {
      dispatchAI({ type: HIDE_AI_REPLAY });
      if (pendingEventAfterReplay.current) {
        pendingEventAfterReplay.current = false;
        dispatchEvent({ type: SHOW_EVENT_CARD });
      }
    },
  };
}
