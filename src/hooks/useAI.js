import territories from '../data/territories';
import { getLeaderBonus, getLeaderRallyBonus, getFirstStrikeBonus } from '../data/leaders';

/**
 * AI opponent logic for non-player factions.
 *
 * The AI runs allocate + attack phases for each opponent faction
 * after the player's turn completes. It uses simple heuristic strategies:
 *
 * - British AI: defensive, focuses on holding Canada and naval zones,
 *   attacks opportunistically toward Chesapeake.
 * - Native AI: guerrilla style, concentrates on frontier territories,
 *   avoids overextension.
 * - US AI (when player is not US): aggressive expansion toward Canada.
 */

// How many reinforcements an AI faction gets (slightly more than player to compensate for weaker strategy)
function aiReinforcements(faction, territoryOwners, leaderStates, round) {
  const owned = Object.entries(territoryOwners).filter(([, o]) => o === faction);
  if (owned.length === 0) return 0;
  const base = 4 + Math.floor(owned.length / 2);
  const leaderBonus = getLeaderRallyBonus(faction, leaderStates);
  // Native guerrilla bonus: Tecumseh's confederacy at peak strength early war
  const nativeBonus = (faction === 'native' && round <= 4) ? 2 : 0;
  // British naval supply lines bonus
  const navalBonus = (faction === 'british') ? 1 : 0;
  return base + leaderBonus + nativeBonus + navalBonus;
}

// Score a territory for reinforcement priority (higher = more important to defend)
function reinforcePriority(id, faction, territoryOwners, troops) {
  const terr = territories[id];
  if (!terr) return 0;

  let score = terr.points * 2;

  // Bonus for territories adjacent to enemies
  const enemyNeighbors = terr.adjacency.filter(
    (adjId) => territoryOwners[adjId] && territoryOwners[adjId] !== faction && territoryOwners[adjId] !== 'neutral'
  );
  score += enemyNeighbors.length * 3;

  // Bonus for low troop count (needs reinforcement)
  if ((troops[id] || 0) <= 2) score += 4;

  // Bonus for forts (worth defending)
  if (terr.hasFort) score += 2;

  return score;
}

// Estimate win probability for an attack (0-1 range)
function estimateWinProbability(attackerTroops, defenderTroops, attackBonus = 0, defendBonus = 0) {
  // Simplified probability model based on troop ratio and bonuses
  const effectiveAttackers = attackerTroops + (attackBonus * 0.5);
  const effectiveDefenders = defenderTroops + (defendBonus * 0.5);

  if (effectiveDefenders <= 0) return 1.0;

  const ratio = effectiveAttackers / effectiveDefenders;

  // Sigmoid-like function to map ratio to probability
  // ratio < 1: disadvantage, ratio > 1: advantage
  if (ratio >= 2.5) return 0.85;
  if (ratio >= 2.0) return 0.75;
  if (ratio >= 1.5) return 0.65;
  if (ratio >= 1.2) return 0.55;
  if (ratio >= 1.0) return 0.45;
  if (ratio >= 0.8) return 0.35;
  return 0.25;
}

// Score an attack target (higher = more desirable to attack)
function attackScore(fromId, toId, faction, territoryOwners, troops, leaderStates) {
  const target = territories[toId];
  if (!target) return -1;

  const attackerTroops = (troops[fromId] || 0) - 1; // leave 1 behind
  const defenderTroops = troops[toId] || 0;

  // Don't attack if we don't have enough troops
  if (attackerTroops < 1) return -1;

  // Calculate bonuses for win probability estimation
  let attackBonus = getLeaderBonus({
    faction,
    territory: territories[fromId],
    isAttacking: true,
    leaderStates,
  });
  if (faction === 'british' && target?.isNaval) attackBonus += 1;
  attackBonus = Math.min(attackBonus, 2); // Cap at MAX_BONUS

  const defenderFaction = territoryOwners[toId];
  let defendBonus = getLeaderBonus({
    faction: defenderFaction,
    territory: target,
    isAttacking: false,
    leaderStates,
  });
  if (defenderFaction === 'british' && target?.isNaval) defendBonus += 1;
  if (target?.hasFort) defendBonus += 1;
  defendBonus = Math.min(defendBonus, 2); // Cap at MAX_BONUS

  // Risk assessment: avoid attacks with <30% win probability
  const winProbability = estimateWinProbability(attackerTroops, defenderTroops, attackBonus, defendBonus);
  if (winProbability < 0.3) return -1;

  let score = 0;

  // Prefer targets with fewer defenders
  score += (attackerTroops - defenderTroops) * 3;

  // Prefer high-value territories
  score += target.points * 2;

  // Prefer targets without forts
  if (target.hasFort) score -= 3;

  // Leader bonus consideration
  score += attackBonus * 2;

  // Win probability bonus (higher probability = higher score)
  score += winProbability * 5;

  // British AI prefers Chesapeake/Maritime targets
  if (faction === 'british' && (target.theater === 'Chesapeake' || target.theater === 'Maritime')) {
    score += 2;
  }

  // Native AI prefers Great Lakes frontier
  if (faction === 'native' && target.theater === 'Great Lakes') {
    score += 2;
  }

  // US AI prefers Canadian targets
  if (faction === 'us' && target.theater === 'Great Lakes') {
    score += 3;
  }

  return score;
}

