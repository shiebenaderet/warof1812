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
export const HEX_GRID_COLS = 15;
export const HEX_GRID_ROWS = 6;

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
    polygon: {
      d: 'M 180,180 L 280,160 L 300,220 L 260,260 L 180,250 Z',
    },
    centroid: { x: 240, y: 218 },
    labelPosition: { x: 240, y: 210 },
    troopPosition: { x: 220, y: 240 },
    pointsPosition: { x: 275, y: 175 },
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
    polygon: {
      d: 'M 80,180 L 175,175 L 175,245 L 100,260 L 60,220 Z',
    },
    centroid: { x: 127, y: 216 },
    labelPosition: { x: 127, y: 210 },
    troopPosition: { x: 110, y: 240 },
    pointsPosition: { x: 160, y: 185 },
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
    polygon: {
      d: 'M 420,140 L 520,130 L 540,200 L 480,220 L 420,200 Z',
    },
    centroid: { x: 476, y: 178 },
    labelPosition: { x: 476, y: 175 },
    troopPosition: { x: 450, y: 205 },
    pointsPosition: { x: 510, y: 145 },
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
    polygon: {
      d: 'M 305,180 L 415,165 L 415,195 L 350,220 L 305,210 Z',
    },
    centroid: { x: 360, y: 192 },
    labelPosition: { x: 360, y: 192 },
    troopPosition: { x: 335, y: 210 },
    pointsPosition: { x: 400, y: 175 },
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
    polygon: {
      d: 'M 545,140 L 630,130 L 650,180 L 600,200 L 545,185 Z',
    },
    centroid: { x: 594, y: 167 },
    labelPosition: { x: 594, y: 167 },
    troopPosition: { x: 570, y: 190 },
    pointsPosition: { x: 630, y: 145 },
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
    polygon: {
      d: 'M 250,40 L 540,30 L 560,120 L 420,135 L 300,140 L 240,100 Z',
    },
    centroid: { x: 385, y: 94 },
    labelPosition: { x: 385, y: 85 },
    troopPosition: { x: 350, y: 115 },
    pointsPosition: { x: 520, y: 55 },
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
    hexCells: [{ col: 9, row: 2 }],
    primaryCell: 0,
    polygon: {
      d: 'M 580,290 L 640,280 L 660,330 L 620,360 L 570,340 Z',
    },
    centroid: { x: 614, y: 320 },
    labelPosition: { x: 614, y: 315 },
    troopPosition: { x: 590, y: 345 },
    pointsPosition: { x: 645, y: 295 },
  },
  baltimore: {
    id: 'baltimore',
    name: 'Baltimore',
    theater: 'Chesapeake',
    startingOwner: 'us',
    points: 2,
    hasFort: true,
    adjacency: ['washington_dc', 'bladensburg', 'new_york', 'chesapeake_bay'],
    hexCells: [{ col: 10, row: 2 }],
    primaryCell: 0,
    polygon: {
      d: 'M 640,230 L 710,220 L 730,280 L 685,300 L 645,285 Z',
    },
    centroid: { x: 682, y: 263 },
    labelPosition: { x: 682, y: 258 },
    troopPosition: { x: 660, y: 288 },
    pointsPosition: { x: 715, y: 235 },
  },
  bladensburg: {
    id: 'bladensburg',
    name: 'Bladensburg',
    theater: 'Chesapeake',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['washington_dc', 'baltimore', 'virginia', 'chesapeake_bay'],
    hexCells: [{ col: 11, row: 2 }],
    primaryCell: 0,
    polygon: {
      d: 'M 665,330 L 730,310 L 750,360 L 710,380 L 665,365 Z',
    },
    centroid: { x: 704, y: 347 },
    labelPosition: { x: 704, y: 342 },
    troopPosition: { x: 680, y: 368 },
    pointsPosition: { x: 740, y: 325 },
  },
  chesapeake_bay: {
    id: 'chesapeake_bay',
    name: 'Chesapeake Bay',
    theater: 'Chesapeake',
    startingOwner: 'neutral',
    points: 1,
    hasFort: false,
    adjacency: ['baltimore', 'bladensburg', 'virginia', 'atlantic_sea_lanes'],
    hexCells: [{ col: 12, row: 2 }],
    primaryCell: 0,
    isNaval: true,
    polygon: {
      d: 'M 755,290 L 825,280 L 840,340 L 790,360 L 750,335 Z',
    },
    centroid: { x: 792, y: 321 },
    labelPosition: { x: 792, y: 318 },
    troopPosition: { x: 770, y: 345 },
    pointsPosition: { x: 820, y: 295 },
  },
  virginia: {
    id: 'virginia',
    name: 'Virginia',
    theater: 'Chesapeake',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['washington_dc', 'bladensburg', 'chesapeake_bay', 'carolina'],
    hexCells: [{ col: 8, row: 2 }, { col: 8, row: 3 }, { col: 9, row: 3 }],
    primaryCell: 0,
    polygon: {
      d: 'M 480,330 L 575,320 L 615,385 L 540,410 L 470,380 Z',
    },
    centroid: { x: 536, y: 365 },
    labelPosition: { x: 536, y: 360 },
    troopPosition: { x: 510, y: 390 },
    pointsPosition: { x: 575, y: 335 },
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
    hexCells: [{ col: 1, row: 4 }, { col: 2, row: 4 }],
    primaryCell: 0,
    polygon: {
      d: 'M 40,460 L 140,450 L 160,510 L 80,540 L 30,510 Z',
    },
    centroid: { x: 90, y: 492 },
    labelPosition: { x: 90, y: 485 },
    troopPosition: { x: 70, y: 520 },
    pointsPosition: { x: 140, y: 465 },
  },
  mobile: {
    id: 'mobile',
    name: 'Mobile',
    theater: 'Southern',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['new_orleans', 'creek_nation', 'gulf_of_mexico', 'carolina'],
    hexCells: [{ col: 3, row: 4 }],
    primaryCell: 0,
    polygon: {
      d: 'M 165,460 L 245,450 L 260,510 L 200,530 L 165,505 Z',
    },
    centroid: { x: 207, y: 488 },
    labelPosition: { x: 207, y: 483 },
    troopPosition: { x: 185, y: 515 },
    pointsPosition: { x: 245, y: 465 },
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
    hexCells: [{ col: 4, row: 3 }, { col: 5, row: 3 }, { col: 4, row: 4 }],
    primaryCell: 0,
    polygon: {
      d: 'M 265,420 L 375,410 L 390,490 L 310,510 L 265,475 Z',
    },
    centroid: { x: 321, y: 461 },
    labelPosition: { x: 321, y: 455 },
    troopPosition: { x: 295, y: 490 },
    pointsPosition: { x: 365, y: 425 },
  },
  mississippi_territory: {
    id: 'mississippi_territory',
    name: 'Mississippi Terr.',
    theater: 'Southern',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['new_orleans', 'creek_nation', 'indiana_territory'],
    hexCells: [{ col: 2, row: 3 }, { col: 3, row: 3 }],
    primaryCell: 0,
    polygon: {
      d: 'M 100,360 L 210,350 L 240,410 L 170,430 L 90,410 Z',
    },
    centroid: { x: 164, y: 390 },
    labelPosition: { x: 164, y: 383 },
    troopPosition: { x: 135, y: 415 },
    pointsPosition: { x: 215, y: 365 },
  },
  gulf_of_mexico: {
    id: 'gulf_of_mexico',
    name: 'Gulf of Mexico',
    theater: 'Southern',
    startingOwner: 'neutral',
    points: 1,
    hasFort: false,
    adjacency: ['new_orleans', 'mobile', 'atlantic_sea_lanes'],
    hexCells: [{ col: 1, row: 5 }, { col: 2, row: 5 }, { col: 3, row: 5 }],
    primaryCell: 1,
    isNaval: true,
    polygon: {
      d: 'M 20,545 L 270,535 L 300,580 L 60,590 L 10,575 Z',
    },
    centroid: { x: 132, y: 563 },
    labelPosition: { x: 132, y: 560 },
    troopPosition: { x: 100, y: 575 },
    pointsPosition: { x: 250, y: 548 },
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
    hexCells: [{ col: 14, row: 2 }, { col: 14, row: 3 }],
    primaryCell: 0,
    isNaval: true,
    polygon: {
      d: 'M 845,250 L 960,240 L 980,450 L 920,460 L 845,370 Z',
    },
    centroid: { x: 910, y: 355 },
    labelPosition: { x: 910, y: 348 },
    troopPosition: { x: 880, y: 380 },
    pointsPosition: { x: 950, y: 265 },
  },
  halifax: {
    id: 'halifax',
    name: 'Halifax',
    theater: 'Maritime',
    startingOwner: 'british',
    points: 2,
    hasFort: true,
    adjacency: ['atlantic_sea_lanes', 'montreal', 'new_york'],
    hexCells: [{ col: 13, row: 0 }, { col: 13, row: 1 }],
    primaryCell: 0,
    polygon: {
      d: 'M 800,40 L 920,30 L 950,140 L 880,160 L 800,120 Z',
    },
    centroid: { x: 870, y: 98 },
    labelPosition: { x: 870, y: 92 },
    troopPosition: { x: 845, y: 125 },
    pointsPosition: { x: 920, y: 60 },
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
    hexCells: [{ col: 9, row: 1 }, { col: 10, row: 1 }],
    primaryCell: 0,
    polygon: {
      d: 'M 655,160 L 795,150 L 820,220 L 735,240 L 655,215 Z',
    },
    centroid: { x: 732, y: 197 },
    labelPosition: { x: 732, y: 192 },
    troopPosition: { x: 705, y: 225 },
    pointsPosition: { x: 790, y: 170 },
  },
  montreal: {
    id: 'montreal',
    name: 'Montreal',
    theater: 'Great Lakes',
    startingOwner: 'british',
    points: 2,
    hasFort: true,
    adjacency: ['upper_canada', 'lake_ontario', 'new_york', 'halifax'],
    hexCells: [{ col: 7, row: 0 }, { col: 8, row: 0 }],
    primaryCell: 0,
    polygon: {
      d: 'M 565,40 L 720,30 L 750,110 L 670,125 L 565,110 Z',
    },
    centroid: { x: 654, y: 81 },
    labelPosition: { x: 654, y: 75 },
    troopPosition: { x: 625, y: 105 },
    pointsPosition: { x: 720, y: 55 },
  },
  ohio_valley: {
    id: 'ohio_valley',
    name: 'Ohio Valley',
    theater: 'Great Lakes',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['detroit', 'fort_dearborn', 'lake_erie', 'indiana_territory', 'virginia'],
    hexCells: [{ col: 4, row: 2 }, { col: 5, row: 2 }, { col: 6, row: 2 }],
    primaryCell: 1,
    polygon: {
      d: 'M 265,260 L 395,250 L 425,310 L 340,330 L 250,315 Z',
    },
    centroid: { x: 335, y: 293 },
    labelPosition: { x: 335, y: 287 },
    troopPosition: { x: 310, y: 315 },
    pointsPosition: { x: 395, y: 265 },
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
    hexCells: [{ col: 2, row: 2 }, { col: 3, row: 2 }],
    primaryCell: 0,
    polygon: {
      d: 'M 85,270 L 180,260 L 210,310 L 130,335 L 75,315 Z',
    },
    centroid: { x: 138, y: 298 },
    labelPosition: { x: 138, y: 292 },
    troopPosition: { x: 115, y: 320 },
    pointsPosition: { x: 185, y: 275 },
  },
  carolina: {
    id: 'carolina',
    name: 'Carolina',
    theater: 'Southern',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['virginia', 'mobile', 'creek_nation'],
    hexCells: [{ col: 6, row: 3 }, { col: 7, row: 3 }, { col: 10, row: 3 }],
    primaryCell: 0,
    polygon: {
      d: 'M 395,415 L 540,405 L 560,470 L 460,490 L 395,465 Z',
    },
    centroid: { x: 470, y: 449 },
    labelPosition: { x: 470, y: 443 },
    troopPosition: { x: 445, y: 475 },
    pointsPosition: { x: 535, y: 420 },
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
  // Great Lakes water (Lake Huron, northwest)
  { col: 1, row: 0, type: 'water', label: 'Lake' },
  { col: 2, row: 0, type: 'water', label: 'Huron' },
  { col: 0, row: 1, type: 'water', label: '' },
  // Atlantic Ocean (eastern edge)
  { col: 14, row: 0, type: 'water', label: 'Atlantic' },
  { col: 14, row: 1, type: 'water', label: '' },
  { col: 13, row: 2, type: 'water', label: 'Ocean' },
  { col: 14, row: 4, type: 'water', label: '' },
  { col: 14, row: 5, type: 'water', label: '' },
  // Gulf of Mexico (southern coast)
  { col: 0, row: 5, type: 'water', label: '' },
  { col: 4, row: 5, type: 'water', label: '' },
  { col: 5, row: 4, type: 'water', label: '' },
  { col: 5, row: 5, type: 'water', label: '' },
  // Appalachian Mountains (central-east)
  { col: 7, row: 2, type: 'mountain', label: 'Appalachian' },
  { col: 7, row: 1, type: 'mountain', label: '' },
  // Forest / wilderness (western frontier)
  { col: 0, row: 2, type: 'forest', label: '' },
  { col: 1, row: 2, type: 'forest', label: '' },
  { col: 0, row: 3, type: 'forest', label: '' },
  { col: 1, row: 3, type: 'forest', label: '' },
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
