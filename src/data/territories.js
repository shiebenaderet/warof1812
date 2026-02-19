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
 * - gridPosition: {col, row} position on the game board grid
 */

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
    gridPosition: { col: 1, row: 1 },
  },
  fort_dearborn: {
    id: 'fort_dearborn',
    name: 'Fort Dearborn',
    theater: 'Great Lakes',
    startingOwner: 'us',
    points: 1,
    hasFort: true,
    adjacency: ['detroit', 'ohio_valley', 'indiana_territory'],
    gridPosition: { col: 0, row: 1 },
  },
  niagara: {
    id: 'niagara',
    name: 'Niagara',
    theater: 'Great Lakes',
    startingOwner: 'british',
    points: 2,
    hasFort: true,
    adjacency: ['lake_erie', 'upper_canada', 'new_york', 'lake_ontario'],
    gridPosition: { col: 3, row: 1 },
  },
  lake_erie: {
    id: 'lake_erie',
    name: 'Lake Erie',
    theater: 'Great Lakes',
    startingOwner: 'neutral',
    points: 2,
    hasFort: false,
    adjacency: ['detroit', 'niagara', 'ohio_valley', 'upper_canada'],
    gridPosition: { col: 2, row: 1 },
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
    gridPosition: { col: 4, row: 1 },
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
    gridPosition: { col: 1, row: 0 },
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
    gridPosition: { col: 3, row: 3 },
  },
  baltimore: {
    id: 'baltimore',
    name: 'Baltimore',
    theater: 'Chesapeake',
    startingOwner: 'us',
    points: 2,
    hasFort: true,
    adjacency: ['washington_dc', 'bladensburg', 'new_york', 'chesapeake_bay'],
    gridPosition: { col: 4, row: 3 },
  },
  bladensburg: {
    id: 'bladensburg',
    name: 'Bladensburg',
    theater: 'Chesapeake',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['washington_dc', 'baltimore', 'virginia', 'chesapeake_bay'],
    gridPosition: { col: 3, row: 4 },
  },
  chesapeake_bay: {
    id: 'chesapeake_bay',
    name: 'Chesapeake Bay',
    theater: 'Chesapeake',
    startingOwner: 'neutral',
    points: 1,
    hasFort: false,
    adjacency: ['baltimore', 'bladensburg', 'virginia', 'atlantic_sea_lanes'],
    gridPosition: { col: 5, row: 3 },
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
    gridPosition: { col: 4, row: 4 },
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
    gridPosition: { col: 1, row: 5 },
  },
  mobile: {
    id: 'mobile',
    name: 'Mobile',
    theater: 'Southern',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['new_orleans', 'creek_nation', 'gulf_of_mexico', 'carolina'],
    gridPosition: { col: 2, row: 5 },
  },
  creek_nation: {
    id: 'creek_nation',
    name: 'Creek Nation',
    theater: 'Southern',
    startingOwner: 'native',
    points: 2,
    hasFort: false,
    adjacency: ['mobile', 'mississippi_territory', 'carolina'],
    gridPosition: { col: 2, row: 4 },
  },
  mississippi_territory: {
    id: 'mississippi_territory',
    name: 'Mississippi Terr.',
    theater: 'Southern',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['new_orleans', 'creek_nation', 'indiana_territory'],
    gridPosition: { col: 1, row: 3 },
  },
  gulf_of_mexico: {
    id: 'gulf_of_mexico',
    name: 'Gulf of Mexico',
    theater: 'Southern',
    startingOwner: 'neutral',
    points: 1,
    hasFort: false,
    adjacency: ['new_orleans', 'mobile', 'atlantic_sea_lanes'],
    gridPosition: { col: 2, row: 6 },
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
    gridPosition: { col: 6, row: 2 },
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
    gridPosition: { col: 6, row: 0 },
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
    gridPosition: { col: 5, row: 2 },
  },
  montreal: {
    id: 'montreal',
    name: 'Montreal',
    theater: 'Great Lakes',
    startingOwner: 'british',
    points: 2,
    hasFort: true,
    adjacency: ['upper_canada', 'lake_ontario', 'new_york', 'halifax'],
    gridPosition: { col: 2, row: 0 },
  },
  ohio_valley: {
    id: 'ohio_valley',
    name: 'Ohio Valley',
    theater: 'Great Lakes',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['detroit', 'fort_dearborn', 'lake_erie', 'indiana_territory', 'virginia'],
    gridPosition: { col: 2, row: 2 },
  },
  indiana_territory: {
    id: 'indiana_territory',
    name: 'Indiana Terr.',
    theater: 'Great Lakes',
    startingOwner: 'native',
    points: 1,
    hasFort: false,
    adjacency: ['fort_dearborn', 'ohio_valley', 'mississippi_territory'],
    gridPosition: { col: 0, row: 2 },
  },
  carolina: {
    id: 'carolina',
    name: 'Carolina',
    theater: 'Southern',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['virginia', 'mobile', 'creek_nation'],
    gridPosition: { col: 4, row: 5 },
  },
};

// Theater configuration for visual grouping on the board
export const theaterConfig = {
  'Great Lakes': { color: 'rgba(37, 99, 235, 0.08)' },
  'Chesapeake': { color: 'rgba(220, 38, 38, 0.08)' },
  'Southern': { color: 'rgba(161, 98, 7, 0.08)' },
  'Maritime': { color: 'rgba(107, 114, 128, 0.08)' },
};

// Board grid dimensions
export const GRID_COLS = 7;
export const GRID_ROWS = 7;

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
