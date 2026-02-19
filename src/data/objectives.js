/**
 * Objective Cards for War of 1812: Rise of the Nation
 *
 * Each faction receives 5 objectives at game start. Completing objectives
 * grants bonus points at the end of the game. Objectives encourage historically
 * themed play and give students goals beyond "capture everything."
 *
 * - id: unique key
 * - faction: which faction this objective belongs to
 * - title: short objective name
 * - description: what the student needs to accomplish
 * - historicalContext: why this objective matters historically
 * - points: bonus points awarded at game end if completed
 * - progress(gameState): returns { current, total } for progress tracking
 * - check(gameState): function that returns true if objective is met
 */

const objectives = [
  // ── United States Objectives ──
  {
    id: 'us_defend_capital',
    faction: 'us',
    title: 'Defend the Republic',
    description: 'Control Washington D.C. at the end of the war.',
    historicalContext: 'The British captured and burned Washington D.C. in August 1814 — the only time a foreign power has taken the American capital. Holding it would have been a powerful statement of American resilience.',
    points: 10,
    progress: ({ territoryOwners }) => ({ current: territoryOwners.washington_dc === 'us' ? 1 : 0, total: 1 }),
    check: ({ territoryOwners }) => territoryOwners.washington_dc === 'us',
  },
  {
    id: 'us_conquer_canada',
    faction: 'us',
    title: 'Manifest Destiny: North',
    description: 'Control Upper Canada and Montreal at the end of the war.',
    historicalContext: 'Many War Hawks believed conquering Canada would be "a mere matter of marching." In reality, every American invasion of Canada failed. Achieving this objective would rewrite history.',
    points: 15,
    progress: ({ territoryOwners }) => ({
      current: (territoryOwners.upper_canada === 'us' ? 1 : 0) + (territoryOwners.montreal === 'us' ? 1 : 0),
      total: 2,
    }),
    check: ({ territoryOwners }) =>
      territoryOwners.upper_canada === 'us' && territoryOwners.montreal === 'us',
  },
  {
    id: 'us_nationalism_high',
    faction: 'us',
    title: 'Era of Good Feelings',
    description: 'End the war with Nationalism at 70% or higher.',
    historicalContext: 'After the war, American nationalism surged so powerfully that the period 1815-1825 was called the "Era of Good Feelings." This sense of national unity helped define American identity for generations.',
    points: 10,
    progress: ({ nationalismMeter }) => ({ current: Math.min(nationalismMeter, 70), total: 70 }),
    check: ({ nationalismMeter }) => nationalismMeter >= 70,
  },
  {
    id: 'us_lake_control',
    faction: 'us',
    title: 'Master of the Lakes',
    description: 'Control both Lake Erie and Lake Ontario at game end.',
    historicalContext: 'Control of the Great Lakes determined who controlled the frontier. Perry\'s victory on Lake Erie in 1813 was a turning point that cut British supply lines and forced them to abandon Detroit.',
    points: 10,
    progress: ({ territoryOwners }) => ({
      current: (territoryOwners.lake_erie === 'us' ? 1 : 0) + (territoryOwners.lake_ontario === 'us' ? 1 : 0),
      total: 2,
    }),
    check: ({ territoryOwners }) =>
      territoryOwners.lake_erie === 'us' && territoryOwners.lake_ontario === 'us',
  },
  {
    id: 'us_southern_secure',
    faction: 'us',
    title: 'Secure the South',
    description: 'Control New Orleans, Mobile, and Creek Nation at game end.',
    historicalContext: 'The Southern theater was crucial for controlling the Mississippi River — America\'s economic lifeline. Jackson\'s campaigns here made him a national hero and opened millions of acres to American settlement.',
    points: 10,
    progress: ({ territoryOwners }) => ({
      current: (territoryOwners.new_orleans === 'us' ? 1 : 0) + (territoryOwners.mobile === 'us' ? 1 : 0) + (territoryOwners.creek_nation === 'us' ? 1 : 0),
      total: 3,
    }),
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
    historicalContext: 'Canada\'s survival against repeated American invasions became a founding myth for Canadian national identity. Brock, Secord, and the Canadian militia became national heroes for defending their homeland.',
    points: 10,
    progress: ({ territoryOwners }) => ({
      current: (territoryOwners.upper_canada === 'british' ? 1 : 0) + (territoryOwners.montreal === 'british' ? 1 : 0),
      total: 2,
    }),
    check: ({ territoryOwners }) =>
      territoryOwners.upper_canada === 'british' && territoryOwners.montreal === 'british',
  },
  {
    id: 'british_burn_washington',
    faction: 'british',
    title: 'Burn the Capital',
    description: 'Control Washington D.C. at the end of the war.',
    historicalContext: 'The burning of Washington in 1814 was retaliation for the American burning of York (Toronto). British Admiral Cockburn sat in the Speaker\'s chair and held a mock vote to burn the "harbor of Yankee democracy."',
    points: 15,
    progress: ({ territoryOwners }) => ({ current: territoryOwners.washington_dc === 'british' ? 1 : 0, total: 1 }),
    check: ({ territoryOwners }) => territoryOwners.washington_dc === 'british',
  },
  {
    id: 'british_naval_dominance',
    faction: 'british',
    title: 'Rule Britannia',
    description: 'Control Atlantic Sea Lanes, Chesapeake Bay, and Halifax at game end.',
    historicalContext: 'The Royal Navy was the most powerful fleet in the world, with over 600 ships. British naval dominance allowed them to blockade the entire American coast, strangling trade and projecting power at will.',
    points: 10,
    progress: ({ territoryOwners }) => ({
      current: (territoryOwners.atlantic_sea_lanes === 'british' ? 1 : 0) + (territoryOwners.chesapeake_bay === 'british' ? 1 : 0) + (territoryOwners.halifax === 'british' ? 1 : 0),
      total: 3,
    }),
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
    historicalContext: 'The Niagara frontier saw some of the war\'s fiercest fighting — Queenston Heights, Lundy\'s Lane, Fort Niagara. Control of this corridor between Lakes Erie and Ontario was essential for defending Upper Canada.',
    points: 10,
    progress: ({ territoryOwners, troops }) => ({
      current: (territoryOwners.niagara === 'british' ? 1 : 0) + (territoryOwners.niagara === 'british' && (troops.niagara || 0) >= 5 ? 1 : 0),
      total: 2,
    }),
    check: ({ territoryOwners, troops }) =>
      territoryOwners.niagara === 'british' && (troops.niagara || 0) >= 5,
  },
  {
    id: 'british_blockade',
    faction: 'british',
    title: 'The Blockade Holds',
    description: 'Control at least 3 naval territories (lakes/seas) at game end.',
    historicalContext: 'The British blockade reduced American exports from $61 million (1811) to just $7 million (1814). But it also forced Americans to build their own factories, inadvertently kickstarting American industrialization.',
    points: 10,
    progress: ({ territoryOwners }) => {
      const navalTerritories = ['lake_erie', 'lake_ontario', 'chesapeake_bay', 'atlantic_sea_lanes', 'gulf_of_mexico'];
      return { current: navalTerritories.filter((id) => territoryOwners[id] === 'british').length, total: 3 };
    },
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
    historicalContext: 'Tecumseh envisioned a sovereign Native confederacy stretching from the Great Lakes to the Gulf Coast. His dream of a unified resistance to American expansion was the most ambitious pan-Native political movement in history.',
    points: 10,
    progress: ({ territoryOwners }) => ({
      current: (territoryOwners.indiana_territory === 'native' ? 1 : 0) + (territoryOwners.creek_nation === 'native' ? 1 : 0),
      total: 2,
    }),
    check: ({ territoryOwners }) =>
      territoryOwners.indiana_territory === 'native' && territoryOwners.creek_nation === 'native',
  },
  {
    id: 'native_frontier_expansion',
    faction: 'native',
    title: 'Reclaim the Frontier',
    description: 'Control at least 4 territories at game end.',
    historicalContext: 'Before European colonization, Native peoples governed vast territories across North America. By 1812, decades of treaties (often coerced) had reduced their lands dramatically. Reclaiming territory would reverse this devastating trend.',
    points: 15,
    progress: ({ territoryOwners }) => ({
      current: Object.values(territoryOwners).filter((o) => o === 'native').length,
      total: 4,
    }),
    check: ({ territoryOwners }) =>
      Object.values(territoryOwners).filter((o) => o === 'native').length >= 4,
  },
  {
    id: 'native_fort_dearborn',
    faction: 'native',
    title: 'Fall of Fort Dearborn',
    description: 'Capture Fort Dearborn from the Americans.',
    historicalContext: 'Fort Dearborn (present-day Chicago) was a symbol of American military presence on the frontier. Its fall in August 1812 shocked settlers and demonstrated the power of Native resistance in the Great Lakes region.',
    points: 10,
    progress: ({ territoryOwners }) => ({ current: territoryOwners.fort_dearborn === 'native' ? 1 : 0, total: 1 }),
    check: ({ territoryOwners }) => territoryOwners.fort_dearborn === 'native',
  },
  {
    id: 'native_detroit',
    faction: 'native',
    title: 'Detroit Reclaimed',
    description: 'Control Detroit at the end of the war.',
    historicalContext: 'Detroit was the gateway to the Northwest Territory. When Brock and Tecumseh captured it in 1812, it was a stunning combined victory. Native control of Detroit would ensure access to the Great Lakes fur trade and vital hunting grounds.',
    points: 10,
    progress: ({ territoryOwners }) => ({ current: territoryOwners.detroit === 'native' ? 1 : 0, total: 1 }),
    check: ({ territoryOwners }) => territoryOwners.detroit === 'native',
  },
  {
    id: 'native_survive',
    faction: 'native',
    title: 'Endure',
    description: 'Have at least 10 total troops across all territories at game end.',
    historicalContext: 'In reality, the war\'s end was catastrophic for Native peoples. With Tecumseh dead and Britain unwilling to support them, there was no check on American expansion. Within 20 years, the Indian Removal Act forced most Eastern nations west of the Mississippi.',
    points: 10,
    progress: ({ territoryOwners, troops }) => {
      const nativeTerritories = Object.entries(territoryOwners)
        .filter(([, o]) => o === 'native')
        .map(([id]) => id);
      return { current: Math.min(nativeTerritories.reduce((sum, id) => sum + (troops[id] || 0), 0), 10), total: 10 };
    },
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
 * Check all objectives for a faction and return results with progress.
 * Returns array of { ...objective, completed: boolean, progressInfo: { current, total } }
 */
export function checkObjectives(faction, gameState) {
  return getFactionObjectives(faction).map((obj) => ({
    ...obj,
    completed: obj.check(gameState),
    progressInfo: obj.progress ? obj.progress(gameState) : null,
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
