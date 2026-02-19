/**
 * Objective Cards for War of 1812: Rise of the Nation
 *
 * Each faction receives 3 objectives at game start. Completing objectives
 * grants bonus points at the end of the game. Objectives encourage historically
 * themed play and give students goals beyond "capture everything."
 *
 * - id: unique key
 * - faction: which faction this objective belongs to
 * - title: short objective name
 * - description: what the student needs to accomplish
 * - points: bonus points awarded at game end if completed
 * - check(gameState): function that returns true if objective is met
 */

const objectives = [
  // ── United States Objectives ──
  {
    id: 'us_defend_capital',
    faction: 'us',
    title: 'Defend the Republic',
    description: 'Control Washington D.C. at the end of the war.',
    points: 10,
    check: ({ territoryOwners }) => territoryOwners.washington_dc === 'us',
  },
  {
    id: 'us_conquer_canada',
    faction: 'us',
    title: 'Manifest Destiny: North',
    description: 'Control Upper Canada and Montreal at the end of the war.',
    points: 15,
    check: ({ territoryOwners }) =>
      territoryOwners.upper_canada === 'us' && territoryOwners.montreal === 'us',
  },
  {
    id: 'us_nationalism_high',
    faction: 'us',
    title: 'Era of Good Feelings',
    description: 'End the war with Nationalism at 70% or higher.',
    points: 10,
    check: ({ nationalismMeter }) => nationalismMeter >= 70,
  },
  {
    id: 'us_lake_control',
    faction: 'us',
    title: 'Master of the Lakes',
    description: 'Control both Lake Erie and Lake Ontario at game end.',
    points: 10,
    check: ({ territoryOwners }) =>
      territoryOwners.lake_erie === 'us' && territoryOwners.lake_ontario === 'us',
  },
  {
    id: 'us_southern_secure',
    faction: 'us',
    title: 'Secure the South',
    description: 'Control New Orleans, Mobile, and Creek Nation at game end.',
    points: 10,
    check: ({ territoryOwners }) =>
      territoryOwners.new_orleans === 'us' &&
      territoryOwners.mobile === 'us' &&
      territoryOwners.creek_nation === 'us',
  },

  // ── British / Canada Objectives ──
  {
    id: 'british_hold_canada',
    faction: 'british',
    title: 'Hold the Line',
    description: 'Control Upper Canada and Montreal at the end of the war.',
    points: 10,
    check: ({ territoryOwners }) =>
      territoryOwners.upper_canada === 'british' && territoryOwners.montreal === 'british',
  },
  {
    id: 'british_burn_washington',
    faction: 'british',
    title: 'Burn the Capital',
    description: 'Control Washington D.C. at the end of the war.',
    points: 15,
    check: ({ territoryOwners }) => territoryOwners.washington_dc === 'british',
  },
  {
    id: 'british_naval_dominance',
    faction: 'british',
    title: 'Rule Britannia',
    description: 'Control Atlantic Sea Lanes, Chesapeake Bay, and Halifax at game end.',
    points: 10,
    check: ({ territoryOwners }) =>
      territoryOwners.atlantic_sea_lanes === 'british' &&
      territoryOwners.chesapeake_bay === 'british' &&
      territoryOwners.halifax === 'british',
  },
  {
    id: 'british_niagara_front',
    faction: 'british',
    title: 'Fortress Niagara',
    description: 'Control Niagara and have 5+ troops there at game end.',
    points: 10,
    check: ({ territoryOwners, troops }) =>
      territoryOwners.niagara === 'british' && (troops.niagara || 0) >= 5,
  },
  {
    id: 'british_blockade',
    faction: 'british',
    title: 'The Blockade Holds',
    description: 'Control at least 3 naval territories (lakes/seas) at game end.',
    points: 10,
    check: ({ territoryOwners }) => {
      const navalTerritories = ['lake_erie', 'lake_ontario', 'chesapeake_bay', 'atlantic_sea_lanes', 'gulf_of_mexico'];
      return navalTerritories.filter((id) => territoryOwners[id] === 'british').length >= 3;
    },
  },

  // ── Native Coalition Objectives ──
  {
    id: 'native_hold_homeland',
    faction: 'native',
    title: "Tecumseh's Dream",
    description: 'Control Indiana Territory and Creek Nation at the end of the war.',
    points: 10,
    check: ({ territoryOwners }) =>
      territoryOwners.indiana_territory === 'native' && territoryOwners.creek_nation === 'native',
  },
  {
    id: 'native_frontier_expansion',
    faction: 'native',
    title: 'Reclaim the Frontier',
    description: 'Control at least 4 territories at game end.',
    points: 15,
    check: ({ territoryOwners }) =>
      Object.values(territoryOwners).filter((o) => o === 'native').length >= 4,
  },
  {
    id: 'native_fort_dearborn',
    faction: 'native',
    title: 'Fall of Fort Dearborn',
    description: 'Capture Fort Dearborn from the Americans.',
    points: 10,
    check: ({ territoryOwners }) => territoryOwners.fort_dearborn === 'native',
  },
  {
    id: 'native_detroit',
    faction: 'native',
    title: 'Detroit Reclaimed',
    description: 'Control Detroit at the end of the war.',
    points: 10,
    check: ({ territoryOwners }) => territoryOwners.detroit === 'native',
  },
  {
    id: 'native_survive',
    faction: 'native',
    title: 'Endure',
    description: 'Have at least 10 total troops across all territories at game end.',
    points: 10,
    check: ({ territoryOwners, troops }) => {
      const nativeTerritories = Object.entries(territoryOwners)
        .filter(([, o]) => o === 'native')
        .map(([id]) => id);
      const totalTroops = nativeTerritories.reduce((sum, id) => sum + (troops[id] || 0), 0);
      return totalTroops >= 10;
    },
  },
];

/**
 * Get objectives for a given faction.
 */
export function getFactionObjectives(faction) {
  return objectives.filter((obj) => obj.faction === faction);
}

/**
 * Check all objectives for a faction and return results.
 * Returns array of { ...objective, completed: boolean }
 */
export function checkObjectives(faction, gameState) {
  return getFactionObjectives(faction).map((obj) => ({
    ...obj,
    completed: obj.check(gameState),
  }));
}

/**
 * Calculate total bonus points from completed objectives.
 */
export function getObjectiveBonus(faction, gameState) {
  return checkObjectives(faction, gameState)
    .filter((obj) => obj.completed)
    .reduce((sum, obj) => sum + obj.points, 0);
}

export default objectives;
