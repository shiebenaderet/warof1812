import React from 'react';
import territories from '../data/territories';

/**
 * SVG territory paths on a 1120x750 viewport.
 * Territories are well-spaced with generous sizes for readability.
 */
const territoryPaths = {
  // ── Great Lakes Theater ──
  detroit: 'M 370,185 L 420,160 L 475,175 L 482,215 L 460,245 L 410,238 L 370,218 Z',
  fort_dearborn: 'M 265,215 L 325,195 L 380,212 L 380,252 L 350,280 L 298,272 L 265,250 Z',
  niagara: 'M 540,170 L 595,148 L 640,168 L 645,210 L 618,235 L 572,228 L 540,205 Z',
  lake_erie: 'M 430,155 L 530,148 L 548,175 L 535,215 L 505,232 L 460,225 L 438,200 Z',
  lake_ontario: 'M 590,115 L 668,108 L 698,132 L 688,175 L 652,192 L 605,182 L 585,155 Z',
  upper_canada: 'M 415,52 L 530,40 L 610,55 L 610,115 L 568,140 L 498,148 L 425,142 L 415,98 Z',
  montreal: 'M 615,32 L 710,22 L 755,50 L 748,108 L 712,128 L 660,120 L 625,95 L 615,62 Z',

  // ── Chesapeake Theater ──
  new_york: 'M 680,195 L 758,180 L 800,205 L 800,255 L 775,278 L 718,270 L 692,248 L 680,222 Z',
  washington_dc: 'M 658,318 L 715,300 L 752,322 L 748,365 L 715,385 L 668,372 L 648,350 Z',
  baltimore: 'M 705,262 L 765,250 L 798,270 L 798,305 L 772,320 L 730,312 L 705,292 Z',
  bladensburg: 'M 678,372 L 725,358 L 762,375 L 762,412 L 738,430 L 695,420 L 668,400 Z',
  chesapeake_bay: 'M 770,308 L 832,295 L 865,320 L 860,368 L 828,388 L 785,378 L 765,350 Z',
  virginia: 'M 622,385 L 678,370 L 718,392 L 722,432 L 692,455 L 645,445 L 618,422 Z',

  // ── Southern Theater ──
  carolina: 'M 568,452 L 628,435 L 672,455 L 672,495 L 638,518 L 588,510 L 558,488 Z',
  creek_nation: 'M 448,468 L 512,452 L 555,472 L 555,512 L 525,535 L 472,525 L 445,502 Z',
  mobile: 'M 372,512 L 435,498 L 472,518 L 475,558 L 448,578 L 398,570 L 368,548 Z',
  mississippi_territory: 'M 280,468 L 348,452 L 390,475 L 392,515 L 368,538 L 312,530 L 278,505 Z',
  new_orleans: 'M 255,552 L 328,535 L 368,558 L 368,602 L 338,625 L 278,618 L 248,592 Z',
  gulf_of_mexico: 'M 258,640 L 358,625 L 445,638 L 448,682 L 378,698 L 282,690 L 248,668 Z',

  // ── Maritime Theater ──
  atlantic_sea_lanes: 'M 888,310 L 985,285 L 1038,328 L 1035,418 L 995,448 L 912,435 L 882,390 Z',
  halifax: 'M 808,78 L 892,62 L 935,92 L 930,148 L 890,172 L 832,162 L 805,132 Z',

  // ── Interior Connectors ──
  ohio_valley: 'M 418,268 L 505,258 L 558,282 L 570,322 L 542,350 L 482,350 L 438,328 L 415,298 Z',
  indiana_territory: 'M 240,302 L 305,288 L 360,305 L 372,348 L 348,378 L 295,378 L 258,355 L 238,330 Z',
};

const ownerColors = {
  us: { fill: '#1a4fa0', stroke: '#0d3070', label: '#ffffff' },
  british: { fill: '#b82030', stroke: '#8b1528', label: '#ffffff' },
  native: { fill: '#7a5230', stroke: '#5c3d28', label: '#ffffff' },
  neutral: { fill: '#607080', stroke: '#455565', label: '#ffffff' },
};

