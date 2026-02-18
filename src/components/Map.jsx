import React from 'react';
import territories from '../data/territories';

/**
 * SVG territory paths — simplified polygons positioned on a 1000x700 viewport
 * representing North America circa 1812.
 * Coordinates are hand-tuned for a stylized game map (not cartographic).
 */
const territoryPaths = {
  // ── Great Lakes Theater ──
  detroit: 'M 440,200 L 470,185 L 500,195 L 505,220 L 490,240 L 460,235 L 440,220 Z',
  fort_dearborn: 'M 370,220 L 400,210 L 440,220 L 440,245 L 420,260 L 385,255 L 370,240 Z',
  niagara: 'M 530,185 L 560,175 L 590,185 L 595,210 L 575,225 L 545,220 L 530,205 Z',
  lake_erie: 'M 470,185 L 530,185 L 530,205 L 545,220 L 530,235 L 505,240 L 490,240 L 505,220 L 505,195 Z',
  lake_ontario: 'M 560,160 L 620,155 L 635,170 L 625,190 L 595,195 L 575,185 L 560,175 Z',
  upper_canada: 'M 470,120 L 530,110 L 590,120 L 590,160 L 560,175 L 530,185 L 470,185 L 470,150 Z',
  montreal: 'M 590,100 L 650,95 L 680,110 L 675,145 L 650,160 L 620,155 L 590,140 L 590,120 Z',

  // ── Chesapeake Theater ──
  new_york: 'M 620,210 L 680,200 L 710,215 L 710,250 L 690,265 L 650,260 L 630,245 L 620,230 Z',
  washington_dc: 'M 610,290 L 650,280 L 675,295 L 670,320 L 645,335 L 615,325 L 605,310 Z',
  baltimore: 'M 640,260 L 690,255 L 710,265 L 710,290 L 690,295 L 660,290 L 640,275 Z',
  bladensburg: 'M 630,320 L 665,310 L 690,320 L 690,345 L 670,355 L 640,350 L 625,340 Z',
  chesapeake_bay: 'M 690,290 L 730,280 L 750,300 L 745,335 L 720,345 L 695,335 L 690,310 Z',
  virginia: 'M 590,335 L 630,325 L 665,340 L 670,365 L 645,380 L 610,375 L 590,360 Z',

  // ── Southern Theater ──
  carolina: 'M 545,375 L 590,365 L 620,378 L 620,405 L 595,420 L 560,415 L 540,400 Z',
  creek_nation: 'M 470,385 L 510,375 L 545,388 L 545,415 L 520,430 L 490,425 L 470,410 Z',
  mobile: 'M 430,420 L 470,410 L 500,425 L 500,455 L 475,465 L 445,460 L 430,445 Z',
  mississippi_territory: 'M 370,380 L 410,370 L 440,385 L 440,415 L 420,430 L 390,425 L 370,405 Z',
  new_orleans: 'M 350,440 L 390,430 L 420,445 L 420,475 L 395,490 L 365,485 L 345,465 Z',
  gulf_of_mexico: 'M 350,500 L 420,490 L 480,500 L 480,530 L 420,540 L 355,535 L 340,520 Z',

  // ── Maritime Theater ──
  atlantic_sea_lanes: 'M 760,300 L 830,280 L 870,310 L 870,380 L 840,400 L 780,390 L 755,360 Z',
  halifax: 'M 720,120 L 780,110 L 810,130 L 805,165 L 775,180 L 740,170 L 720,145 Z',

  // ── Interior Connectors ──
  ohio_valley: 'M 440,260 L 500,255 L 540,270 L 550,295 L 530,310 L 490,310 L 455,300 L 440,280 Z',
  indiana_territory: 'M 340,270 L 380,260 L 420,270 L 430,300 L 415,320 L 375,320 L 345,305 L 340,285 Z',
};

const ownerColors = {
  us: { fill: '#002868', stroke: '#001844', label: '#ffffff' },
  british: { fill: '#c41e3a', stroke: '#8b1528', label: '#ffffff' },
  native: { fill: '#8b5e3c', stroke: '#5c3d28', label: '#ffffff' },
  neutral: { fill: '#888888', stroke: '#666666', label: '#ffffff' },
};

