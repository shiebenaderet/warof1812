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
      d: 'M 230,220 L 400,210 L 420,320 L 350,360 L 230,350 Z',
    },
    centroid: { x: 325, y: 290 },
    labelPosition: { x: 325, y: 270 },
    troopPosition: { x: 290, y: 330 },
    pointsPosition: { x: 380, y: 235 },
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
      d: 'M 80,220 L 220,215 L 220,350 L 140,370 L 70,310 Z',
    },
    centroid: { x: 146, y: 290 },
    labelPosition: { x: 146, y: 270 },
    troopPosition: { x: 115, y: 330 },
    pointsPosition: { x: 195, y: 240 },
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
      d: 'M 730,220 L 880,210 L 900,330 L 820,350 L 730,330 Z',
    },
    centroid: { x: 812, y: 282 },
    labelPosition: { x: 812, y: 265 },
    troopPosition: { x: 775, y: 320 },
    pointsPosition: { x: 860, y: 235 },
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
      d: 'M 430,220 L 560,215 L 575,310 L 480,330 L 430,300 Z',
    },
    centroid: { x: 495, y: 275 },
    labelPosition: { x: 495, y: 265 },
    troopPosition: { x: 460, y: 310 },
    pointsPosition: { x: 545, y: 235 },
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
      d: 'M 655,210 L 810,205 L 825,300 L 730,315 L 660,295 Z',
    },
    centroid: { x: 737, y: 265 },
    labelPosition: { x: 737, y: 252 },
    troopPosition: { x: 700, y: 295 },
    pointsPosition: { x: 790, y: 225 },
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
      d: 'M 350,50 L 800,40 L 820,180 L 650,200 L 400,200 L 340,140 Z',
    },
    centroid: { x: 575, y: 130 },
    labelPosition: { x: 575, y: 110 },
    troopPosition: { x: 520, y: 170 },
    pointsPosition: { x: 750, y: 70 },
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
      d: 'M 830,400 L 950,390 L 970,490 L 880,520 L 820,475 Z',
    },
    centroid: { x: 890, y: 455 },
    labelPosition: { x: 890, y: 435 },
    troopPosition: { x: 855, y: 495 },
    pointsPosition: { x: 945, y: 410 },
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
      d: 'M 960,360 L 1100,350 L 1120,460 L 1020,480 L 960,450 Z',
    },
    centroid: { x: 1032, y: 420 },
    labelPosition: { x: 1032, y: 400 },
    troopPosition: { x: 995, y: 460 },
    pointsPosition: { x: 1085, y: 370 },
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
      d: 'M 980,495 L 1070,485 L 1090,550 L 1020,570 L 975,540 Z',
    },
    centroid: { x: 1027, y: 528 },
    labelPosition: { x: 1027, y: 512 },
    troopPosition: { x: 995, y: 555 },
    pointsPosition: { x: 1075, y: 500 },
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
      d: 'M 1130,400 L 1250,390 L 1270,510 L 1160,530 L 1125,475 Z',
    },
    centroid: { x: 1187, y: 462 },
    labelPosition: { x: 1187, y: 445 },
    troopPosition: { x: 1150, y: 500 },
    pointsPosition: { x: 1240, y: 410 },
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
      d: 'M 630,430 L 820,420 L 850,550 L 710,580 L 620,525 Z',
    },
    centroid: { x: 726, y: 500 },
    labelPosition: { x: 726, y: 480 },
    troopPosition: { x: 685, y: 545 },
    pointsPosition: { x: 805, y: 440 },
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
      d: 'M 80,630 L 240,620 L 260,740 L 150,780 L 60,730 Z',
    },
    centroid: { x: 158, y: 698 },
    labelPosition: { x: 158, y: 680 },
    troopPosition: { x: 125, y: 745 },
    pointsPosition: { x: 230, y: 640 },
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
      d: 'M 270,630 L 400,620 L 420,730 L 330,760 L 270,710 Z',
    },
    centroid: { x: 338, y: 692 },
    labelPosition: { x: 338, y: 675 },
    troopPosition: { x: 305, y: 735 },
    pointsPosition: { x: 390, y: 640 },
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
      d: 'M 430,600 L 610,590 L 635,720 L 510,750 L 430,690 Z',
    },
    centroid: { x: 523, y: 670 },
    labelPosition: { x: 523, y: 650 },
    troopPosition: { x: 485, y: 715 },
    pointsPosition: { x: 600, y: 610 },
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
      d: 'M 180,550 L 340,540 L 360,630 L 250,660 L 170,620 Z',
    },
    centroid: { x: 262, y: 600 },
    labelPosition: { x: 262, y: 583 },
    troopPosition: { x: 230, y: 640 },
    pointsPosition: { x: 330, y: 558 },
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
      d: 'M 50,790 L 430,775 L 460,860 L 120,875 L 30,840 Z',
    },
    centroid: { x: 218, y: 828 },
    labelPosition: { x: 218, y: 815 },
    troopPosition: { x: 180, y: 855 },
    pointsPosition: { x: 400, y: 795 },
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
      d: 'M 1280,360 L 1380,350 L 1395,750 L 1315,765 L 1275,580 Z',
    },
    centroid: { x: 1329, y: 555 },
    labelPosition: { x: 1329, y: 535 },
    troopPosition: { x: 1295, y: 605 },
    pointsPosition: { x: 1365, y: 385 },
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
      d: 'M 1150,50 L 1340,40 L 1360,200 L 1240,220 L 1140,180 Z',
    },
    centroid: { x: 1245, y: 140 },
    labelPosition: { x: 1245, y: 120 },
    troopPosition: { x: 1200, y: 180 },
    pointsPosition: { x: 1310, y: 75 },
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
      d: 'M 910,220 L 1130,210 L 1150,330 L 1020,350 L 910,335 Z',
    },
    centroid: { x: 1024, y: 282 },
    labelPosition: { x: 1024, y: 265 },
    troopPosition: { x: 980, y: 320 },
    pointsPosition: { x: 1095, y: 235 },
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
      d: 'M 850,50 L 1100,40 L 1120,180 L 1000,200 L 850,190 L 825,120 Z',
    },
    centroid: { x: 965, y: 130 },
    labelPosition: { x: 965, y: 110 },
    troopPosition: { x: 920, y: 170 },
    pointsPosition: { x: 1060, y: 70 },
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
      d: 'M 270,380 L 540,370 L 570,500 L 430,520 L 260,505 Z',
    },
    centroid: { x: 414, y: 455 },
    labelPosition: { x: 414, y: 435 },
    troopPosition: { x: 370, y: 490 },
    pointsPosition: { x: 520, y: 390 },
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
      d: 'M 80,390 L 250,380 L 260,510 L 170,540 L 70,490 Z',
    },
    centroid: { x: 164, y: 460 },
    labelPosition: { x: 164, y: 440 },
    troopPosition: { x: 130, y: 500 },
    pointsPosition: { x: 230, y: 400 },
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
      d: 'M 860,590 L 1060,580 L 1090,710 L 940,740 L 860,685 Z',
    },
    centroid: { x: 962, y: 660 },
    labelPosition: { x: 962, y: 640 },
    troopPosition: { x: 925, y: 705 },
    pointsPosition: { x: 1045, y: 600 },
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