/** Calculate the centroid of an SVG path string. */
function getPathCenter(pathStr) {
  const nums = pathStr.match(/[\d.]+/g)?.map(Number) || [];
  let sumX = 0, sumY = 0, count = 0;
  for (let i = 0; i < nums.length; i += 2) {
    sumX += nums[i];
    sumY += nums[i + 1];
    count++;
  }
  return { x: sumX / count, y: sumY / count };
}

/** Estimate text width in SVG units (rough heuristic). */
function estimateTextWidth(text, fontSize) {
  return text.length * fontSize * 0.58;
}

export default function Map({ territoryOwners, selectedTerritory, onTerritoryClick, troops }) {
  return (
    <svg
      viewBox="0 0 1120 750"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }}
    >
      {/* Definitions */}
      <defs>
        <radialGradient id="oceanGrad" cx="70%" cy="50%">
          <stop offset="0%" stopColor="#2a4a7f" />
          <stop offset="100%" stopColor="#1a2744" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="labelShadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.95" />
        </filter>
        {/* Water pattern for naval territories */}
        <pattern id="waterPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 0,10 Q 5,6 10,10 Q 15,14 20,10" fill="none" stroke="#5588cc" strokeWidth="1" opacity="0.3" />
        </pattern>
      </defs>

      {/* Ocean background */}
      <rect width="1120" height="750" fill="url(#oceanGrad)" />

      {/* Landmass silhouette */}
      <path
        d="M 200,20 L 350,10 L 520,15 L 680,5 L 830,18 L 930,50 L 970,130 L 960,220
           L 920,290 L 890,340 L 865,430 L 820,500 L 730,540 L 650,550 L 570,535
           L 500,548 L 420,570 L 350,600 L 280,620 L 240,600 L 220,530 L 230,460
           L 250,400 L 240,350 L 230,295 L 220,220 L 210,130 Z"
        fill="#3d5a3d"
        opacity="0.12"
        stroke="none"
      />

      {/* Theater region labels */}
      <text x="475" y="28" fill="#aabbcc" fontSize="18" fontWeight="bold" fontStyle="italic" textAnchor="middle" opacity="0.45" letterSpacing="2">
        GREAT LAKES THEATER
      </text>
      <text x="745" y="290" fill="#aabbcc" fontSize="18" fontWeight="bold" fontStyle="italic" textAnchor="middle" opacity="0.45" letterSpacing="2">
        CHESAPEAKE THEATER
      </text>
      <text x="418" y="440" fill="#aabbcc" fontSize="18" fontWeight="bold" fontStyle="italic" textAnchor="middle" opacity="0.45" letterSpacing="2">
        SOUTHERN THEATER
      </text>
      <text x="970" y="270" fill="#aabbcc" fontSize="18" fontWeight="bold" fontStyle="italic" textAnchor="middle" opacity="0.45" letterSpacing="2">
        MARITIME
      </text>

      {/* Adjacency lines */}
      {Object.entries(territories).map(([id, terr]) => {
        const fromPath = territoryPaths[id];
        if (!fromPath) return null;
        const fromCenter = getPathCenter(fromPath);

        return terr.adjacency.map((adjId) => {
          if (id > adjId) return null;
          const adjPath = territoryPaths[adjId];
          if (!adjPath) return null;
          const toCenter = getPathCenter(adjPath);

          return (
            <line
              key={`${id}-${adjId}`}
              x1={fromCenter.x}
              y1={fromCenter.y}
              x2={toCenter.x}
              y2={toCenter.y}
              stroke="#ffffff"
              strokeWidth="1"
              opacity="0.1"
              strokeDasharray="8,5"
            />
          );
        });
      })}

      {/* Territory polygons */}
      {Object.entries(territoryPaths).map(([id, path]) => {
        const owner = territoryOwners?.[id] || territories[id]?.startingOwner || 'neutral';
        const colors = ownerColors[owner];
        const isSelected = selectedTerritory === id;
        const terr = territories[id];
        const troopCount = troops?.[id] || 0;
        const center = getPathCenter(path);
        const isNaval = terr?.isNaval;
        const name = terr?.name || id;
        const nameWidth = estimateTextWidth(name, 14);
        const labelPad = 8;

        return (
          <g key={id} onClick={() => onTerritoryClick?.(id)} style={{ cursor: 'pointer' }}>
            {/* Water fill under naval territories */}
            {isNaval && (
              <path d={path} fill="url(#waterPattern)" opacity="0.6" />
            )}

            {/* Territory shape */}
            <path
              d={path}
              fill={colors.fill}
              stroke={isSelected ? '#ffd700' : colors.stroke}
              strokeWidth={isSelected ? 4 : 2}
              opacity={isSelected ? 1 : (isNaval ? 0.7 : 0.88)}
              filter={isSelected ? 'url(#glow)' : undefined}
              className="transition-all duration-200 hover:opacity-100"
            />

            {/* Naval wave overlay */}
            {isNaval && (
              <text
                x={center.x}
                y={center.y - 28}
                textAnchor="middle"
                fontSize="14"
                fill="#6699cc"
                opacity="0.5"
                letterSpacing="3"
              >
                ~ ~ ~
              </text>
            )}

            {/* Territory name — dark pill background scaled to text */}
            <rect
              x={center.x - nameWidth / 2 - labelPad}
              y={center.y - 22}
              width={nameWidth + labelPad * 2}
              height="20"
              rx="4"
              fill="#000000"
              opacity="0.6"
            />
            <text
              x={center.x}
              y={center.y - 7}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill={colors.label}
              filter="url(#labelShadow)"
              style={{ pointerEvents: 'none' }}
            >
              {name}
            </text>

            {/* Troop count badge */}
            {troopCount > 0 && (
              <>
                <circle
                  cx={center.x}
                  cy={center.y + 16}
                  r="15"
                  fill="#111111"
                  opacity="0.8"
                  stroke={colors.fill}
                  strokeWidth="2"
                />
                <text
                  x={center.x}
                  y={center.y + 22}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill="#ffffff"
                  style={{ pointerEvents: 'none' }}
                >
                  {troopCount}
                </text>
              </>
            )}

            {/* Fort indicator */}
            {terr?.hasFort && (
              <>
                <circle
                  cx={center.x + nameWidth / 2 + labelPad + 10}
                  cy={center.y - 12}
                  r="10"
                  fill="#000000"
                  opacity="0.5"
                />
                <text
                  x={center.x + nameWidth / 2 + labelPad + 10}
                  y={center.y - 7}
                  textAnchor="middle"
                  fontSize="14"
                  fill="#ffd700"
                  style={{ pointerEvents: 'none' }}
                >
                  &#9971;
                </text>
              </>
            )}

            {/* Point value indicator */}
            {terr?.points > 0 && (
              <text
                x={center.x}
                y={center.y + (troopCount > 0 ? 40 : 16)}
                textAnchor="middle"
                fontSize="10"
                fill="#aaaaaa"
                opacity="0.6"
                style={{ pointerEvents: 'none' }}
              >
                {terr.points} pt{terr.points > 1 ? 's' : ''}
              </text>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(18, 640)">
        <rect x="0" y="0" width="260" height="100" rx="8" fill="#000000" opacity="0.65" />
        <text x="130" y="20" textAnchor="middle" fontSize="13" fill="#999999" fontWeight="bold" letterSpacing="1">
          FACTIONS
        </text>
        {Object.entries({ us: 'United States', british: 'British / Canada', native: 'Native Coalition', neutral: 'Neutral / Contested' }).map(
          ([key, label], i) => (
            <g key={key} transform={`translate(14, ${30 + i * 18})`}>
              <rect width="18" height="14" rx="3" fill={ownerColors[key].fill} stroke={ownerColors[key].stroke} strokeWidth="1" />
              <text x="26" y="12" fontSize="14" fill="#dddddd">
                {label}
              </text>
            </g>
          )
        )}
      </g>
    </svg>
  );
}
