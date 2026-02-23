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
      d: 'M 80,200 L 230,200 L 250,310 L 180,340 L 80,330 Z',
    },
    centroid: { x: 168, y: 270 },
    labelPosition: { x: 168, y: 250 },
    troopPosition: { x: 135, y: 310 },
    pointsPosition: { x: 215, y: 220 },
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
      d: 'M 80,360 L 230,360 L 250,470 L 180,500 L 80,490 Z',
    },
    centroid: { x: 164, y: 430 },
    labelPosition: { x: 164, y: 410 },
    troopPosition: { x: 130, y: 470 },
    pointsPosition: { x: 215, y: 380 },
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
      d: 'M 280,200 L 430,200 L 450,310 L 380,340 L 280,330 Z',
    },
    centroid: { x: 368, y: 270 },
    labelPosition: { x: 368, y: 250 },
    troopPosition: { x: 335, y: 310 },
    pointsPosition: { x: 415, y: 220 },
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
      d: 'M 280,360 L 430,360 L 450,470 L 380,500 L 280,490 Z',
    },
    centroid: { x: 368, y: 430 },
    labelPosition: { x: 368, y: 410 },
    troopPosition: { x: 335, y: 470 },
    pointsPosition: { x: 415, y: 380 },
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
      d: 'M 480,200 L 630,200 L 650,310 L 580,340 L 480,330 Z',
    },
    centroid: { x: 568, y: 270 },
    labelPosition: { x: 568, y: 250 },
    troopPosition: { x: 535, y: 310 },
    pointsPosition: { x: 615, y: 220 },
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
      d: 'M 50,30 L 450,30 L 470,150 L 300,170 L 80,160 L 50,90 Z',
    },
    centroid: { x: 260, y: 100 },
    labelPosition: { x: 260, y: 85 },
    troopPosition: { x: 220, y: 135 },
    pointsPosition: { x: 400, y: 55 },
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
      d: 'M 680,360 L 830,360 L 850,470 L 780,500 L 680,490 Z',
    },
    centroid: { x: 768, y: 430 },
    labelPosition: { x: 768, y: 410 },
    troopPosition: { x: 735, y: 470 },
    pointsPosition: { x: 815, y: 380 },
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
      d: 'M 880,200 L 1030,200 L 1050,310 L 980,340 L 880,330 Z',
    },
    centroid: { x: 968, y: 270 },
    labelPosition: { x: 968, y: 250 },
    troopPosition: { x: 935, y: 310 },
    pointsPosition: { x: 1015, y: 220 },
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
      d: 'M 880,360 L 1030,360 L 1050,470 L 980,500 L 880,490 Z',
    },
    centroid: { x: 968, y: 430 },
    labelPosition: { x: 968, y: 410 },
    troopPosition: { x: 935, y: 470 },
    pointsPosition: { x: 1015, y: 380 },
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
      d: 'M 1080,200 L 1230,200 L 1250,470 L 1180,500 L 1080,490 Z',
    },
    centroid: { x: 1168, y: 350 },
    labelPosition: { x: 1168, y: 330 },
    troopPosition: { x: 1135, y: 465 },
    pointsPosition: { x: 1215, y: 220 },
  },
  virginia: {
    id: 'virginia',
    name: 'Virginia',
    theater: 'Chesapeake',
    startingOwner: 'us',
    points: 1,
    hasFort: false,
    adjacency: ['washington_dc', 'bladensburg', 'chesapeake_bay', 'carolina', 'ohio_valley'],
    hexCells: [{ col: 8, row: 2 }, { col: 8, row: 3 }, { col: 9, row: 3 }],
    primaryCell: 0,
    polygon: {
      d: 'M 680,520 L 830,520 L 850,630 L 780,660 L 680,650 Z',
    },
    centroid: { x: 768, y: 590 },
    labelPosition: { x: 768, y: 570 },
    troopPosition: { x: 735, y: 630 },
    pointsPosition: { x: 815, y: 540 },
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
      d: 'M 80,680 L 230,680 L 250,790 L 180,820 L 80,810 Z',
    },
    centroid: { x: 168, y: 750 },
    labelPosition: { x: 168, y: 730 },
    troopPosition: { x: 135, y: 790 },
    pointsPosition: { x: 215, y: 700 },
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
      d: 'M 280,680 L 430,680 L 450,790 L 380,820 L 280,810 Z',
    },
    centroid: { x: 368, y: 750 },
    labelPosition: { x: 368, y: 730 },
    troopPosition: { x: 335, y: 790 },
    pointsPosition: { x: 415, y: 700 },
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
      d: 'M 480,680 L 630,680 L 650,790 L 580,820 L 480,810 Z',
    },
    centroid: { x: 568, y: 750 },
    labelPosition: { x: 568, y: 730 },
    troopPosition: { x: 535, y: 790 },
    pointsPosition: { x: 615, y: 700 },
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
      d: 'M 80,520 L 230,520 L 250,630 L 180,660 L 80,650 Z',
    },
    centroid: { x: 168, y: 590 },
    labelPosition: { x: 168, y: 570 },
    troopPosition: { x: 135, y: 630 },
    pointsPosition: { x: 215, y: 540 },
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
      d: 'M 80,840 L 430,840 L 450,870 L 180,870 L 80,865 Z',
    },
    centroid: { x: 244, y: 857 },
    labelPosition: { x: 244, y: 850 },
    troopPosition: { x: 210, y: 868 },
    pointsPosition: { x: 400, y: 848 },
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
      d: 'M 1280,200 L 1360,200 L 1380,870 L 1320,870 L 1280,520 Z',
    },
    centroid: { x: 1324, y: 535 },
    labelPosition: { x: 1324, y: 515 },
    troopPosition: { x: 1295, y: 580 },
    pointsPosition: { x: 1350, y: 230 },
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
      d: 'M 800,30 L 1050,30 L 1070,180 L 950,200 L 800,190 L 780,90 Z',
    },
    centroid: { x: 925, y: 115 },
    labelPosition: { x: 925, y: 95 },
    troopPosition: { x: 880, y: 155 },
    pointsPosition: { x: 1010, y: 60 },
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
      d: 'M 680,200 L 830,200 L 850,310 L 780,340 L 680,330 Z',
    },
    centroid: { x: 768, y: 270 },
    labelPosition: { x: 768, y: 250 },
    troopPosition: { x: 735, y: 310 },
    pointsPosition: { x: 815, y: 220 },
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
      d: 'M 500,30 L 750,30 L 770,150 L 650,170 L 500,160 L 480,90 Z',
    },
    centroid: { x: 625, y: 100 },
    labelPosition: { x: 625, y: 85 },
    troopPosition: { x: 585, y: 135 },
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
      d: 'M 480,360 L 630,360 L 650,470 L 580,500 L 480,490 Z',
    },
    centroid: { x: 568, y: 430 },
    labelPosition: { x: 568, y: 410 },
    troopPosition: { x: 535, y: 470 },
    pointsPosition: { x: 615, y: 380 },
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
      d: 'M 280,520 L 430,520 L 450,630 L 380,660 L 280,650 Z',
    },
    centroid: { x: 368, y: 590 },
    labelPosition: { x: 368, y: 570 },
    troopPosition: { x: 335, y: 630 },
    pointsPosition: { x: 415, y: 540 },
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
      d: 'M 880,520 L 1030,520 L 1050,790 L 980,820 L 880,810 Z',
    },
    centroid: { x: 968, y: 670 },
    labelPosition: { x: 968, y: 650 },
    troopPosition: { x: 935, y: 790 },
    pointsPosition: { x: 1015, y: 540 },
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
