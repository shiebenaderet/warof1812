import { useState, useCallback, useMemo } from 'react';
import territories, { areAdjacent } from '../data/territories';
import { drawEventCard } from '../data/eventCards';
import { drawKnowledgeCheck } from '../data/knowledgeChecks';
import { checkObjectives, getObjectiveBonus } from '../data/objectives';
import { getLeaderBonus, getLeaderRallyBonus, getFirstStrikeBonus } from '../data/leaders';
import leadersData from '../data/leaders';
import { runAITurn } from './useAI';

const TOTAL_ROUNDS = 12; // 1812–1815, ~1 round per season

const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const getSeasonYear = (round) => {
  const year = 1812 + Math.floor((round - 1) / 4);
  const season = SEASONS[(round - 1) % 4];
  return `${season} ${year}`;
};

const PHASES = ['event', 'allocate', 'battle', 'score'];
const PHASE_LABELS = {
  event: 'Draw Event Card',
  allocate: 'Allocate Forces',
  battle: 'Battle',
  score: 'Score Update',
};

const ALL_FACTIONS = ['us', 'british', 'native'];

function calculateReinforcements(territoryOwners, faction, leaderStates) {
  const owned = Object.entries(territoryOwners).filter(([, owner]) => owner === faction);
  const base = 3 + Math.floor(owned.length / 2);
  const leaderBonus = getLeaderRallyBonus(faction, leaderStates);
  return base + leaderBonus;
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
    } else if (terr.hasFort) {
      troops[id] = 4;
    } else {
      troops[id] = 2;
    }
  }
  return troops;
}

function initLeaderStates() {
  const states = {};
  for (const [id, leader] of Object.entries(leadersData)) {
    states[id] = { alive: leader.alive };
  }
  return states;
}

