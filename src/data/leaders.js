/**
 * Leader Cards for War of 1812
 *
 * Each leader provides a passive or activated ability during battle.
 * - id: unique key
 * - name: historical name
 * - faction: 'us' | 'british' | 'native'
 * - title: rank/role
 * - ability: description of special power
 * - abilityType: 'attack_bonus' | 'defense_bonus' | 'rally' | 'first_strike' | 'naval'
 * - modifier: numeric bonus value
 * - theater: preferred theater (bonus applies here), null = anywhere
 * - alive: whether this leader is still in play
 */

const leaders = {
  // ── United States ──
  jackson: {
    id: 'jackson',
    name: 'Andrew Jackson',
    faction: 'us',
    title: 'Major General',
    ability: 'Old Hickory: +2 to highest attack die in Southern Theater.',
    abilityType: 'attack_bonus',
    modifier: 2,
    theater: 'Southern',
    alive: true,
  },
  perry: {
    id: 'perry',
    name: 'Oliver Hazard Perry',
    faction: 'us',
    title: 'Commodore',
    ability: 'Master of the Lakes: +2 to attack/defense in naval territories.',
    abilityType: 'naval',
    modifier: 2,
    theater: null, // applies to any naval zone
    alive: true,
  },
  harrison: {
    id: 'harrison',
    name: 'William Henry Harrison',
    faction: 'us',
    title: 'Major General',
    ability: 'Tippecanoe: +1 to all attack dice in Great Lakes Theater.',
    abilityType: 'attack_bonus',
    modifier: 1,
    theater: 'Great Lakes',
    alive: true,
  },
  winfield_scott: {
    id: 'winfield_scott',
    name: 'Winfield Scott',
    faction: 'us',
    title: 'Brigadier General',
    ability: 'Disciplined Troops: +1 defense die when defending any territory.',
    abilityType: 'defense_bonus',
    modifier: 1,
    theater: null,
    alive: true,
  },

  // ── British / Canada ──
  brock: {
    id: 'brock',
    name: 'Isaac Brock',
    faction: 'british',
    title: 'Major General',
    ability: 'Hero of Upper Canada: +2 to defense in Great Lakes territories.',
    abilityType: 'defense_bonus',
    modifier: 2,
    theater: 'Great Lakes',
    alive: true,
  },
  drummond: {
    id: 'drummond',
    name: 'Gordon Drummond',
    faction: 'british',
    title: 'Lieutenant General',
    ability: 'Relentless Assault: +1 to all attack dice.',
    abilityType: 'attack_bonus',
    modifier: 1,
    theater: null,
    alive: true,
  },
  ross: {
    id: 'ross',
    name: 'Robert Ross',
    faction: 'british',
    title: 'Major General',
    ability: 'Shock and Awe: +2 attack bonus in Chesapeake Theater.',
    abilityType: 'attack_bonus',
    modifier: 2,
    theater: 'Chesapeake',
    alive: true,
  },
  prevost: {
    id: 'prevost',
    name: 'George Prevost',
    faction: 'british',
    title: 'Governor General',
    ability: 'Defensive Coordination: +1 troop reinforcement per turn.',
    abilityType: 'rally',
    modifier: 1,
    theater: null,
    alive: true,
  },

  // ── Native Coalition ──
  tecumseh: {
    id: 'tecumseh',
    name: 'Tecumseh',
    faction: 'native',
    title: 'War Chief',
    ability: 'Confederacy Leader: +2 to attack, can rally +1 troop in any Native territory per turn.',
    abilityType: 'attack_bonus',
    modifier: 2,
    theater: null,
    alive: true,
  },
  tenskwatawa: {
    id: 'tenskwatawa',
    name: 'Tenskwatawa',
    faction: 'native',
    title: 'The Prophet',
    ability: 'Spiritual Rally: +2 reinforcement troops per turn for Native Coalition.',
    abilityType: 'rally',
    modifier: 2,
    theater: null,
    alive: true,
  },
  red_eagle: {
    id: 'red_eagle',
    name: 'Red Eagle (William Weatherford)',
    faction: 'native',
    title: 'Red Stick War Chief',
    ability: 'Red Stick Fury: +2 to attack in Southern Theater, homeland of the Creek War.',
    abilityType: 'attack_bonus',
    modifier: 2,
    theater: 'Southern',
    alive: true,
  },
};

/**
 * Get all leaders for a given faction.
 */
export function getFactionLeaders(faction) {
  return Object.values(leaders).filter((l) => l.faction === faction);
}

/**
 * Get alive leaders for a faction.
 */
export function getAliveLeaders(faction, leaderStates) {
  return Object.values(leaders).filter(
    (l) => l.faction === faction && (leaderStates?.[l.id]?.alive ?? l.alive)
  );
}

/**
 * Calculate leader combat bonus for an attack/defense.
 * Returns the total modifier to add to the highest die.
 */
export function getLeaderBonus({ faction, territory, isAttacking, leaderStates }) {
  const alive = getAliveLeaders(faction, leaderStates);
  let bonus = 0;

  for (const leader of alive) {
    const theaterMatch = !leader.theater || leader.theater === territory?.theater;
    const navalMatch = leader.abilityType === 'naval' && territory?.isNaval;

    if (leader.abilityType === 'attack_bonus' && isAttacking && theaterMatch) {
      bonus += leader.modifier;
    } else if (leader.abilityType === 'defense_bonus' && !isAttacking && theaterMatch) {
      bonus += leader.modifier;
    } else if (navalMatch) {
      bonus += leader.modifier;
    }
  }

  return bonus;
}

/**
 * Check if a faction has first strike in a given territory.
 * Returns the modifier (troop loss inflicted before dice) or 0.
 */
export function getFirstStrikeBonus(faction, territory, leaderStates) {
  const alive = getAliveLeaders(faction, leaderStates);
  for (const leader of alive) {
    if (leader.abilityType === 'first_strike') {
      const theaterMatch = !leader.theater || leader.theater === territory?.theater;
      if (theaterMatch) return leader.modifier;
    }
  }
  return 0;
}

/**
 * Calculate leader rally bonus (extra reinforcements per turn).
 */
export function getLeaderRallyBonus(faction, leaderStates) {
  const alive = getAliveLeaders(faction, leaderStates);
  return alive
    .filter((l) => l.abilityType === 'rally')
    .reduce((sum, l) => sum + l.modifier, 0);
}

export default leaders;
