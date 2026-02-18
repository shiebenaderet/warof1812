import React from 'react';
import territories from '../data/territories';

/**
 * SVG territory paths — simplified polygons on a 1200x800 viewport.
 * Territories are spaced out for readability with larger hit areas.
 */
const territoryPaths = {
  // ── Great Lakes Theater ──
  detroit: 'M 380,170 L 420,150 L 465,162 L 472,195 L 455,220 L 415,215 L 380,198 Z',
  fort_dearborn: 'M 290,200 L 340,185 L 385,198 L 385,230 L 360,252 L 315,248 L 290,228 Z',
  niagara: 'M 530,155 L 575,140 L 615,155 L 620,190 L 598,210 L 560,205 L 530,185 Z',
  lake_erie: 'M 435,145 L 520,140 L 535,160 L 525,195 L 498,210 L 465,205 L 445,185 Z',
  lake_ontario: 'M 580,110 L 650,105 L 675,125 L 665,160 L 635,172 L 595,165 L 575,145 Z',
  upper_canada: 'M 430,60 L 520,50 L 590,62 L 590,110 L 555,130 L 500,135 L 440,130 L 430,95 Z',
  montreal: 'M 600,40 L 680,32 L 720,55 L 715,100 L 685,118 L 645,112 L 610,92 L 600,65 Z',

  // ── Chesapeake Theater ──
  new_york: 'M 660,185 L 730,172 L 768,192 L 768,235 L 745,255 L 698,248 L 672,228 L 660,208 Z',
  washington_dc: 'M 640,295 L 690,280 L 722,298 L 718,335 L 690,352 L 650,342 L 632,322 Z',
  baltimore: 'M 685,245 L 740,235 L 770,252 L 770,282 L 748,295 L 710,288 L 685,270 Z',
  bladensburg: 'M 660,340 L 705,328 L 738,342 L 738,375 L 715,390 L 675,382 L 652,365 Z',
  chesapeake_bay: 'M 745,290 L 800,278 L 830,300 L 825,342 L 795,358 L 758,348 L 742,322 Z',
  virginia: 'M 608,355 L 658,342 L 695,360 L 700,395 L 672,415 L 630,408 L 605,388 Z',

  // ── Southern Theater ──
  carolina: 'M 558,415 L 610,400 L 648,418 L 648,452 L 618,472 L 575,465 L 548,445 Z',
  creek_nation: 'M 450,430 L 505,415 L 545,432 L 545,465 L 518,485 L 475,478 L 448,460 Z',
  mobile: 'M 385,472 L 440,458 L 475,475 L 478,512 L 452,528 L 410,522 L 382,502 Z',
  mississippi_territory: 'M 300,430 L 358,415 L 395,435 L 398,470 L 375,490 L 328,485 L 298,462 Z',
  new_orleans: 'M 275,505 L 335,490 L 372,510 L 372,548 L 345,568 L 298,562 L 270,538 Z',
  gulf_of_mexico: 'M 280,585 L 370,572 L 445,582 L 448,620 L 385,635 L 300,628 L 268,610 Z',

  // ── Maritime Theater ──
  atlantic_sea_lanes: 'M 850,290 L 935,268 L 982,305 L 980,385 L 945,410 L 878,398 L 845,358 Z',
  halifax: 'M 770,75 L 845,62 L 882,88 L 878,135 L 842,155 L 792,148 L 768,118 Z',

  // ── Interior Connectors ──
  ohio_valley: 'M 420,248 L 495,240 L 545,260 L 555,295 L 530,318 L 475,318 L 435,298 L 418,275 Z',
  indiana_territory: 'M 265,278 L 320,265 L 368,280 L 378,318 L 358,342 L 310,342 L 275,322 L 262,302 Z',
};

const ownerColors = {
  us: { fill: '#1a4fa0', stroke: '#0d3070', label: '#ffffff' },
  british: { fill: '#b82030', stroke: '#8b1528', label: '#ffffff' },
  native: { fill: '#7a5230', stroke: '#5c3d28', label: '#ffffff' },
  neutral: { fill: '#707070', stroke: '#555555', label: '#ffffff' },
};