/**
 * Run AI turn for a single faction. Returns new troops and territoryOwners.
 * Also returns a log of actions for display.
 */
export function runAITurn(faction, territoryOwners, troops, leaderStates, invulnerableTerritories = [], round = 1) {
  let newOwners = { ...territoryOwners };
  let newTroops = { ...troops };
  const log = [];
  const actions = [];

  // ── Phase 1: Allocate reinforcements ──
  const reinforcements = aiReinforcements(faction, newOwners, leaderStates, round);
  const ownedTerritories = Object.entries(newOwners)
    .filter(([, owner]) => owner === faction)
    .map(([id]) => id);

  if (ownedTerritories.length === 0) {
    return { territoryOwners: newOwners, troops: newTroops, log, actions };
  }

  // Sort by priority and distribute reinforcements
  const prioritized = ownedTerritories
    .map((id) => ({ id, priority: reinforcePriority(id, faction, newOwners, newTroops) }))
    .sort((a, b) => b.priority - a.priority);

  // Track reinforcements per territory
  const reinforcementsByTerritory = {};
  let remaining = Number.isFinite(reinforcements) ? reinforcements : 0;
  const MAX_ITERATIONS = 200;

  // Distribute reinforcements across frontline territories weighted by priority
  if (prioritized.length > 0 && remaining > 0) {
    // Focus on frontline territories (those adjacent to enemies)
    const frontline = prioritized.filter(({ id }) => {
      const terr = territories[id];
      return terr && terr.adjacency.some(adjId =>
        newOwners[adjId] && newOwners[adjId] !== faction && newOwners[adjId] !== 'neutral'
      );
    });
    const targets = frontline.length > 0 ? frontline : prioritized;

    // Give top 40% to highest priority, distribute rest across top targets
    const topPriority = targets[0];
    const concentratedAmount = Math.min(Math.ceil(reinforcements * 0.4), remaining);
    newTroops[topPriority.id] = (newTroops[topPriority.id] || 0) + concentratedAmount;
    reinforcementsByTerritory[topPriority.id] = concentratedAmount;
    remaining -= concentratedAmount;

    // Distribute remaining across other frontline territories
    let index = 1;
    let iterations = 0;
    while (remaining > 0 && targets.length > 0 && iterations < MAX_ITERATIONS) {
      const target = targets[index % targets.length];
      newTroops[target.id] = (newTroops[target.id] || 0) + 1;
      reinforcementsByTerritory[target.id] = (reinforcementsByTerritory[target.id] || 0) + 1;
      remaining--;
      index++;
      iterations++;
    }
  }

  // Create action objects for each reinforced territory
  for (const [territoryId, count] of Object.entries(reinforcementsByTerritory)) {
    actions.push({
      type: 'reinforce',
      territory: territories[territoryId]?.name || territoryId,
      troops: count,
    });
  }

  log.push(`${factionName(faction)} receives ${reinforcements} reinforcements.`);

  // ── Phase 2: Attack (up to 5 attacks per turn) ──
  const MAX_ATTACKS = 5;
  let attacksRemaining = MAX_ATTACKS;
  while (attacksRemaining > 0) {
    attacksRemaining--;
    // Find all possible attacks
    const possibleAttacks = findPossibleAttacks(faction, newOwners, newTroops, leaderStates, invulnerableTerritories);

    if (possibleAttacks.length === 0) break;

    // Pick the best attack (with slight randomization)
    possibleAttacks.sort((a, b) => b.score - a.score);
    const topN = possibleAttacks.slice(0, 3);
    const chosen = topN[Math.floor(Math.random() * topN.length)];

    // Store troops before battle
    const attackerTroopsBefore = newTroops[chosen.fromId] || 0;
    const defenderTroopsBefore = newTroops[chosen.toId] || 0;

    // Execute battle
    const result = executeBattle(chosen.fromId, chosen.toId, faction, newOwners, newTroops, leaderStates);

    // Calculate casualties
    const attackerLosses = attackerTroopsBefore - (result.troops[chosen.fromId] || 0) - (result.conquered ? result.movedTroops || 0 : 0);
    const defenderLosses = defenderTroopsBefore - (result.conquered ? 0 : (result.troops[chosen.toId] || 0));

    newOwners = result.territoryOwners;
    newTroops = result.troops;

    const fromName = territories[chosen.fromId]?.name || chosen.fromId;
    const toName = territories[chosen.toId]?.name || chosen.toId;

    // Create attack action object
    actions.push({
      type: 'attack',
      from: fromName,
      to: toName,
      result: result.conquered ? 'captured' : 'repelled',
      casualties: {
        attacker: attackerLosses,
        defender: defenderLosses,
      },
    });

    if (result.conquered) {
      log.push(`${factionName(faction)} captures ${toName}!`);
    } else {
      log.push(`${factionName(faction)} attacks ${toName} but is repelled.`);
    }
  }

  // ── Phase 3: Maneuver — move troops from safe interior to frontline ──
  const ownedAfterBattle = Object.entries(newOwners)
    .filter(([, owner]) => owner === faction)
    .map(([id]) => id);

  // Find interior territories (no enemy neighbors) with excess troops
  const interiorWithTroops = ownedAfterBattle.filter(id => {
    const terr = territories[id];
    if (!terr) return false;
    const hasEnemyNeighbor = terr.adjacency.some(adjId =>
      newOwners[adjId] && newOwners[adjId] !== faction && newOwners[adjId] !== 'neutral'
    );
    return !hasEnemyNeighbor && (newTroops[id] || 0) > 1;
  });

  // Move troops toward frontline (up to 3 maneuvers)
  let maneuversLeft = 3;
  for (const fromId of interiorWithTroops) {
    if (maneuversLeft <= 0) break;
    const terr = territories[fromId];
    if (!terr) continue;

    // Find an adjacent friendly territory that IS on the frontline
    const frontlineNeighbor = terr.adjacency.find(adjId => {
      if (newOwners[adjId] !== faction) return false;
      const adjTerr = territories[adjId];
      if (!adjTerr) return false;
      return adjTerr.adjacency.some(n => newOwners[n] && newOwners[n] !== faction && newOwners[n] !== 'neutral');
    });

    if (frontlineNeighbor) {
      const movers = Math.min((newTroops[fromId] || 0) - 1, 3);
      if (movers > 0) {
        newTroops[fromId] -= movers;
        newTroops[frontlineNeighbor] = (newTroops[frontlineNeighbor] || 0) + movers;
        actions.push({
          type: 'maneuver',
          from: territories[fromId]?.name || fromId,
          to: territories[frontlineNeighbor]?.name || frontlineNeighbor,
          troops: movers,
        });
        log.push(`${factionName(faction)} moves ${movers} troops to ${territories[frontlineNeighbor]?.name}.`);
        maneuversLeft--;
      }
    }
  }

  return { territoryOwners: newOwners, troops: newTroops, log, actions };
}