export default function useGameState() {
  // ── Core state ──
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerFaction, setPlayerFaction] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [classPeriod, setClassPeriod] = useState('');

  // ── Turn tracking ──
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState(0);

  // ── Map state ──
  const [territoryOwners, setTerritoryOwners] = useState(initTerritoryOwners);
  const [troops, setTroops] = useState(initTroops);
  const [selectedTerritory, setSelectedTerritory] = useState(null);

  // ── Score tracking ──
  const [scores, setScores] = useState({ us: 0, british: 0, native: 0 });
  const [nationalismMeter, setNationalismMeter] = useState(0);
  const [reinforcementsRemaining, setReinforcementsRemaining] = useState(0);

  // ── Event system ──
  const [currentEvent, setCurrentEvent] = useState(null);
  const [usedEventIds, setUsedEventIds] = useState([]);
  const [showEventCard, setShowEventCard] = useState(false);

  // ── Leaders ──
  const [leaderStates, setLeaderStates] = useState(initLeaderStates);

  // ── Battle UI ──
  const [battleResult, setBattleResult] = useState(null);
  const [showBattleModal, setShowBattleModal] = useState(false);

  // ── AI log ──
  const [aiLog, setAiLog] = useState([]);

  // ── Invulnerable territories (lasts one round, e.g. Fort McHenry) ──
  const [invulnerableTerritories, setInvulnerableTerritories] = useState([]);

  // ── Knowledge checks ──
  const [currentKnowledgeCheck, setCurrentKnowledgeCheck] = useState(null);
  const [showKnowledgeCheck, setShowKnowledgeCheck] = useState(false);
  const [usedCheckIds, setUsedCheckIds] = useState([]);

  // ── General UI ──
  const [message, setMessage] = useState('');

  // ── Derived state ──
  const currentPhase = PHASES[phase];
  const currentPhaseLabel = PHASE_LABELS[currentPhase];
  const seasonYear = getSeasonYear(round);

  const playerTerritoryCount = useMemo(
    () => Object.values(territoryOwners).filter((o) => o === playerFaction).length,
    [territoryOwners, playerFaction]
  );

  // ── Objectives (checked live) ──
  const playerObjectives = useMemo(
    () => playerFaction ? checkObjectives(playerFaction, { territoryOwners, troops, nationalismMeter }) : [],
    [playerFaction, territoryOwners, troops, nationalismMeter]
  );

  // ── Apply event card effects ──
  const applyEventEffects = useCallback((event, currentOwners, currentTroops, currentNationalism, currentLeaders) => {
    if (!event || !event.apply) return { owners: currentOwners, troops: currentTroops, nationalism: currentNationalism, leaders: currentLeaders };

    const gameState = {
      territoryOwners: currentOwners,
      troops: currentTroops,
      scores,
      playerFaction,
    };
    const effects = event.apply(gameState);
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
      if (targetTerrs && targetTerrs.length > 0) {
        // Distribute evenly across specified territories
        let remaining = count;
        let idx = 0;
        while (remaining > 0) {
          const tid = targetTerrs[idx % targetTerrs.length];
          newTroops[tid] = (newTroops[tid] || 0) + 1;
          remaining--;
          idx++;
        }
      } else if (theater) {
        // Add to first owned territory in that theater
        const candidates = Object.entries(newOwners)
          .filter(([id, owner]) => owner === faction && territories[id]?.theater === theater);
        if (candidates.length > 0) {
          let remaining = count;
          let idx = 0;
          while (remaining > 0) {
            const [tid] = candidates[idx % candidates.length];
            newTroops[tid] = (newTroops[tid] || 0) + 1;
            remaining--;
            idx++;
          }
        }
      } else if (territory) {
        newTroops[territory] = (newTroops[territory] || 0) + count;
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
        // Spread losses across all faction territories
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
    if (effects.nationalismChange && playerFaction === 'us') {
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
  }, [scores, playerFaction]);

  // ── Actions ──

  const startGame = useCallback(({ faction, playerName: name, classPeriod: period }) => {
    setPlayerFaction(faction);
    setPlayerName(name);
    setClassPeriod(period);
    setGameStarted(true);
    setGameOver(false);
    setRound(1);
    setPhase(0);
    setTerritoryOwners(initTerritoryOwners());
    setTroops(initTroops());
    setScores({ us: 0, british: 0, native: 0 });
    setNationalismMeter(10);
    setReinforcementsRemaining(0);
    setLeaderStates(initLeaderStates());
    setUsedEventIds([]);
    setCurrentEvent(null);
    setShowEventCard(false);
    setBattleResult(null);
    setShowBattleModal(false);
    setAiLog([]);
    setInvulnerableTerritories([]);
    setCurrentKnowledgeCheck(null);
    setShowKnowledgeCheck(false);
    setUsedCheckIds([]);

    // Draw the first event card immediately
    const event = drawEventCard(1, []);
    if (event) {
      setCurrentEvent(event);
      setShowEventCard(true);
      setUsedEventIds([event.id]);
    }

    setMessage(`The war begins! You command the ${faction === 'us' ? 'United States' : faction === 'british' ? 'British/Canadian' : 'Native Coalition'} forces.`);
  }, []);

  const selectTerritory = useCallback((id) => {
    setSelectedTerritory((prev) => (prev === id ? null : id));
  }, []);

  const dismissEvent = useCallback(() => {
    // Apply event effects
    if (currentEvent) {
      const result = applyEventEffects(currentEvent, territoryOwners, troops, nationalismMeter, leaderStates);
      setTerritoryOwners(result.owners);
      setTroops(result.troops);
      setNationalismMeter(result.nationalism);
      setLeaderStates(result.leaders);
      if (result.invulnerable && result.invulnerable.length > 0) {
        setInvulnerableTerritories((prev) => [...prev, ...result.invulnerable]);
      }
    }
    setShowEventCard(false);
  }, [currentEvent, applyEventEffects, territoryOwners, troops, nationalismMeter, leaderStates]);

  const dismissBattle = useCallback(() => {
    setShowBattleModal(false);
  }, []);

  const answerKnowledgeCheck = useCallback((correct) => {
    if (correct && currentKnowledgeCheck?.reward) {
      const reward = currentKnowledgeCheck.reward;
      if (reward.type === 'troops') {
        setReinforcementsRemaining((prev) => prev + reward.count);
      } else if (reward.type === 'nationalism' && playerFaction === 'us') {
        setNationalismMeter((prev) => Math.min(100, prev + reward.count));
      }
    }
    setShowKnowledgeCheck(false);
    setCurrentKnowledgeCheck(null);
  }, [currentKnowledgeCheck, playerFaction]);

  const advancePhase = useCallback(() => {
    // Don't advance while modals are open
    if (showEventCard || showBattleModal || showKnowledgeCheck) return;

    const next = phase + 1;

    if (next >= PHASES.length) {
      // ── End of player turn — run AI turns ──
      const opponentFactions = ALL_FACTIONS.filter((f) => f !== playerFaction);
      let aiOwners = { ...territoryOwners };
      let aiTroops = { ...troops };
      const allLogs = [];

      for (const faction of opponentFactions) {
        // Check if faction still has territories
        const hasTerritories = Object.values(aiOwners).some((o) => o === faction);
        if (!hasTerritories) continue;

        const result = runAITurn(faction, aiOwners, aiTroops, leaderStates, invulnerableTerritories);
        aiOwners = result.territoryOwners;
        aiTroops = result.troops;
        allLogs.push(...result.log);
      }

      setTerritoryOwners(aiOwners);
      setTroops(aiTroops);
      setAiLog(allLogs);

      // ── Score phase ──
      setScores((prev) => {
        const newScores = { ...prev };
        for (const [id, owner] of Object.entries(aiOwners)) {
          if (owner !== 'neutral') {
            newScores[owner] = (newScores[owner] || 0) + (territories[id]?.points || 0);
          }
        }
        return newScores;
      });

      // ── Check for US nationalism changes from AI actions ──
      if (playerFaction === 'us') {
        // If US lost key territories during AI turn, nationalism drops
        const lostDC = territoryOwners.washington_dc === 'us' && aiOwners.washington_dc !== 'us';
        const lostBaltimore = territoryOwners.baltimore === 'us' && aiOwners.baltimore !== 'us';
        if (lostDC) setNationalismMeter((prev) => Math.max(0, prev - 10));
        if (lostBaltimore) setNationalismMeter((prev) => Math.max(0, prev - 8));
      }

      // ── Advance to next round ──
      const nextRound = round + 1;
      if (nextRound > TOTAL_ROUNDS) {
        setGameOver(true);
        setPhase(3); // stay on score
        setMessage('The Treaty of Ghent has been signed. The war is over!');
        return;
      }

      setRound(nextRound);
      setPhase(0); // back to event phase
      setInvulnerableTerritories([]); // clear round-based invulnerability

      // Draw next event card
      const event = drawEventCard(nextRound, usedEventIds);
      if (event) {
        setCurrentEvent(event);
        setShowEventCard(true);
        setUsedEventIds((prev) => [...prev, event.id]);
      }

      const logSummary = allLogs.length > 0 ? ' | ' + allLogs.join(' ') : '';
      setMessage(`Round ${nextRound} — ${getSeasonYear(nextRound)}${logSummary}`);
      return;
    }

    // ── Advance within player turn ──
    setPhase(next);

    if (PHASES[next] === 'allocate') {
      const reinforcements = calculateReinforcements(territoryOwners, playerFaction, leaderStates);
      setReinforcementsRemaining(reinforcements);
      setMessage(`You receive ${reinforcements} reinforcements. Click your territories to place troops.`);
      setBattleResult(null);
    } else if (PHASES[next] === 'battle') {
      setMessage('Select one of your territories, then click an adjacent enemy territory to attack. Advance phase when done.');
      setSelectedTerritory(null);
      setBattleResult(null);

      // Draw a knowledge check question (every other round)
      if (round % 2 === 0) {
        const kc = drawKnowledgeCheck(round, usedCheckIds);
        if (kc) {
          setCurrentKnowledgeCheck(kc);
          setShowKnowledgeCheck(true);
          setUsedCheckIds((prev) => [...prev, kc.id]);
        }
      }
    } else if (PHASES[next] === 'score') {
      setMessage('Review the board and scores. Advance to end your turn and let opponents move.');
      setBattleResult(null);
      setAiLog([]);
    }
  }, [phase, showEventCard, showBattleModal, showKnowledgeCheck, playerFaction, territoryOwners, troops, leaderStates, round, usedEventIds, usedCheckIds, invulnerableTerritories]);

  const placeTroop = useCallback((territoryId) => {
    if (currentPhase !== 'allocate') return;
    if (territoryOwners[territoryId] !== playerFaction) return;
    if (reinforcementsRemaining <= 0) return;

    setTroops((prev) => ({ ...prev, [territoryId]: (prev[territoryId] || 0) + 1 }));
    setReinforcementsRemaining((prev) => prev - 1);
  }, [currentPhase, territoryOwners, playerFaction, reinforcementsRemaining]);

  const attack = useCallback((fromId, toId) => {
    if (currentPhase !== 'battle') return { success: false };
    if (!areAdjacent(fromId, toId)) return { success: false, reason: 'Not adjacent' };
    if (territoryOwners[fromId] !== playerFaction) return { success: false, reason: 'Not your territory' };
    if (territoryOwners[toId] === playerFaction) return { success: false, reason: 'Already yours' };
    if ((troops[fromId] || 0) < 2) return { success: false, reason: 'Need at least 2 troops to attack' };

    // Fort McHenry invulnerability check
    if (invulnerableTerritories.includes(toId)) {
      setMessage(`${territories[toId]?.name} is invulnerable this round! The bombardment failed.`);
      return { success: false, reason: 'Territory is invulnerable this round' };
    }

    let currentDefenderTroops = troops[toId] || 1;

    // First strike: attacker's faction leader inflicts damage before dice
    const firstStrikeBonus = getFirstStrikeBonus(playerFaction, territories[toId], leaderStates);
    let firstStrikeDamage = 0;
    if (firstStrikeBonus > 0) {
      firstStrikeDamage = firstStrikeBonus;
      currentDefenderTroops = Math.max(0, currentDefenderTroops - firstStrikeDamage);
      if (currentDefenderTroops === 0) {
        // First strike wiped them out — auto-capture
        setTroops((prev) => {
          const updated = { ...prev };
          const movers = Math.min(prev[fromId] - 1, 3);
          updated[fromId] = Math.max(1, prev[fromId] - movers);
          updated[toId] = Math.max(1, movers);
          return updated;
        });
        setTerritoryOwners((prev) => ({ ...prev, [toId]: playerFaction }));
        if (playerFaction === 'us') {
          setNationalismMeter((prev) => Math.min(100, prev + 3));
        }
        const result = {
          success: true, conquered: true,
          attackRolls: [], defendRolls: [],
          attackerLosses: 0, defenderLosses: firstStrikeDamage,
          attackLeaderBonus: 0, defendLeaderBonus: 0,
          fortBonus: false, firstStrike: true, fromId, toId,
        };
        setBattleResult(result);
        setShowBattleModal(true);
        setMessage(`Ambush! First strike wipes out defenders at ${territories[toId]?.name}!`);
        return result;
      }
    }

    const attackerTroops = troops[fromId] - 1;

    const attackDice = Math.min(attackerTroops, 3);
    const defendDice = Math.min(currentDefenderTroops, 2);

    const attackRolls = Array.from({ length: attackDice }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
    const defendRolls = Array.from({ length: defendDice }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);

    // Leader bonuses
    let attackLeaderBonus = getLeaderBonus({
      faction: playerFaction,
      territory: territories[fromId],
      isAttacking: true,
      leaderStates,
    });

    // British naval superiority: +1 to highest attack die on naval/coastal territories
    if (playerFaction === 'british' && territories[toId]?.isNaval) {
      attackLeaderBonus += 1;
    }

    if (attackLeaderBonus > 0 && attackRolls.length > 0) {
      attackRolls[0] = Math.min(attackRolls[0] + attackLeaderBonus, 9);
    }

    const defenderFaction = territoryOwners[toId];
    let defendLeaderBonus = getLeaderBonus({
      faction: defenderFaction,
      territory: territories[toId],
      isAttacking: false,
      leaderStates,
    });

    // British naval superiority on defense too
    if (defenderFaction === 'british' && territories[toId]?.isNaval) {
      defendLeaderBonus += 1;
    }

    if (defendLeaderBonus > 0 && defendRolls.length > 0) {
      defendRolls[0] = Math.min(defendRolls[0] + defendLeaderBonus, 9);
    }

    // Fort bonus
    const fortBonus = territories[toId]?.hasFort;
    if (fortBonus && defendRolls.length > 0) {
      defendRolls[0] = Math.min(defendRolls[0] + 1, 9);
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

    const totalDefenderTroops = troops[toId] || 1;
    const newDefenderTroops = Math.max(0, totalDefenderTroops - defenderLosses);
    const conquered = newDefenderTroops === 0;

    setTroops((prev) => {
      const updated = { ...prev };
      if (conquered) {
        const movers = Math.min(attackerTroops - attackerLosses, prev[fromId] - 1);
        updated[fromId] = Math.max(1, prev[fromId] - movers);
        updated[toId] = Math.max(1, movers);
      } else {
        updated[fromId] = Math.max(1, prev[fromId] - attackerLosses);
        updated[toId] = newDefenderTroops;
      }
      return updated;
    });

    if (conquered) {
      setTerritoryOwners((prev) => ({ ...prev, [toId]: playerFaction }));

      if (playerFaction === 'us') {
        if (toId === 'baltimore' || toId === 'new_orleans') {
          setNationalismMeter((prev) => Math.min(100, prev + 10));
        } else {
          setNationalismMeter((prev) => Math.min(100, prev + 3));
        }
      }
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

    setBattleResult(result);
    setShowBattleModal(true);
    setMessage(
      conquered
        ? `Victory! ${territories[toId]?.name} has been captured!`
        : `Battle at ${territories[toId]?.name}: you lost ${attackerLosses}, defender lost ${defenderLosses}.`
    );

    return result;
  }, [currentPhase, territoryOwners, troops, playerFaction, leaderStates, invulnerableTerritories]);

  const handleTerritoryClick = useCallback((id) => {
    if (showEventCard || showBattleModal || showKnowledgeCheck) return;

    if (currentPhase === 'allocate') {
      placeTroop(id);
    } else if (currentPhase === 'battle') {
      if (!selectedTerritory) {
        if (territoryOwners[id] === playerFaction) {
          if ((troops[id] || 0) < 2) {
            setMessage(`${territories[id]?.name} needs at least 2 troops to attack from.`);
            return;
          }
          selectTerritory(id);
          setMessage(`Selected ${territories[id]?.name}. Click an adjacent enemy territory to attack, or click again to deselect.`);
        }
      } else if (selectedTerritory === id) {
        selectTerritory(null);
        setMessage('Attack cancelled. Select a territory to attack from.');
      } else {
        // Validate target
        if (territoryOwners[id] === playerFaction) {
          // Switch attacker
          if ((troops[id] || 0) >= 2) {
            selectTerritory(id);
            setMessage(`Switched to ${territories[id]?.name}. Click an adjacent enemy territory to attack.`);
          }
          return;
        }
        if (!areAdjacent(selectedTerritory, id)) {
          setMessage(`${territories[id]?.name} is not adjacent to ${territories[selectedTerritory]?.name}.`);
          return;
        }
        attack(selectedTerritory, id);
        setSelectedTerritory(null);
      }
    } else {
      selectTerritory(id);
    }
  }, [currentPhase, selectedTerritory, territoryOwners, troops, playerFaction, showEventCard, showBattleModal, showKnowledgeCheck, placeTroop, attack, selectTerritory]);

  const objectiveBonus = useMemo(
    () => playerFaction ? getObjectiveBonus(playerFaction, { territoryOwners, troops, nationalismMeter }) : 0,
    [playerFaction, territoryOwners, troops, nationalismMeter]
  );

  const finalScore = useMemo(() => {
    if (!playerFaction) return 0;
    const base = scores[playerFaction] || 0;
    const nationalismMultiplier = playerFaction === 'us' ? 1 + nationalismMeter / 100 : 1;
    return Math.round(base * nationalismMultiplier) + objectiveBonus;
  }, [scores, playerFaction, nationalismMeter, objectiveBonus]);

  return {
    // State
    gameStarted,
    gameOver,
    playerFaction,
    playerName,
    classPeriod,
    round,
    totalRounds: TOTAL_ROUNDS,
    currentPhase,
    currentPhaseLabel,
    seasonYear,
    territoryOwners,
    troops,
    selectedTerritory,
    scores,
    nationalismMeter,
    reinforcementsRemaining,
    currentEvent,
    showEventCard,
    battleResult,
    showBattleModal,
    message,
    playerTerritoryCount,
    finalScore,
    objectiveBonus,
    leaderStates,
    aiLog,
    playerObjectives,
    currentKnowledgeCheck,
    showKnowledgeCheck,

    // Actions
    startGame,
    advancePhase,
    handleTerritoryClick,
    placeTroop,
    attack,
    selectTerritory,
    dismissEvent,
    dismissBattle,
    answerKnowledgeCheck,
    setMessage,
    setBattleResult,
  };
}
