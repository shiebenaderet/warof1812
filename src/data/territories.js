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
      d: 'M805.606,206.94L808.395,260.907L777.369,248.654L734.024,226.894L709.041,227.699L697.227,199.278L713.919,168.049L752.382,138.945L792.962,126.013L843.544,158.133Z',
    },
    centroid: { x: 769.58, y: 188.45 },
    labelPosition: { x: 747.07, y: 197.93 },
    troopPosition: { x: 722.07, y: 232.93 },
    pointsPosition: { x: 782.07, y: 172.93 },
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
      d: 'M792.962,126.013L752.382,138.945L713.919,168.049L697.227,199.278L672.88,180.448L619.277,127.263L652.16,104.035L701.415,69.243L758.696,46L791.899,91.408Z',
    },
    centroid: { x: 712.67, y: 117.57 },
    labelPosition: { x: 710.40, y: 116.16 },
    troopPosition: { x: 685.40, y: 151.16 },
    pointsPosition: { x: 745.40, y: 91.16 },
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
      d: 'M879.981,294.817L858.914,313.452L840.228,310.474L814.995,293.606L817.775,272.052L826.981,264.262L845.538,267.468Z',
    },
    centroid: { x: 843.90, y: 289.43 },
    labelPosition: { x: 839.76, y: 291.56 },
    troopPosition: { x: 814.76, y: 326.56 },
    pointsPosition: { x: 874.76, y: 266.56 },
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
      d: 'M808.395,260.907L826.981,264.262L817.775,272.052L814.995,293.606L796.283,290.243L768.085,275.364L746.226,274.148L708.769,246.886L709.041,227.699L734.024,226.894L777.369,248.654Z',
    },
    centroid: { x: 764.06, y: 258.92 },
    labelPosition: { x: 765.55, y: 265.96 },
    troopPosition: { x: 740.55, y: 300.96 },
    pointsPosition: { x: 800.55, y: 240.96 },
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
      d: 'M914.057,302.81L977.171,341.268L962.67,355.118L912.692,342.969L884.27,329.745L858.914,313.452L879.981,294.817Z',
    },
    centroid: { x: 916.52, y: 325.12 },
    labelPosition: { x: 908.85, y: 326.92 },
    troopPosition: { x: 883.85, y: 361.92 },
    pointsPosition: { x: 943.85, y: 301.92 },
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
      d: 'M955.699,137.61L1026.903,218.997L1011.047,289.767L962.769,296.684L914.057,302.81L879.981,294.817L845.538,267.468L826.981,264.262L808.395,260.907L805.606,206.94L843.544,158.133L888.118,53.19Z',
    },
    centroid: { x: 913.68, y: 205.69 },
    labelPosition: { x: 921.65, y: 220.70 },
    troopPosition: { x: 896.65, y: 255.70 },
    pointsPosition: { x: 956.65, y: 195.70 },
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
      d: 'M773.771,429.661L775.149,449.152L749.853,451.288L724.472,453.204L707.913,434.525L718.966,416.563L744.294,414.841L794.696,410.74Z',
    },
    centroid: { x: 747.11, y: 431.77 },
    labelPosition: { x: 745.50, y: 434.40 },
    troopPosition: { x: 720.50, y: 469.40 },
    pointsPosition: { x: 780.50, y: 409.40 },
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
      d: 'M840.197,430.47L846.301,466.267L815.351,474.649L785.558,460.476L775.149,449.152L773.771,429.661L794.696,410.74L819.765,408.364Z',
    },
    centroid: { x: 810.46, y: 441.71 },
    labelPosition: { x: 806.28, y: 441.33 },
    troopPosition: { x: 781.28, y: 476.33 },
    pointsPosition: { x: 841.28, y: 416.33 },
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
      d: 'M775.149,449.152L785.558,460.476L781.304,485.503L755.958,487.835L730.528,489.945L734.905,464.805L749.853,451.288Z',
    },
    centroid: { x: 758.91, y: 470.33 },
    labelPosition: { x: 758.52, y: 472.77 },
    troopPosition: { x: 733.52, y: 507.77 },
    pointsPosition: { x: 793.52, y: 447.77 },
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
      d: 'M755.958,487.835L781.304,485.503L785.558,460.476L815.351,474.649L846.301,466.267L852.945,502.156L824.103,530.313L758.867,549.778L722.42,540.528L726.365,515.187L730.528,489.945Z',
    },
    centroid: { x: 786.96, y: 507.84 },
    labelPosition: { x: 783.70, y: 517.43 },
    troopPosition: { x: 758.70, y: 552.43 },
    pointsPosition: { x: 818.70, y: 492.43 },
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
      d: 'M718.966,416.563L707.913,434.525L724.472,453.204L730.528,489.945L726.365,515.187L722.42,540.528L685.931,530.715L643.156,482.887L616.877,421.212L647.771,395.353Z',
    },
    centroid: { x: 680.13, y: 462.88 },
    labelPosition: { x: 673.47, y: 456.37 },
    troopPosition: { x: 648.47, y: 491.37 },
    pointsPosition: { x: 708.47, y: 431.37 },
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
      d: 'M242.316,288.638L264.563,356.705L221.899,365.193L225.634,405.319L179.144,373.215L133.027,340.069L130.33,299.506L154.4,263.272L214.162,245.619Z',
    },
    centroid: { x: 195.17, y: 318.43 },
    labelPosition: { x: 192.49, y: 321.83 },
    troopPosition: { x: 167.49, y: 356.83 },
    pointsPosition: { x: 227.49, y: 296.83 },
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
      d: 'M325.184,440.566L377.777,508.902L324.973,506.155L277.303,476.387L225.634,405.319L221.899,365.193L264.563,356.705Z',
    },
    centroid: { x: 288.19, y: 435.61 },
    labelPosition: { x: 292.43, y: 443.34 },
    troopPosition: { x: 267.43, y: 478.34 },
    pointsPosition: { x: 327.43, y: 418.34 },
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
      d: 'M549.837,434.915L503.19,473.101L472.146,498.514L504.408,537.273L441.154,523.884L377.777,508.902L325.184,440.566L353.098,377.424L401.655,341.918L453.557,344.528L489.282,358.418Z',
    },
    centroid: { x: 432.52, y: 432.60 },
    labelPosition: { x: 419.80, y: 432.76 },
    troopPosition: { x: 394.80, y: 467.76 },
    pointsPosition: { x: 454.80, y: 407.76 },
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
      d: 'M453.557,344.528L401.655,341.918L353.098,377.424L325.184,440.566L264.563,356.705L242.316,288.638L273.804,227.265L341.111,183.479L396.014,264.924Z',
    },
    centroid: { x: 331.08, y: 303.90 },
    labelPosition: { x: 320.59, y: 297.08 },
    troopPosition: { x: 295.59, y: 332.08 },
    pointsPosition: { x: 355.59, y: 272.08 },
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
      d: 'M225.634,405.319L277.303,476.387L293.504,530.511L273.111,568.929L219.77,564.673L139.075,488.772L103.492,402.889L133.027,340.069L179.144,373.215Z',
    },
    centroid: { x: 197.75, y: 463.26 },
    labelPosition: { x: 191.37, y: 473.46 },
    troopPosition: { x: 166.37, y: 508.46 },
    pointsPosition: { x: 226.37, y: 448.46 },
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
      d: 'M1111.933,552.976L1181.802,559.668L1247.646,638.015L1246.05,737.42L1100.387,829.564L898.864,874L744.948,845.446L689.195,708.692L652.467,583.49L685.931,530.715L722.42,540.528L758.867,549.778L824.103,530.313L852.945,502.156L917.183,481.204L959.92,438.561L1092.755,509.226Z',
    },
    centroid: { x: 947.76, y: 672.35 },
    labelPosition: { x: 880.78, y: 697.52 },
    troopPosition: { x: 855.78, y: 732.52 },
    pointsPosition: { x: 915.78, y: 672.52 },
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
      d: 'M1101.594,297.197L1226.175,360.702L1269.01,476.099L1296.508,574.458L1181.802,559.668L1111.933,552.976L1092.755,509.226L1085.023,475.09L1002.577,395.997L1055.002,363.399L1112.627,363.799Z',
    },
    centroid: { x: 1162.04, y: 448.84 },
    labelPosition: { x: 1201.29, y: 471.27 },
    troopPosition: { x: 1176.29, y: 506.27 },
    pointsPosition: { x: 1236.29, y: 446.27 },
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
      d: 'M962.67,355.118L977.171,341.268L986.989,351.49L1002.577,395.997L959.92,438.561L917.183,481.204L846.301,466.267L840.197,430.47L849.49,381.189L869.36,343.227L884.27,329.745L912.692,342.969Z',
    },
    centroid: { x: 913.07, y: 404.86 },
    labelPosition: { x: 913.28, y: 402.30 },
    troopPosition: { x: 888.28, y: 437.30 },
    pointsPosition: { x: 948.28, y: 377.30 },
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
      d: 'M1026.903,218.997L1101.594,297.197L1112.627,363.799L1055.002,363.399L1011.196,347.664L986.989,351.49L977.171,341.268L962.769,296.684L1011.047,289.767Z',
    },
    centroid: { x: 1043.29, y: 309.76 },
    labelPosition: { x: 1038.79, y: 301.47 },
    troopPosition: { x: 1013.79, y: 336.47 },
    pointsPosition: { x: 1073.79, y: 276.47 },
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
      d: 'M796.283,290.243L814.995,293.606L840.228,310.474L869.36,343.227L849.49,381.189L819.765,408.364L840.197,430.47L794.696,410.74L744.294,414.841L718.966,416.563L647.771,395.353L616.877,421.212L586.501,384.312L623.694,334.131L645.58,296.907L686.624,283.753L736.877,281.801L768.085,275.364Z',
    },
    centroid: { x: 732.43, y: 351.45 },
    labelPosition: { x: 729.32, y: 366.93 },
    troopPosition: { x: 704.32, y: 401.93 },
    pointsPosition: { x: 764.32, y: 341.93 },
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
      d: 'M672.88,180.448L697.227,199.278L709.041,227.699L708.769,246.886L686.624,283.753L645.58,296.907L623.694,334.131L586.501,384.312L556.734,346.919L521.241,333.959L489.282,358.418L453.557,344.528L396.014,264.924L341.111,183.479L459.241,106.63L528.087,172.71L569.912,162.132L619.277,127.263Z',
    },
    centroid: { x: 530.46, y: 237.79 },
    labelPosition: { x: 522.34, y: 234.21 },
    troopPosition: { x: 497.34, y: 269.21 },
    pointsPosition: { x: 557.34, y: 209.21 },
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
      d: 'M643.156,482.887L685.931,530.715L652.467,583.49L563.423,574.833L504.408,537.273L472.146,498.514L503.19,473.101L549.837,434.915Z',
    },
    centroid: { x: 581.43, y: 515.39 },
    labelPosition: { x: 586.99, y: 510.28 },
    troopPosition: { x: 561.99, y: 545.28 },
    pointsPosition: { x: 621.99, y: 485.28 },
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