export default function Map({ territoryOwners, selectedTerritory, onTerritoryClick, troops }) {
  return (
    <svg
      viewBox="0 0 1050 700"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }}
    >
      {/* Background */}
      <defs>
        <radialGradient id="oceanGrad" cx="70%" cy="50%">
          <stop offset="0%" stopColor="#2a4a7f" />
          <stop offset="100%" stopColor="#1a2744" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="labelShadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.9" />
        </filter>
      </defs>

      <rect width="1050" height="700" fill="url(#oceanGrad)" />

      {/* Landmass silhouette */}
      <path
        d="M 220,30 L 350,20 L 500,25 L 650,15 L 780,25 L 880,50 L 920,120 L 910,200
           L 870,260 L 840,300 L 820,380 L 780,440 L 700,480 L 630,490 L 560,480
           L 490,490 L 420,510 L 360,540 L 300,560 L 260,540 L 240,480 L 250,420
           L 270,370 L 260,320 L 250,270 L 240,200 L 230,120 Z"
        fill="#3d5a3d"
        opacity="0.15"
        stroke="none"
      />

      {/* Theater labels */}
      <text x="470" y="38" fill="#cccccc" fontSize="14" fontWeight="bold" fontStyle="italic" textAnchor="middle" opacity="0.5">
        Great Lakes Theater
      </text>
      <text x="720" y="268" fill="#cccccc" fontSize="14" fontWeight="bold" fontStyle="italic" textAnchor="middle" opacity="0.5">
        Chesapeake Theater
      </text>
      <text x="420" y="405" fill="#cccccc" fontSize="14" fontWeight="bold" fontStyle="italic" textAnchor="middle" opacity="0.5">
        Southern Theater
      </text>
      <text x="920" y="255" fill="#cccccc" fontSize="14" fontWeight="bold" fontStyle="italic" textAnchor="middle" opacity="0.5">
        Maritime Theater
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
              opacity="0.12"
              strokeDasharray="6,4"
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

        return (
          <g key={id} onClick={() => onTerritoryClick?.(id)} style={{ cursor: 'pointer' }}>
            {/* Territory shape */}
            <path
              d={path}
              fill={colors.fill}
              stroke={isSelected ? '#ffd700' : colors.stroke}
              strokeWidth={isSelected ? 3.5 : 1.8}
              opacity={isSelected ? 1 : 0.85}
              filter={isSelected ? 'url(#glow)' : undefined}
              className="transition-all duration-200 hover:opacity-100"
            />

            {/* Naval territory wave indicator */}
            {terr?.isNaval && (
              <text
                x={center.x}
                y={center.y - 22}
                textAnchor="middle"
                fontSize="16"
                fill="#88bbff"
                opacity="0.6"
              >
                ~~~
              </text>
            )}

            {/* Territory name with background for readability */}
            <rect
              x={center.x - 42}
              y={center.y - 18}
              width="84"
              height="16"
              rx="3"
              fill="#000000"
              opacity="0.5"
            />
            <text
              x={center.x}
              y={center.y - 5}
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill={colors.label}
              filter="url(#labelShadow)"
              style={{ pointerEvents: 'none' }}
            >
              {terr?.name}
            </text>

            {/* Troop count badge */}
            {troopCount > 0 && (
              <>
                <circle
                  cx={center.x}
                  cy={center.y + 12}
                  r="12"
                  fill="#000000"
                  opacity="0.7"
                  stroke={colors.fill}
                  strokeWidth="1.5"
                />
                <text
                  x={center.x}
                  y={center.y + 17}
                  textAnchor="middle"
                  fontSize="13"
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
              <text
                x={center.x + 22}
                y={center.y - 6}
                fontSize="14"
                fill="#ffd700"
                style={{ pointerEvents: 'none' }}
              >
                &#9971;
              </text>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(20, 600)">
        <rect x="0" y="0" width="220" height="85" rx="6" fill="#000000" opacity="0.6" />
        {Object.entries({ us: 'United States', british: 'British / Canada', native: 'Native Coalition', neutral: 'Neutral' }).map(
          ([key, label], i) => (
            <g key={key} transform={`translate(12, ${14 + i * 18})`}>
              <rect width="16" height="13" rx="2" fill={ownerColors[key].fill} />
              <text x="24" y="11" fontSize="13" fill="#dddddd">
                {label}
              </text>
            </g>
          )
        )}
      </g>
    </svg>
  );
}

/** Calculate the centroid of an SVG path string (average of all coordinate pairs). */
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