/**
 * Find all possible attacks for a faction.
 */
function findPossibleAttacks(faction, owners, currentTroops, leaderStates, invulnerableTerritories = []) {
  const attacks = [];
  for (const fromId of Object.keys(owners).filter((id) => owners[id] === faction)) {
    if ((currentTroops[fromId] || 0) < 2) continue;
    const terr = territories[fromId];
    if (!terr) continue;
    for (const toId of terr.adjacency) {
      if (owners[toId] === faction || owners[toId] === undefined) continue;
      // Skip invulnerable territories (Fort McHenry event)
      if (invulnerableTerritories.includes(toId)) continue;
      const score = attackScore(fromId, toId, faction, owners, currentTroops, leaderStates);
      if (score > 0) {
        attacks.push({ fromId, toId, score });
      }
    }
  }
  return attacks;
}

/**
 * Execute a battle between AI attacker and any defender.
 * Same dice mechanics as player battles.
 */
function executeBattle(fromId, toId, attackerFaction, territoryOwners, troops, leaderStates) {
  const newOwners = { ...territoryOwners };
  const newTroops = { ...troops };

  let currentDefenderTroops = newTroops[toId] || 0;

  // Auto-capture undefended territories
  if (currentDefenderTroops === 0) {
    const movers = Math.min((newTroops[fromId] || 0) - 1, 3);
    newTroops[fromId] = Math.max(1, (newTroops[fromId] || 0) - movers);
    newTroops[toId] = Math.max(1, movers);
    newOwners[toId] = attackerFaction;
    return { territoryOwners: newOwners, troops: newTroops, conquered: true, movedTroops: movers };
  }

  // First strike: attacker's faction leader inflicts damage before dice
  const firstStrikeBonus = getFirstStrikeBonus(attackerFaction, territories[toId], leaderStates);
  let firstStrikeDamage = 0;
  if (firstStrikeBonus > 0) {
    // Fixed 1 damage instead of variable to prevent auto-win
    firstStrikeDamage = 1;
    currentDefenderTroops = Math.max(0, currentDefenderTroops - firstStrikeDamage);
    if (currentDefenderTroops === 0) {
      // First strike wiped them out
      const movers = Math.min((newTroops[fromId] || 0) - 1, 3);
      newTroops[fromId] = Math.max(1, (newTroops[fromId] || 0) - movers);
      newTroops[toId] = Math.max(1, movers);
      newOwners[toId] = attackerFaction;
      return { territoryOwners: newOwners, troops: newTroops, conquered: true, movedTroops: movers };
    }
  }

  const attackerCount = Math.min((newTroops[fromId] || 0) - 1, 3);
  const defenderCount = Math.min(currentDefenderTroops, 2);

  if (attackerCount <= 0) return { territoryOwners: newOwners, troops: newTroops, conquered: false, movedTroops: 0 };

  const attackRolls = Array.from({ length: attackerCount }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
  const defendRolls = Array.from({ length: defenderCount }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);

  // Cap total bonuses to prevent stacking abuse
  const MAX_BONUS = 2;

  // Leader bonuses
  let attackBonus = getLeaderBonus({
    faction: attackerFaction,
    territory: territories[fromId],
    isAttacking: true,
    leaderStates,
  });

  // British naval superiority: +1 on naval territories
  if (attackerFaction === 'british' && territories[toId]?.isNaval) {
    attackBonus += 1;
  }

  // Cap attack bonus at MAX_BONUS
  attackBonus = Math.min(attackBonus, MAX_BONUS);

  if (attackBonus > 0 && attackRolls.length > 0) {
    attackRolls[0] = Math.min(attackRolls[0] + attackBonus, 9);
  }

  const defenderFaction = territoryOwners[toId];
  let defendBonus = getLeaderBonus({
    faction: defenderFaction,
    territory: territories[toId],
    isAttacking: false,
    leaderStates,
  });

  // British naval superiority on defense
  if (defenderFaction === 'british' && territories[toId]?.isNaval) {
    defendBonus += 1;
  }

  // Fort bonus (included in cap calculation)
  if (territories[toId]?.hasFort) {
    defendBonus += 1;
  }

  // Cap defense bonus at MAX_BONUS
  defendBonus = Math.min(defendBonus, MAX_BONUS);

  if (defendBonus > 0 && defendRolls.length > 0) {
    defendRolls[0] = Math.min(defendRolls[0] + defendBonus, 9);
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

  newTroops[fromId] = Math.max(1, (newTroops[fromId] || 0) - attackerLosses);
  const totalDefenderTroops = troops[toId] || 0;
  const newDefenderTroops = Math.max(0, totalDefenderTroops - defenderLosses);
  const conquered = newDefenderTroops === 0;

  if (conquered) {
    const movers = Math.min(attackerCount - attackerLosses, newTroops[fromId] - 1);
    newTroops[fromId] = Math.max(1, newTroops[fromId] - movers);
    newTroops[toId] = Math.max(1, movers);
    newOwners[toId] = attackerFaction;
    return { territoryOwners: newOwners, troops: newTroops, conquered, movedTroops: movers };
  } else {
    newTroops[toId] = newDefenderTroops;
  }

  return { territoryOwners: newOwners, troops: newTroops, conquered, movedTroops: 0 };
}

function factionName(faction) {
  const names = { us: 'United States', british: 'British/Canada', native: 'Native Coalition' };
  return names[faction] || faction;
}
