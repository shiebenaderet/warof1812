import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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

const PHASES = ['event', 'allocate', 'battle', 'maneuver', 'score'];
const PHASE_LABELS = {
  event: 'Draw Event Card',
  allocate: 'Allocate Forces',
  battle: 'Battle',
  maneuver: 'Maneuver',
  score: 'Score Update',
};

const ALL_FACTIONS = ['us', 'british', 'native'];

function calculateReinforcements(territoryOwners, faction, leaderStates, round) {
  const owned = Object.entries(territoryOwners).filter(([, owner]) => owner === faction);
  const base = 3 + Math.floor(owned.length / 2);
  const leaderBonus = getLeaderRallyBonus(faction, leaderStates);
  // Native guerrilla bonus: Tecumseh's confederacy at peak strength early war (nerfed for balance)
  const nativeBonus = (faction === 'native' && round <= 4) ? 1 : 0;
  return base + leaderBonus + nativeBonus;
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

  // Use ref to avoid stale closures in handleTerritoryClick
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // ── Map state ──
  const [territoryOwners, setTerritoryOwners] = useState(initTerritoryOwners);
  const [troops, setTroops] = useState(initTroops);
  const [selectedTerritory, setSelectedTerritory] = useState(null);

  // ── Score tracking ──
  const [scores, setScores] = useState({ us: 0, british: 0, native: 0 });
  const [nationalismMeter, setNationalismMeter] = useState(0);
  const [reinforcementsRemaining, setReinforcementsRemaining] = useState(0);

  // ── Intro screen ──
  const [showIntro, setShowIntro] = useState(true);

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
  const [aiActions, setAiActions] = useState([]);
  const [showAIReplay, setShowAIReplay] = useState(false);

  // ── Invulnerable territories (lasts one round, e.g. Fort McHenry) ──
  const [invulnerableTerritories, setInvulnerableTerritories] = useState([]);

  // ── Knowledge checks ──
  const [currentKnowledgeCheck, setCurrentKnowledgeCheck] = useState(null);
  const [showKnowledgeCheck, setShowKnowledgeCheck] = useState(false);
  const [usedCheckIds, setUsedCheckIds] = useState([]);
  const [requiredChecksSeen, setRequiredChecksSeen] = useState([]);
  const [knowledgeCheckResults, setKnowledgeCheckResults] = useState({ total: 0, correct: 0 });
  const [knowledgeCheckHistory, setKnowledgeCheckHistory] = useState([]);

  // ── Turn journal ──
  const [journalEntries, setJournalEntries] = useState([]);

  // ── Battle stats ──
  const [battleStats, setBattleStats] = useState({ fought: 0, won: 0, lost: 0 });

  // ── Maneuver phase ──
  const [maneuverFrom, setManeuverFrom] = useState(null);
  const [maneuversRemaining, setManeuversRemaining] = useState(0);

  // ── Phase undo ──
  const [phaseHistory, setPhaseHistory] = useState([]);
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const [pendingAdvanceMessage, setPendingAdvanceMessage] = useState('');

  // ── Action confirmation ──
  const [pendingAction, setPendingAction] = useState(null);
  const [actionHistory, setActionHistory] = useState([]);

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
    setRequiredChecksSeen([]);
    setKnowledgeCheckResults({ total: 0, correct: 0 });
    setJournalEntries([]);
    setBattleStats({ fought: 0, won: 0, lost: 0 });
    setManeuverFrom(null);
    setManeuversRemaining(0);

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

  const addJournalEntry = useCallback((items) => {
    setJournalEntries((prev) => {
      const existing = prev.find((e) => e.round === round);
      if (existing) {
        return prev.map((e) =>
          e.round === round ? { ...e, items: [...e.items, ...items] } : e
        );
      }
      return [...prev, { round, season: getSeasonYear(round), items }];
    });
  }, [round]);

  const dismissEvent = useCallback((quizResult) => {
    console.log('[DEBUG] dismissEvent called, current phase:', PHASES[phase], 'showEventCard:', showEventCard);
    // Apply event effects
    if (currentEvent) {
      const result = applyEventEffects(currentEvent, territoryOwners, troops, nationalismMeter, leaderStates);
      let newNationalism = result.nationalism;
      setTerritoryOwners(result.owners);
      setTroops(result.troops);
      setLeaderStates(result.leaders);
      if (result.invulnerable && result.invulnerable.length > 0) {
        setInvulnerableTerritories((prev) => [...prev, ...result.invulnerable]);
      }

      // Apply quiz reward/penalty
      if (quizResult?.answered && currentEvent.quiz) {
        if (quizResult.correct) {
          const reward = currentEvent.quiz.reward;
          if (reward?.troops) {
            setReinforcementsRemaining((prev) => prev + reward.troops);
          }
          if (reward?.nationalism && playerFaction === 'us') {
            newNationalism = Math.max(0, Math.min(100, newNationalism + reward.nationalism));
          }
          addJournalEntry([
            `Event: ${currentEvent.title} — ${currentEvent.effect}`,
            `Quiz correct! ${reward?.troops ? `+${reward.troops} bonus troops` : ''}${reward?.nationalism ? `+${reward.nationalism} nationalism` : ''}`,
          ]);
        } else {
          const penalty = currentEvent.quiz.penalty;
          if (penalty?.nationalism && playerFaction === 'us') {
            newNationalism = Math.max(0, Math.min(100, newNationalism + penalty.nationalism));
          }
          if (penalty?.troops) {
            setReinforcementsRemaining((prev) => Math.max(0, prev + penalty.troops));
          }
          addJournalEntry([
            `Event: ${currentEvent.title} — ${currentEvent.effect}`,
            `Quiz missed. ${penalty?.nationalism ? `${penalty.nationalism} nationalism` : ''}`,
          ]);
        }
      } else {
        addJournalEntry([`Event: ${currentEvent.title} — ${currentEvent.effect}`]);
      }

      setNationalismMeter(newNationalism);
    }
    setShowEventCard(false);
    console.log('[DEBUG] dismissEvent complete, showEventCard set to false, auto-advancing phase...');

    // Auto-advance from EVENT phase to ALLOCATE phase
    // This provides better UX - users don't need to manually click "Begin Planning"
    setTimeout(() => {
      console.log('[DEBUG] Auto-advancing phase after event dismissal, current phase index:', phase);
      setPhase((prev) => {
        const newPhase = prev + 1;
        console.log('[DEBUG] Phase advancing from', prev, 'to', newPhase, 'which is', PHASES[newPhase]);
        return newPhase;
      });
      setMessage('Planning Phase: Deploy your reinforcement troops.');
    }, 100);
  }, [currentEvent, applyEventEffects, territoryOwners, troops, nationalismMeter, leaderStates, addJournalEntry, playerFaction, phase, showEventCard]);

  const dismissBattle = useCallback(() => {
    setShowBattleModal(false);
  }, []);

  const answerKnowledgeCheck = useCallback((correct, selectedIndex) => {
    setKnowledgeCheckResults((prev) => ({
      total: prev.total + 1,
      correct: prev.correct + (correct ? 1 : 0),
    }));
    if (currentKnowledgeCheck) {
      // Track if this was a required question
      if (currentKnowledgeCheck.required) {
        setRequiredChecksSeen((prev) => [...prev, currentKnowledgeCheck.id]);
      }
      setKnowledgeCheckHistory((prev) => [...prev, {
        question: currentKnowledgeCheck.question,
        choices: currentKnowledgeCheck.choices,
        correctIndex: currentKnowledgeCheck.correctIndex,
        explanation: currentKnowledgeCheck.explanation,
        selectedIndex,
        wasCorrect: correct,
        round,
      }]);
    }
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
  }, [currentKnowledgeCheck, playerFaction, round]);

  const requestKnowledgeCheck = useCallback(() => {
    if (showKnowledgeCheck || showEventCard || showBattleModal) return;
    const kc = drawKnowledgeCheck(round, usedCheckIds, requiredChecksSeen);
    if (kc) {
      setCurrentKnowledgeCheck(kc);
      setShowKnowledgeCheck(true);
      setUsedCheckIds((prev) => [...prev, kc.id]);
    }
  }, [round, usedCheckIds, requiredChecksSeen, showKnowledgeCheck, showEventCard, showBattleModal]);

  const cancelAdvance = useCallback(() => {
    setPendingAdvance(false);
    setPendingAdvanceMessage('');
  }, []);

  const doAdvancePhase = useCallback((skipConfirmation) => {
    // Don't advance while modals are open
    if (showEventCard || showBattleModal || showKnowledgeCheck) return;

    // Check for unused resources and show confirmation
    if (!skipConfirmation) {
      if (currentPhase === 'allocate' && reinforcementsRemaining > 0) {
        setPendingAdvance(true);
        setPendingAdvanceMessage(`You have ${reinforcementsRemaining} reinforcement${reinforcementsRemaining > 1 ? 's' : ''} remaining. They will be lost if you advance.`);
        return;
      }
      if (currentPhase === 'maneuver' && maneuversRemaining > 0) {
        setPendingAdvance(true);
        setPendingAdvanceMessage(`You have ${maneuversRemaining} move${maneuversRemaining > 1 ? 's' : ''} remaining.`);
        return;
      }
    }
    setPendingAdvance(false);
    setPendingAdvanceMessage('');

    // Auto-save before advancing phase (data protection)
    try {
      const saveData = {
        version: 1,
        timestamp: Date.now(),
        playerFaction, playerName, classPeriod,
        round, phase,
        territoryOwners, troops, scores, nationalismMeter,
        reinforcementsRemaining, leaderStates,
        usedEventIds, usedCheckIds, requiredChecksSeen,
        knowledgeCheckResults, knowledgeCheckHistory, journalEntries, battleStats,
        invulnerableTerritories,
      };
      localStorage.setItem('war1812_save', JSON.stringify(saveData));
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Continue anyway - don't block gameplay
    }

    // Save snapshot for undo (within this turn only)
    setPhaseHistory((prev) => [...prev, {
      phase, troops: { ...troops }, territoryOwners: { ...territoryOwners },
      reinforcementsRemaining, maneuversRemaining,
    }]);

    const next = phase + 1;

    if (next >= PHASES.length) {
      // ── End of player turn — run AI turns ──
      const opponentFactions = ALL_FACTIONS.filter((f) => f !== playerFaction);
      let aiOwners = { ...territoryOwners };
      let aiTroops = { ...troops };
      const allLogs = [];
      const allActions = [];

      for (const faction of opponentFactions) {
        // Check if faction still has territories
        const hasTerritories = Object.values(aiOwners).some((o) => o === faction);
        if (!hasTerritories) continue;

        const result = runAITurn(faction, aiOwners, aiTroops, leaderStates, invulnerableTerritories, round);
        aiOwners = result.territoryOwners;
        aiTroops = result.troops;
        allLogs.push(...result.log);
        allActions.push(...result.actions);
      }

      setTerritoryOwners(aiOwners);
      setTroops(aiTroops);
      setAiLog(allLogs);
      setAiActions(allActions);

      // Show replay modal if there are actions to review
      if (allActions.length > 0) {
        setShowAIReplay(true);
      }

      // Log AI actions to journal
      if (allLogs.length > 0) {
        setJournalEntries((prev) => {
          const existing = prev.find((e) => e.round === round);
          const aiItems = allLogs.map((l) => `Opponent: ${l}`);
          if (existing) {
            return prev.map((e) =>
              e.round === round ? { ...e, items: [...e.items, ...aiItems] } : e
            );
          }
          return [...prev, { round, season: getSeasonYear(round), items: aiItems }];
        });
      }

      // ── Score phase ──
      setScores((prev) => {
        const newScores = { ...prev };
        for (const [id, owner] of Object.entries(aiOwners)) {
          if (owner !== 'neutral') {
            newScores[owner] = (newScores[owner] || 0) + (territories[id]?.points || 0);
          }
        }

        // ── Check for 50-point victory ──
        if (playerFaction) {
          const baseScore = newScores[playerFaction] || 0;
          // Calculate faction multiplier
          let multiplier = 1;
          if (playerFaction === 'us') {
            multiplier = 1 + nationalismMeter / 100;
          } else if (playerFaction === 'native') {
            const nativeTerrCount = Object.values(aiOwners).filter(o => o === 'native').length;
            multiplier = 1 + (Math.min(nativeTerrCount, 6) / 6) * 0.5;
          } else if (playerFaction === 'british') {
            const navalCount = Object.entries(aiOwners)
              .filter(([id, owner]) => owner === 'british' && territories[id]?.isNaval)
              .length;
            multiplier = 1 + (Math.min(navalCount, 4) / 4) * 0.3;
          }
          const objBonus = getObjectiveBonus(playerFaction, { territoryOwners: aiOwners, troops: aiTroops, nationalismMeter });
          const finalScore = Math.round(baseScore * multiplier) + objBonus;

          // Check for 50-point victory
          if (finalScore >= 50) {
            setGameOver(true);
            setPhase(4); // stay on score
            setMessage(`Victory! You have reached 50 points and won the war!`);
            return newScores;
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

      // ── Check for player elimination ──
      const playerTerritories = Object.values(aiOwners).filter((o) => o === playerFaction).length;
      if (playerTerritories === 0) {
        setGameOver(true);
        setPhase(4); // stay on score
        setMessage('Your faction has been eliminated! The war is over.');
        return;
      }

      // ── Advance to next round ──
      const nextRound = round + 1;
      if (nextRound > TOTAL_ROUNDS) {
        setGameOver(true);
        setPhase(4); // stay on score
        setMessage('The Treaty of Ghent has been signed. The war is over!');
        return;
      }

      setRound(nextRound);
      setPhase(0); // back to event phase
      setInvulnerableTerritories([]); // clear round-based invulnerability
      setPhaseHistory([]); // clear undo history at new round

      // Auto-save at end of each round
      try { localStorage.setItem('war1812_save', JSON.stringify({
        version: 1, timestamp: Date.now(),
        playerFaction, playerName, classPeriod,
        round: nextRound, phase: 0,
        territoryOwners: aiOwners, troops: aiTroops, scores, nationalismMeter,
        reinforcementsRemaining: 0, leaderStates,
        usedEventIds, usedCheckIds, requiredChecksSeen,
        knowledgeCheckResults, knowledgeCheckHistory, journalEntries, battleStats,
        invulnerableTerritories: [],
      })); } catch { /* ignore save errors */ }

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
    setActionHistory([]); // Clear action history when advancing to new phase

    if (PHASES[next] === 'allocate') {
      const reinforcements = calculateReinforcements(territoryOwners, playerFaction, leaderStates, round);
      setReinforcementsRemaining(reinforcements);
      setMessage(`You receive ${reinforcements} reinforcements. Click your territories to place troops.`);
      setBattleResult(null);
    } else if (PHASES[next] === 'battle') {
      setMessage('Select one of your territories, then click an adjacent enemy territory to attack. Advance phase when done.');
      setSelectedTerritory(null);
      setBattleResult(null);
    } else if (PHASES[next] === 'maneuver') {
      setManeuversRemaining(2);
      setManeuverFrom(null);
      setSelectedTerritory(null);
      setBattleResult(null);
      setMessage('Maneuver phase: select your territory to move troops FROM, then click an adjacent territory you own. (2 moves available)');
    } else if (PHASES[next] === 'score') {
      setManeuverFrom(null);
      setBattleResult(null);
      setAiLog([]);

      // Draw knowledge check during the review phase — less disruptive than battle
      const kc = drawKnowledgeCheck(round, usedCheckIds, requiredChecksSeen);
      if (kc) {
        setCurrentKnowledgeCheck(kc);
        setShowKnowledgeCheck(true);
        setUsedCheckIds((prev) => [...prev, kc.id]);
        setMessage('Review your turn and answer a knowledge check before ending.');
      } else {
        setMessage('Review the board and scores. Advance to end your turn and let opponents move.');
      }
    }
  }, [currentPhase, phase, showEventCard, showBattleModal, showKnowledgeCheck, playerFaction, territoryOwners, troops, leaderStates, round, usedEventIds, usedCheckIds, requiredChecksSeen, invulnerableTerritories, scores, nationalismMeter, playerName, classPeriod, knowledgeCheckResults, knowledgeCheckHistory, journalEntries, battleStats, reinforcementsRemaining, maneuversRemaining]);

  const advancePhase = useCallback(() => doAdvancePhase(false), [doAdvancePhase]);
  const confirmAdvance = useCallback(() => doAdvancePhase(true), [doAdvancePhase]);

  const undoLastAction = useCallback(() => {
    if (actionHistory.length === 0) return;
    if (currentPhase === 'battle') return; // Battles cannot be undone

    const lastAction = actionHistory[actionHistory.length - 1];

    // Only allow undoing actions from the current phase
    if (lastAction.phase !== currentPhase) {
      setMessage('Can only undo actions from the current phase.');
      return;
    }

    if (lastAction.type === 'placement') {
      // Undo troop placement
      setTroops((prev) => ({ ...prev, [lastAction.territoryId]: lastAction.previousTroops }));
      setReinforcementsRemaining(lastAction.previousReinforcements);
      setMessage(`Undid deployment to ${territories[lastAction.territoryId]?.name}.`);
    } else if (lastAction.type === 'maneuver') {
      // Undo maneuver
      setTroops((prev) => ({
        ...prev,
        [lastAction.fromId]: lastAction.previousFromTroops,
        [lastAction.toId]: lastAction.previousToTroops,
      }));
      setManeuversRemaining(lastAction.previousManeuversRemaining);
      setMessage(`Undid maneuver from ${territories[lastAction.fromId]?.name} to ${territories[lastAction.toId]?.name}.`);
    }

    // Remove the action from history
    setActionHistory((prev) => prev.slice(0, -1));
  }, [actionHistory, currentPhase]);

  const goBackPhase = useCallback(() => {
    if (phaseHistory.length === 0) return;
    const snapshot = phaseHistory[phaseHistory.length - 1];
    setPhase(snapshot.phase);
    setTroops(snapshot.troops);
    setTerritoryOwners(snapshot.territoryOwners);
    setReinforcementsRemaining(snapshot.reinforcementsRemaining);
    setManeuversRemaining(snapshot.maneuversRemaining);
    setPhaseHistory((prev) => prev.slice(0, -1));
    setSelectedTerritory(null);
    setManeuverFrom(null);
    setPendingAdvance(false);
    setPendingAdvanceMessage('');
    setActionHistory([]); // Clear action history when going back phases
    setMessage(`Returned to ${PHASE_LABELS[PHASES[snapshot.phase]]} phase.`);
  }, [phaseHistory]);

  const requestManeuver = useCallback((fromId, toId) => {
    if (currentPhase !== 'maneuver') return;
    if (maneuversRemaining <= 0) return;
    if (territoryOwners[fromId] !== playerFaction || territoryOwners[toId] !== playerFaction) return;
    if (!areAdjacent(fromId, toId)) return;
    if ((troops[fromId] || 0) < 2) return; // must leave at least 1

    const movers = Math.min((troops[fromId] || 0) - 1, 3); // move up to 3 troops

    // Show confirmation modal
    setPendingAction({
      type: 'maneuver',
      fromId,
      toId,
      fromTerritoryName: territories[fromId]?.name,
      territoryName: territories[toId]?.name,
      troopCount: movers,
      fromCurrentTroops: troops[fromId] || 0,
      fromNewTroops: (troops[fromId] || 0) - movers,
      currentTroops: troops[toId] || 0,
      newTroops: (troops[toId] || 0) + movers,
    });
  }, [currentPhase, maneuversRemaining, territoryOwners, playerFaction, troops]);

  const confirmManeuver = useCallback(() => {
    if (!pendingAction || pendingAction.type !== 'maneuver') return;
    const { fromId, toId, troopCount } = pendingAction;

    // Record the action for undo
    setActionHistory((prev) => [...prev, {
      phase: currentPhase,
      type: 'maneuver',
      fromId,
      toId,
      movers: troopCount,
      previousFromTroops: troops[fromId] || 0,
      previousToTroops: troops[toId] || 0,
      previousManeuversRemaining: maneuversRemaining,
    }]);

    // Execute the maneuver
    setTroops((prev) => ({
      ...prev,
      [fromId]: prev[fromId] - troopCount,
      [toId]: (prev[toId] || 0) + troopCount,
    }));
    setManeuversRemaining((prev) => prev - 1);
    setManeuverFrom(null);
    setSelectedTerritory(null);
    setPendingAction(null);
    addJournalEntry([`Maneuver: Moved ${troopCount} troops from ${territories[fromId]?.name} to ${territories[toId]?.name}.`]);
    const remaining = maneuversRemaining - 1;
    setMessage(
      remaining > 0
        ? `Moved ${troopCount} troops to ${territories[toId]?.name}. ${remaining} move(s) remaining.`
        : `Moved ${troopCount} troops to ${territories[toId]?.name}. No moves remaining — advance when ready.`
    );
  }, [pendingAction, currentPhase, maneuversRemaining, troops, addJournalEntry]);

  const maneuverTroops = requestManeuver;

  const requestPlaceTroop = useCallback((territoryId) => {
    console.log('[DEBUG] requestPlaceTroop called:', {
      territoryId,
      currentPhase,
      owner: territoryOwners[territoryId],
      playerFaction,
      reinforcementsRemaining,
      territoryName: territories[territoryId]?.name
    });

    if (currentPhase !== 'allocate') {
      console.log('[DEBUG] Rejected: not in allocate phase');
      return;
    }
    if (territoryOwners[territoryId] !== playerFaction) {
      console.log('[DEBUG] Rejected: territory not owned by player');
      return;
    }
    if (reinforcementsRemaining <= 0) {
      console.log('[DEBUG] Rejected: no reinforcements remaining');
      return;
    }

    console.log('[DEBUG] Placing troop...');
    // TEMPORARY: Skip confirmation modal, place troop directly
    // TODO: Re-enable modal after debugging
    setTroops((prev) => ({ ...prev, [territoryId]: (prev[territoryId] || 0) + 1 }));
    setReinforcementsRemaining((prev) => prev - 1);
    selectTerritory(null);
    setMessage(`Deployed 1 troop to ${territories[territoryId]?.name}. ${reinforcementsRemaining - 1} reinforcements remaining.`);
    console.log('[DEBUG] Troop placed successfully');
  }, [currentPhase, territoryOwners, playerFaction, reinforcementsRemaining, selectTerritory, setMessage]);

  const confirmPlaceTroop = useCallback(() => {
    if (!pendingAction || pendingAction.type !== 'placement') return;
    const { territoryId } = pendingAction;

    // Record the action for undo
    setActionHistory((prev) => [...prev, {
      phase: currentPhase,
      type: 'placement',
      territoryId,
      previousTroops: troops[territoryId] || 0,
      previousReinforcements: reinforcementsRemaining,
    }]);

    // Execute the placement
    setTroops((prev) => ({ ...prev, [territoryId]: (prev[territoryId] || 0) + 1 }));
    setReinforcementsRemaining((prev) => prev - 1);
    setPendingAction(null);
    // Clear selection after placement
    selectTerritory(null);
  }, [pendingAction, currentPhase, troops, reinforcementsRemaining, selectTerritory]);

  const cancelAction = useCallback(() => {
    setPendingAction(null);
    // Clear selection when cancelling
    selectTerritory(null);
  }, [selectTerritory]);

  const placeTroop = requestPlaceTroop;

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

    let currentDefenderTroops = troops[toId] || 0;

    // Auto-capture undefended territories (neutral or abandoned with 0 troops)
    if (currentDefenderTroops === 0) {
      setTroops((prev) => {
        const updated = { ...prev };
        const movers = Math.min(prev[fromId] - 1, 3);
        updated[fromId] = Math.max(1, prev[fromId] - movers);
        updated[toId] = Math.max(1, movers);
        return updated;
      });
      setTerritoryOwners((prev) => ({ ...prev, [toId]: playerFaction }));
      if (playerFaction === 'us') {
        setNationalismMeter((prev) => Math.min(100, prev + 2));
      }
      const result = {
        success: true, conquered: true,
        attackRolls: [], defendRolls: [],
        attackerLosses: 0, defenderLosses: 0,
        attackLeaderBonus: 0, defendLeaderBonus: 0,
        fortBonus: false, firstStrike: false, fromId, toId,
        undefended: true,
      };
      setBattleResult(result);
      setShowBattleModal(true);
      setBattleStats((prev) => ({ fought: prev.fought + 1, won: prev.won + 1, lost: prev.lost }));
      addJournalEntry([`Battle: Your forces occupied the undefended ${territories[toId]?.name}.`]);
      setMessage(`Your forces march into the undefended ${territories[toId]?.name}!`);
      return result;
    }

    // First strike: attacker's faction leader inflicts damage before dice
    const firstStrikeBonus = getFirstStrikeBonus(playerFaction, territories[toId], leaderStates);
    let firstStrikeDamage = 0;
    if (firstStrikeBonus > 0) {
      // Fixed 1 damage instead of variable to prevent auto-win
      firstStrikeDamage = 1;
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
        setBattleStats((prev) => ({ fought: prev.fought + 1, won: prev.won + 1, lost: prev.lost }));
        addJournalEntry([`Battle: Ambush! First strike wiped out defenders at ${territories[toId]?.name}!`]);
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
    const MAX_BONUS = 2; // Cap total bonuses to prevent stacking abuse

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

    // Cap attack bonus at MAX_BONUS
    attackLeaderBonus = Math.min(attackLeaderBonus, MAX_BONUS);

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

    // Fort bonus (included in cap calculation)
    const fortBonus = territories[toId]?.hasFort;
    if (fortBonus) {
      defendLeaderBonus += 1;
    }

    // Cap defense bonus at MAX_BONUS
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

    const totalDefenderTroops = troops[toId] || 0;
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
    setBattleStats((prev) => ({
      fought: prev.fought + 1,
      won: prev.won + (conquered ? 1 : 0),
      lost: prev.lost + (conquered ? 0 : 1),
    }));
    addJournalEntry([
      conquered
        ? `Battle: Your forces captured ${territories[toId]?.name}! (lost ${attackerLosses} troops)`
        : `Battle: Attack on ${territories[toId]?.name} repelled (lost ${attackerLosses}, enemy lost ${defenderLosses})`,
    ]);
    setMessage(
      conquered
        ? `Victory! ${territories[toId]?.name} has been captured!`
        : `Battle at ${territories[toId]?.name}: you lost ${attackerLosses}, defender lost ${defenderLosses}.`
    );

    return result;
  }, [currentPhase, territoryOwners, troops, playerFaction, leaderStates, invulnerableTerritories, addJournalEntry]);

  const handleTerritoryClick = useCallback((id) => {
    // Use phaseRef.current to get the latest phase value, avoiding stale closures
    const actualCurrentPhase = PHASES[phaseRef.current];
    console.log('[DEBUG] handleTerritoryClick:', {
      id,
      currentPhase: actualCurrentPhase,
      phaseIndex: phaseRef.current,
      selectedTerritory,
      showEventCard,
      showBattleModal
    });

    if (showEventCard || showBattleModal || showKnowledgeCheck) {
      console.log('[DEBUG] Blocked by modal');
      return;
    }

    if (actualCurrentPhase === 'allocate') {
      console.log('[DEBUG] In allocate phase, selectedTerritory:', selectedTerritory);
      // First click selects, second click on same territory places troop
      if (selectedTerritory === id) {
        console.log('[DEBUG] Second click on same territory, calling placeTroop');
        placeTroop(id);
        // Don't deselect here - let the confirmation modal handle it
      } else {
        console.log('[DEBUG] First click, selecting territory');
        selectTerritory(id);
      }
    } else if (actualCurrentPhase === 'battle') {
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
    } else if (actualCurrentPhase === 'maneuver') {
      if (maneuversRemaining <= 0) {
        setMessage('No maneuvers remaining. Advance to end your turn.');
        return;
      }
      if (!maneuverFrom) {
        // Select source territory
        if (territoryOwners[id] !== playerFaction) return;
        if ((troops[id] || 0) < 2) {
          setMessage(`${territories[id]?.name} needs at least 2 troops to move from.`);
          return;
        }
        setManeuverFrom(id);
        selectTerritory(id);
        setMessage(`Selected ${territories[id]?.name} (${troops[id]} troops). Click an adjacent friendly territory to move troops, or click again to cancel.`);
      } else if (maneuverFrom === id) {
        // Deselect
        setManeuverFrom(null);
        selectTerritory(null);
        setMessage('Maneuver cancelled. Select a territory to move troops from.');
      } else {
        // Attempt maneuver to target
        if (territoryOwners[id] !== playerFaction) {
          setMessage('You can only maneuver troops to territories you own.');
          return;
        }
        if (!areAdjacent(maneuverFrom, id)) {
          setMessage(`${territories[id]?.name} is not adjacent to ${territories[maneuverFrom]?.name}.`);
          return;
        }
        maneuverTroops(maneuverFrom, id);
      }
    } else {
      selectTerritory(id);
    }
  }, [selectedTerritory, territoryOwners, troops, playerFaction, showEventCard, showBattleModal, showKnowledgeCheck, placeTroop, attack, selectTerritory, maneuverFrom, maneuverTroops, maneuversRemaining]);

  const objectiveBonus = useMemo(
    () => playerFaction ? getObjectiveBonus(playerFaction, { territoryOwners, troops, nationalismMeter }) : 0,
    [playerFaction, territoryOwners, troops, nationalismMeter]
  );

  // Native Resistance: up to 1.5x at 6+ territories held
  const nativeResistance = useMemo(() => {
    if (playerFaction !== 'native') return 0;
    return Math.min(playerTerritoryCount, 6);
  }, [playerFaction, playerTerritoryCount]);

  // British Naval Dominance: count naval territories controlled
  const navalDominance = useMemo(() => {
    if (playerFaction !== 'british') return 0;
    return Object.entries(territoryOwners)
      .filter(([id, owner]) => owner === 'british' && territories[id]?.isNaval)
      .length;
  }, [playerFaction, territoryOwners]);

  const factionMultiplier = useMemo(() => {
    if (playerFaction === 'us') return 1 + nationalismMeter / 100;
    if (playerFaction === 'native') return 1 + (Math.min(nativeResistance, 6) / 6) * 0.5; // up to 1.5x
    if (playerFaction === 'british') return 1 + (Math.min(navalDominance, 4) / 4) * 0.3; // up to 1.3x
    return 1;
  }, [playerFaction, nationalismMeter, nativeResistance, navalDominance]);

  const finalScore = useMemo(() => {
    if (!playerFaction) return 0;
    const base = scores[playerFaction] || 0;
    return Math.round(base * factionMultiplier) + objectiveBonus;
  }, [scores, playerFaction, factionMultiplier, objectiveBonus]);

  // ── Save / Load ──
  const saveGame = useCallback(() => {
    const saveData = {
      version: 1,
      timestamp: Date.now(),
      playerFaction, playerName, classPeriod,
      round, phase,
      territoryOwners, troops, scores, nationalismMeter,
      reinforcementsRemaining, leaderStates,
      usedEventIds, usedCheckIds, requiredChecksSeen,
      knowledgeCheckResults, knowledgeCheckHistory, journalEntries, battleStats,
      invulnerableTerritories,
    };
    try {
      localStorage.setItem('war1812_save', JSON.stringify(saveData));
      return true;
    } catch {
      return false;
    }
  }, [playerFaction, playerName, classPeriod, round, phase, territoryOwners, troops, scores,
      nationalismMeter, reinforcementsRemaining, leaderStates, usedEventIds, usedCheckIds, requiredChecksSeen,
      knowledgeCheckResults, knowledgeCheckHistory, journalEntries, battleStats, invulnerableTerritories]);

  const loadGame = useCallback(() => {
    try {
      const raw = localStorage.getItem('war1812_save');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.version !== 1) return false;

      setPlayerFaction(data.playerFaction);
      setPlayerName(data.playerName);
      setClassPeriod(data.classPeriod);
      setRound(data.round);
      setPhase(data.phase);
      setTerritoryOwners(data.territoryOwners);
      setTroops(data.troops);
      setScores(data.scores);
      setNationalismMeter(data.nationalismMeter);
      setReinforcementsRemaining(data.reinforcementsRemaining || 0);
      setLeaderStates(data.leaderStates);
      setUsedEventIds(data.usedEventIds || []);
      setUsedCheckIds(data.usedCheckIds || []);
      setRequiredChecksSeen(data.requiredChecksSeen || []);
      setKnowledgeCheckResults(data.knowledgeCheckResults || { total: 0, correct: 0 });
      setKnowledgeCheckHistory(data.knowledgeCheckHistory || []);
      setJournalEntries(data.journalEntries || []);
      setBattleStats(data.battleStats || { fought: 0, won: 0, lost: 0 });
      setInvulnerableTerritories(data.invulnerableTerritories || []);
      setCurrentEvent(null);
      setShowEventCard(false);
      setShowBattleModal(false);
      setShowKnowledgeCheck(false);
      setAiLog([]);
      setGameStarted(true);
      setGameOver(false);
      setMessage(`Game loaded — Round ${data.round}, ${getSeasonYear(data.round)}.`);
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

  const dismissIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  // Export save file as JSON download (for backup)
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

  // Import save file from JSON upload
  const importSaveFile = useCallback((fileContent) => {
    try {
      const data = JSON.parse(fileContent);

      // Validate save file format
      if (!data.version || !data.playerFaction) {
        return { success: false, error: 'Invalid save file format' };
      }

      // Store in localStorage
      localStorage.setItem('war1812_save', fileContent);

      // Load the game state
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
    showIntro,
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
    aiActions,
    showAIReplay,
    playerObjectives,
    currentKnowledgeCheck,
    showKnowledgeCheck,
    knowledgeCheckResults,
    knowledgeCheckHistory,
    journalEntries,
    battleStats,
    maneuverFrom,
    maneuversRemaining,
    nativeResistance,
    navalDominance,
    factionMultiplier,
    phaseHistory,
    pendingAdvance,
    pendingAdvanceMessage,
    pendingAction,
    actionHistory,

    // Actions
    startGame,
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
    setMessage,
    setBattleResult,
    saveGame,
    loadGame,
    hasSavedGame,
    deleteSave,
    exportSaveFile,
    importSaveFile,
    dismissIntro,
    closeAIReplay: () => setShowAIReplay(false),
  };
}
