/**
 * Territory definitions for War of 1812: Rise of the Nation
 *
 * Each territory has:
 * - id: unique key
 * - name: display name
 * - theater: Great Lakes | Chesapeake | Southern | Maritime
 * - startingOwner: 'us' | 'british' | 'native' | 'neutral'
 * - points: territory point value per round
 * - hasFort: whether a fort provides +1 die defense bonus
 * - adjacency: array of adjacent territory ids
 * - hexCells: array of {col, row} hex positions this territory occupies
 * - primaryCell: index into hexCells for the cell that shows name/troops/etc.
 */

// ── Hex Grid Constants ──────────────────────────────────────
export const HEX_SIZE = 40; // flat-top hex "radius"
export const HEX_WIDTH = HEX_SIZE * 2; // 100px
export const HEX_HEIGHT = Math.round(HEX_SIZE * Math.sqrt(3)); // 87px
export const HEX_COL_SPACING = HEX_SIZE * 1.5; // 75px
export const HEX_ROW_SPACING = HEX_HEIGHT; // 87px
export const HEX_GRID_COLS = 12;
export const HEX_GRID_ROWS = 7;

/**
 * Convert hex grid coordinates to pixel position.
 * Flat-top hex: odd columns are offset down by half a hex height.
 */
export function hexToPixel(col, row) {
  const x = col * HEX_COL_SPACING;
  const y = row * HEX_ROW_SPACING + (col % 2 === 1 ? HEX_HEIGHT / 2 : 0);
  return { x, y };
}

// Legacy aliases for any code that still imports these
export const GRID_COLS = HEX_GRID_COLS;
export const GRID_ROWS = HEX_GRID_ROWS;

