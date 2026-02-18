import { useState, useCallback, useMemo } from 'react';
import territories, { areAdjacent } from '../data/territories';

const TOTAL_ROUNDS = 12; // 1812–1815, ~1 round per season

// Season names for flavor
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const getSeasonYear = (round) => {
  const year = 1812 + Math.floor((round - 1) / 4);
  const season = SEASONS[(round - 1) % 4];
  return `${season} ${year}`;
};

// Game phases within each turn
const PHASES = ['event', 'allocate', 'battle', 'score'];
const PHASE_LABELS = {
  event: 'Draw Event Card',
  allocate: 'Allocate Forces',
  battle: 'Battle',
  score: 'Score Update',
};

// Calculate reinforcements based on territories held
function calculateReinforcements(territoryOwners, faction) {
  const owned = Object.entries(territoryOwners).filter(([, owner]) => owner === faction);
  // Base: 3 troops + 1 per 2 territories held
  return 3 + Math.floor(owned.length / 2);
}

// Initialize territory ownership from data
function initTerritoryOwners() {
  const owners = {};
  for (const [id, terr] of Object.entries(territories)) {
    owners[id] = terr.startingOwner;
  }
  return owners;
}

// Initialize troops — each faction starts with troops on their territories
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

export default function useGameState() {
  // ── Core state ──
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerFaction, setPlayerFaction] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [classPeriod, setClassPeriod] = useState('');

  // ── Turn tracking ──
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState(0); // index into PHASES

  // ── Map state ──
  const [territoryOwners, setTerritoryOwners] = useState(initTerritoryOwners);
  const [troops, setTroops] = useState(initTroops);
  const [selectedTerritory, setSelectedTerritory] = useState(null);

  // ── Score tracking ──
  const [scores, setScores] = useState({ us: 0, british: 0, native: 0 });
  const [nationalismMeter, setNationalismMeter] = useState(0); // 0-100
  const [reinforcementsRemaining, setReinforcementsRemaining] = useState(0);

  // ── Event/UI state ──
  const [currentEvent] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [message, setMessage] = useState('');

  // ── Derived state ──
  const currentPhase = PHASES[phase];
  const currentPhaseLabel = PHASE_LABELS[currentPhase];
  const seasonYear = getSeasonYear(round);

  const playerTerritoryCount = useMemo(
    () => Object.values(territoryOwners).filter((o) => o === playerFaction).length,
    [territoryOwners, playerFaction]
  );

  // ── Actions ──

  const startGame = useCallback(({ faction, playerName: name, classPeriod: period }) => {
    setPlayerFaction(faction);
    setPlayerName(name);
    setClassPeriod(period);
    setGameStarted(true);
    setRound(1);
    setPhase(0);
    setTerritoryOwners(initTerritoryOwners());
    setTroops(initTroops());
    setScores({ us: 0, british: 0, native: 0 });
    setNationalismMeter(10); // start at 10
    setReinforcementsRemaining(0);
    setMessage(`The war begins! You command the ${faction === 'us' ? 'United States' : faction === 'british' ? 'British/Canadian' : 'Native Coalition'} forces.`);
  }, []);

  const selectTerritory = useCallback((id) => {
    setSelectedTerritory((prev) => (prev === id ? null : id));
  }, []);

  const advancePhase = useCallback(() => {
    setPhase((prev) => {
      const next = prev + 1;
      if (next >= PHASES.length) {
        // End of round — advance to next round
        setRound((r) => {
          const nextRound = r + 1;
          if (nextRound > TOTAL_ROUNDS) {
            setGameOver(true);
            setMessage('The Treaty of Ghent has been signed. The war is over!');
            return r;
          }
          setMessage(`Round ${nextRound} begins — ${getSeasonYear(nextRound)}`);
          return nextRound;
        });
        return 0; // reset to first phase
      }

      // Phase-specific setup
      if (PHASES[next] === 'allocate') {
        const reinforcements = calculateReinforcements(territoryOwners, playerFaction);
        setReinforcementsRemaining(reinforcements);
        setMessage(`You receive ${reinforcements} reinforcements. Click your territories to place troops.`);
      } else if (PHASES[next] === 'battle') {
        setMessage('Select one of your territories, then click an adjacent enemy territory to attack.');
        setSelectedTerritory(null);
      } else if (PHASES[next] === 'score') {
        // Tally round score
        setScores((prev) => {
          const newScores = { ...prev };
          for (const [id, owner] of Object.entries(territoryOwners)) {
            if (owner !== 'neutral') {
              newScores[owner] = (newScores[owner] || 0) + (territories[id]?.points || 0);
            }
          }
          return newScores;
        });
        setMessage('Scores tallied for this round.');
      }

      return next;
    });
  }, [territoryOwners, playerFaction]);

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

    const attackerTroops = troops[fromId] - 1; // leave 1 behind
    const defenderTroops = troops[toId] || 1;

    // Roll dice — attacker rolls min(attackerTroops, 3), defender rolls min(defenderTroops, 2)
    const attackDice = Math.min(attackerTroops, 3);
    const defendDice = Math.min(defenderTroops, 2);

    const attackRolls = Array.from({ length: attackDice }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
    const defendRolls = Array.from({ length: defendDice }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);

    // Fort bonus: defender gets +1 to highest die
    if (territories[toId]?.hasFort && defendRolls.length > 0) {
      defendRolls[0] = Math.min(defendRolls[0] + 1, 7);
    }

    let attackerLosses = 0;
    let defenderLosses = 0;
    const comparisons = Math.min(attackRolls.length, defendRolls.length);
    for (let i = 0; i < comparisons; i++) {
      if (attackRolls[i] > defendRolls[i]) {
        defenderLosses++;
      } else {
        attackerLosses++;
      }
    }

    const newAttackerTroops = Math.max(1, (troops[fromId] || 0) - attackerLosses);
    const newDefenderTroops = Math.max(0, (troops[toId] || 0) - defenderLosses);
    const conquered = newDefenderTroops === 0;

    setTroops((prev) => {
      const updated = { ...prev };
      if (conquered) {
        // Move remaining attackers into conquered territory
        const movers = Math.min(attackerTroops - attackerLosses, prev[fromId] - 1);
        updated[fromId] = Math.max(1, prev[fromId] - movers);
        updated[toId] = Math.max(1, movers);
      } else {
        updated[fromId] = newAttackerTroops;
        updated[toId] = newDefenderTroops;
      }
      return updated;
    });

    if (conquered) {
      setTerritoryOwners((prev) => ({ ...prev, [toId]: playerFaction }));

      // Nationalism boost for US capturing key territories
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
      fromId,
      toId,
    };

    setBattleResult(result);
    setMessage(
      conquered
        ? `Victory! ${territories[toId]?.name} has been captured!`
        : `Battle at ${territories[toId]?.name}: you lost ${attackerLosses} troops, defender lost ${defenderLosses}.`
    );

    return result;
  }, [currentPhase, territoryOwners, troops, playerFaction]);

  const handleTerritoryClick = useCallback((id) => {
    if (currentPhase === 'allocate') {
      placeTroop(id);
    } else if (currentPhase === 'battle') {
      if (!selectedTerritory) {
        // Select attacker
        if (territoryOwners[id] === playerFaction) {
          selectTerritory(id);
          setMessage(`Selected ${territories[id]?.name}. Now click an adjacent enemy territory to attack, or click again to deselect.`);
        }
      } else if (selectedTerritory === id) {
        // Deselect
        selectTerritory(null);
        setMessage('Attack cancelled. Select a territory to attack from.');
      } else {
        // Attack
        attack(selectedTerritory, id);
        setSelectedTerritory(null);
      }
    } else {
      selectTerritory(id);
    }
  }, [currentPhase, selectedTerritory, territoryOwners, playerFaction, placeTroop, attack, selectTerritory]);

  // Final score calculation
  const finalScore = useMemo(() => {
    if (!playerFaction) return 0;
    const base = scores[playerFaction] || 0;
    const nationalismMultiplier = playerFaction === 'us' ? 1 + nationalismMeter / 100 : 1;
    return Math.round(base * nationalismMultiplier);
  }, [scores, playerFaction, nationalismMeter]);

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
    battleResult,
    message,
    playerTerritoryCount,
    finalScore,

    // Actions
    startGame,
    advancePhase,
    handleTerritoryClick,
    placeTroop,
    attack,
    selectTerritory,
    setMessage,
    setBattleResult,
  };
}