export default function Map({ territoryOwners, selectedTerritory, onTerritoryClick, troops }) {
  return (
    <svg
      viewBox="0 0 1000 600"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }}
    >
      {/* Background — ocean/parchment feel */}
      <defs>
        <radialGradient id="oceanGrad" cx="70%" cy="50%">
          <stop offset="0%" stopColor="#2a4a7f" />
          <stop offset="100%" stopColor="#1a2744" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="parchmentPattern" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="#f4e4c1" />
          <rect width="100" height="100" fill="url(#noise)" opacity="0.1" />
        </pattern>
      </defs>

      <rect width="1000" height="600" fill="url(#oceanGrad)" />

      {/* Landmass silhouette — simplified continent outline */}
      <path
        d="M 300,80 L 400,70 L 500,75 L 600,65 L 700,70 L 780,90 L 820,140 L 810,200
           L 780,250 L 750,280 L 730,350 L 700,400 L 650,430 L 600,440 L 550,430
           L 500,440 L 450,460 L 400,480 L 350,500 L 320,480 L 300,430 L 310,380
           L 330,340 L 320,300 L 310,260 L 300,200 L 290,140 Z"
        fill="#3d5a3d"
        opacity="0.2"
        stroke="none"
      />

      {/* Theater labels */}
      <text x="480" y="108" fill="#aaaaaa" fontSize="11" fontStyle="italic" textAnchor="middle" opacity="0.6">
        Great Lakes Theater
      </text>
      <text x="670" y="245" fill="#aaaaaa" fontSize="11" fontStyle="italic" textAnchor="middle" opacity="0.6">
        Chesapeake Theater
      </text>
      <text x="455" y="365" fill="#aaaaaa" fontSize="11" fontStyle="italic" textAnchor="middle" opacity="0.6">
        Southern Theater
      </text>
      <text x="800" y="265" fill="#aaaaaa" fontSize="11" fontStyle="italic" textAnchor="middle" opacity="0.6">
        Maritime Theater
      </text>

      {/* Adjacency lines (drawn under territories) */}
      {Object.values(territories).map((terr) =>
        terr.adjacency.map((adjId) => {
          if (terr.id > adjId) return null; // draw each edge once
          const adj = territories[adjId];
          if (!adj) return null;
          return (
            <line
              key={`${terr.id}-${adjId}`}
              x1={terr.mapCenter.x * 10}
              y1={terr.mapCenter.y * (600 / 100)}
              x2={adj.mapCenter.x * 10}
              y2={adj.mapCenter.y * (600 / 100)}
              stroke="#ffffff"
              strokeWidth="0.5"
              opacity="0.15"
              strokeDasharray="4,4"
            />
          );
        })
      )}

      {/* Territory polygons */}
      {Object.entries(territoryPaths).map(([id, path]) => {
        const owner = territoryOwners?.[id] || territories[id]?.startingOwner || 'neutral';
        const colors = ownerColors[owner];
        const isSelected = selectedTerritory === id;
        const terr = territories[id];
        const troopCount = troops?.[id] || 0;

        return (
          <g key={id} onClick={() => onTerritoryClick?.(id)} style={{ cursor: 'pointer' }}>
            {/* Territory shape */}
            <path
              d={path}
              fill={colors.fill}
              stroke={isSelected ? '#ffd700' : colors.stroke}
              strokeWidth={isSelected ? 3 : 1.5}
              opacity={isSelected ? 1 : 0.85}
              filter={isSelected ? 'url(#glow)' : undefined}
              className="transition-all duration-200 hover:opacity-100"
            />

            {/* Naval territory wave indicator */}
            {terr?.isNaval && (
              <text
                x={terr.mapCenter.x * 10}
                y={terr.mapCenter.y * 6 - 18}
                textAnchor="middle"
                fontSize="12"
                fill="#88bbff"
                opacity="0.7"
              >
                ~
              </text>
            )}

            {/* Territory name */}
            <text
              x={terr?.mapCenter.x * 10}
              y={terr?.mapCenter.y * 6 - 5}
              textAnchor="middle"
              fontSize="9"
              fontWeight="bold"
              fill={colors.label}
              style={{ pointerEvents: 'none', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              {terr?.name}
            </text>

            {/* Troop count badge */}
            {troopCount > 0 && (
              <>
                <circle
                  cx={terr?.mapCenter.x * 10}
                  cy={terr?.mapCenter.y * 6 + 8}
                  r="9"
                  fill="#000000"
                  opacity="0.6"
                />
                <text
                  x={terr?.mapCenter.x * 10}
                  y={terr?.mapCenter.y * 6 + 12}
                  textAnchor="middle"
                  fontSize="10"
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
                x={terr.mapCenter.x * 10 + 18}
                y={terr.mapCenter.y * 6 - 3}
                fontSize="10"
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
      <g transform="translate(20, 520)">
        <rect x="0" y="0" width="180" height="70" rx="5" fill="#000000" opacity="0.5" />
        {Object.entries({ us: 'United States', british: 'British/Canada', native: 'Native Coalition', neutral: 'Neutral' }).map(
          ([key, label], i) => (
            <g key={key} transform={`translate(10, ${12 + i * 15})`}>
              <rect width="12" height="10" rx="2" fill={ownerColors[key].fill} />
              <text x="18" y="9" fontSize="10" fill="#cccccc">
                {label}
              </text>
            </g>
          )
        )}
      </g>
    </svg>
  );
}