const territories = {
  // ── Great Lakes Theater ──────────────────────────────────────
  detroit: {
    id: 'detroit',
    name: 'Detroit',
    theater: 'Great Lakes',
    startingOwner: 'us',
    points: 2,
    hasFort: true,
    adjacency: ['fort_dearborn', 'lake_erie', 'upper_canada', 'ohio_valley'],
    hexCells: [{ col: 2, row: 1 }, { col: 3, row: 1 }],
    primaryCell: 0,
  },
  fort_dearborn: {
    id: 'fort_dearborn',
    name: 'Fort Dearborn',
    theater: 'Great Lakes',
    startingOwner: 'us',
    points: 1,
    hasFort: true,
    adjacency: ['detroit', 'ohio_valley', 'indiana_territory'],
    hexCells: [{ col: 1, row: 1 }],
    primaryCell: 0,
  },
  niagara: {
    id: 'niagara',
    name: 'Niagara',
    theater: 'Great Lakes',
    startingOwner: 'british',
    points: 2,
    hasFort: true,
    adjacency: ['lake_erie', 'upper_canada', 'new_york', 'lake_ontario'],
    hexCells: [{ col: 5, row: 1 }],
    primaryCell: 0,
  },
  lake_erie: {
    id: 'lake_erie',
    name: 'Lake Erie',
    theater: 'Great Lakes',
    startingOwner: 'neutral',
    points: 2,
    hasFort: false,
    adjacency: ['detroit', 'niagara', 'ohio_valley', 'upper_canada'],
    hexCells: [{ col: 4, row: 1 }],
    primaryCell: 0,
    isNaval: true,
  },
  lake_ontario: {
    id: 'lake_ontario',
    name: 'Lake Ontario',
    theater: 'Great Lakes',
    startingOwner: 'neutral',
    points: 1,
    hasFort: false,
    adjacency: ['niagara', 'upper_canada', 'new_york', 'montreal'],
    hexCells: [{ col: 6, row: 1 }],
    primaryCell: 0,
    isNaval: true,
  },
  upper_canada: {
    id: 'upper_canada',
    name: 'Upper Canada',
    theater: 'Great Lakes',
    startingOwner: 'british',
    points: 2,
    hasFort: true,
    adjacency: ['detroit', 'niagara', 'lake_erie', 'lake_ontario', 'montreal'],
    hexCells: [{ col: 3, row: 0 }, { col: 4, row: 0 }, { col: 5, row: 0 }],
    primaryCell: 1,
  },

  // ── Chesapeake Theater ───────────────────────────────────────
  washington_dc: {
    id: 'washington_dc',
    name: 'Washington D.C.',
    theater: 'Chesapeake',
    startingOwner: 'us',
    points: 3,
    hasFort: false,
    adjacency: ['baltimore', 'virginia', 'bladensburg'],
    hexCells: [{ col: 6, row: 3 }],
    primaryCell: 0,
  },
  baltimore: {
    id: 'baltimore',
    name: 'Baltimore',
    theater: 'Chesapeake',
    startingOwner: 'us',
    points: 2,
    hasFort: true,
    adjacency: ['washington_dc', 'bladensburg', 'new_york', 'chesapeake_bay'],
    hexCells: [{ col: 7, row: 3 }],
    primaryCell: 0,
  },
  bladensburg: {
    id: 'bladensburg',
    name: 'Bladensburg',
    theater: 'Chesapeake',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['washington_dc', 'baltimore', 'virginia', 'chesapeake_bay'],
    hexCells: [{ col: 8, row: 3 }],
    primaryCell: 0,
  },
  chesapeake_bay: {
    id: 'chesapeake_bay',
    name: 'Chesapeake Bay',
    theater: 'Chesapeake',
    startingOwner: 'neutral',
    points: 1,
    hasFort: false,
    adjacency: ['baltimore', 'bladensburg', 'virginia', 'atlantic_sea_lanes'],
    hexCells: [{ col: 9, row: 2 }],
    primaryCell: 0,
    isNaval: true,
  },
  virginia: {
    id: 'virginia',
    name: 'Virginia',
    theater: 'Chesapeake',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['washington_dc', 'bladensburg', 'chesapeake_bay', 'carolina'],
    hexCells: [{ col: 5, row: 3 }, { col: 5, row: 4 }, { col: 6, row: 4 }],
    primaryCell: 0,
  },

  // ── Southern Theater ─────────────────────────────────────────
  new_orleans: {
    id: 'new_orleans',
    name: 'New Orleans',
    theater: 'Southern',
    startingOwner: 'us',
    points: 3,
    hasFort: true,
    adjacency: ['mobile', 'mississippi_territory', 'gulf_of_mexico'],
    hexCells: [{ col: 1, row: 4 }, { col: 1, row: 5 }],
    primaryCell: 0,
  },
  mobile: {
    id: 'mobile',
    name: 'Mobile',
    theater: 'Southern',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['new_orleans', 'creek_nation', 'gulf_of_mexico', 'carolina'],
    hexCells: [{ col: 2, row: 5 }],
    primaryCell: 0,
  },
  creek_nation: {
    id: 'creek_nation',
    name: 'Creek Nation',
    theater: 'Southern',
    startingOwner: 'native',
    points: 2,
    hasFort: false,
    startingTroops: 4,
    adjacency: ['mobile', 'mississippi_territory', 'carolina'],
    hexCells: [{ col: 3, row: 4 }, { col: 4, row: 4 }, { col: 3, row: 5 }],
    primaryCell: 0,
  },
  mississippi_territory: {
    id: 'mississippi_territory',
    name: 'Mississippi Terr.',
    theater: 'Southern',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['new_orleans', 'creek_nation', 'indiana_territory'],
    hexCells: [{ col: 1, row: 3 }, { col: 2, row: 3 }],
    primaryCell: 0,
  },
  gulf_of_mexico: {
    id: 'gulf_of_mexico',
    name: 'Gulf of Mexico',
    theater: 'Southern',
    startingOwner: 'neutral',
    points: 1,
    hasFort: false,
    adjacency: ['new_orleans', 'mobile', 'atlantic_sea_lanes'],
    hexCells: [{ col: 2, row: 6 }, { col: 3, row: 6 }],
    primaryCell: 0,
    isNaval: true,
  },

  // ── Maritime Theater ─────────────────────────────────────────
  atlantic_sea_lanes: {
    id: 'atlantic_sea_lanes',
    name: 'Atlantic Sea Lanes',
    theater: 'Maritime',
    startingOwner: 'british',
    points: 2,
    hasFort: false,
    adjacency: ['chesapeake_bay', 'gulf_of_mexico', 'halifax', 'new_york'],
    hexCells: [{ col: 10, row: 1 }, { col: 10, row: 2 }],
    primaryCell: 0,
    isNaval: true,
  },
  halifax: {
    id: 'halifax',
    name: 'Halifax',
    theater: 'Maritime',
    startingOwner: 'british',
    points: 2,
    hasFort: true,
    adjacency: ['atlantic_sea_lanes', 'montreal', 'new_york'],
    hexCells: [{ col: 9, row: 0 }, { col: 9, row: 1 }],
    primaryCell: 0,
  },

  // ── Connectors / Interior ────────────────────────────────────
  new_york: {
    id: 'new_york',
    name: 'New York',
    theater: 'Chesapeake',
    startingOwner: 'us',
    points: 2,
    hasFort: false,
    adjacency: ['niagara', 'lake_ontario', 'baltimore', 'atlantic_sea_lanes', 'halifax', 'montreal'],
    hexCells: [{ col: 7, row: 2 }, { col: 8, row: 2 }],
    primaryCell: 0,
  },
  montreal: {
    id: 'montreal',
    name: 'Montreal',
    theater: 'Great Lakes',
    startingOwner: 'british',
    points: 2,
    hasFort: true,
    adjacency: ['upper_canada', 'lake_ontario', 'new_york', 'halifax'],
    hexCells: [{ col: 6, row: 0 }, { col: 7, row: 1 }],
    primaryCell: 0,
  },
  ohio_valley: {
    id: 'ohio_valley',
    name: 'Ohio Valley',
    theater: 'Great Lakes',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['detroit', 'fort_dearborn', 'lake_erie', 'indiana_territory', 'virginia'],
    hexCells: [{ col: 2, row: 2 }, { col: 3, row: 2 }, { col: 3, row: 3 }],
    primaryCell: 0,
  },
  indiana_territory: {
    id: 'indiana_territory',
    name: 'Indiana Terr.',
    theater: 'Great Lakes',
    startingOwner: 'native',
    points: 1,
    hasFort: false,
    startingTroops: 4,
    adjacency: ['fort_dearborn', 'ohio_valley', 'mississippi_territory'],
    hexCells: [{ col: 0, row: 2 }, { col: 1, row: 2 }],
    primaryCell: 0,
  },
  carolina: {
    id: 'carolina',
    name: 'Carolina',
    theater: 'Southern',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['virginia', 'mobile', 'creek_nation'],
    hexCells: [{ col: 7, row: 4 }, { col: 8, row: 4 }],
    primaryCell: 0,
  },
};

// Theater configuration for visual grouping on the board
export const theaterConfig = {
  'Great Lakes': { color: 'rgba(37, 99, 235, 0.08)' },
  'Chesapeake': { color: 'rgba(220, 38, 38, 0.08)' },
  'Southern': { color: 'rgba(161, 98, 7, 0.08)' },
  'Maritime': { color: 'rgba(107, 114, 128, 0.08)' },
};

// ── Decoration Hexes (non-interactive terrain) ──────────────
export const decorationHexes = [
  // Great Lakes water
  { col: 1, row: 0, type: 'water', label: 'Lake Huron' },
  { col: 2, row: 0, type: 'water', label: '' },
  // Atlantic Ocean
  { col: 10, row: 0, type: 'water', label: '' },
  { col: 11, row: 1, type: 'water', label: 'Atlantic' },
  { col: 11, row: 2, type: 'water', label: 'Ocean' },
  { col: 10, row: 3, type: 'water', label: '' },
  { col: 10, row: 4, type: 'water', label: '' },
  { col: 9, row: 3, type: 'water', label: '' },
  // Gulf of Mexico
  { col: 0, row: 5, type: 'water', label: '' },
  { col: 1, row: 6, type: 'water', label: 'Gulf of' },
  { col: 4, row: 6, type: 'water', label: 'Mexico' },
  { col: 4, row: 5, type: 'water', label: '' },
  // Appalachian Mountains
  { col: 4, row: 2, type: 'mountain', label: '' },
  { col: 5, row: 2, type: 'mountain', label: 'Appalachians' },
  { col: 4, row: 3, type: 'mountain', label: '' },
  { col: 6, row: 2, type: 'mountain', label: '' },
  // Forest / wilderness
  { col: 0, row: 1, type: 'forest', label: '' },
  { col: 0, row: 3, type: 'forest', label: '' },
  { col: 0, row: 4, type: 'forest', label: '' },
];

// Helper: get all territory ids
export const getTerritoryIds = () => Object.keys(territories);

// Helper: get territories by theater
export const getTheater = (theater) =>
  Object.values(territories).filter((t) => t.theater === theater);

// Helper: check adjacency
export const areAdjacent = (id1, id2) =>
  territories[id1]?.adjacency.includes(id2) ?? false;

// Helper: get starting territories for a faction
export const getStartingTerritories = (faction) =>
  Object.values(territories).filter((t) => t.startingOwner === faction);

export default territories;
