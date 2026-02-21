import React from 'react';

// RISK-style solid colors (no transparency on territories)
const ownerColors = {
  us: '#2563eb',       // Bright blue
  british: '#dc2626',  // Bright red
  native: '#ca8a04',   // Gold/amber
  neutral: '#6b7280',  // Medium gray
};

const ownerBorderColors = {
  us: '#1e40af',       // Darker blue
  british: '#991b1b',  // Darker red
  native: '#92400e',   // Darker amber
  neutral: '#374151',  // Dark gray
};

export default function TerritoryPolygon({
  territory,
  owner,
  troopCount,
  isSelected,
  isValidTarget,
  onClick,
  onMouseEnter,
  onMouseLeave,
  currentPhase,
  playerFaction,
  zoom = 1.0,
}) {
  // If territory doesn't have polygon data yet, skip rendering
  if (!territory.polygon || !territory.polygon.d) {
    return null;
  }

  const isNaval = territory.isNaval;
  const fillColor = isNaval ? '#0e3460' : (ownerColors[owner] || ownerColors.neutral);

  // Border styling based on state
  let strokeColor = '#000000'; // Black border by default (RISK style)
  let strokeWidth = 3;

  if (isSelected) {
    strokeColor = '#fbbf24'; // Gold for selected
    strokeWidth = 5;
  } else if (isValidTarget === 'attack') {
    strokeColor = '#f87171'; // Red for attack target
    strokeWidth = 4;
  } else if (isValidTarget === 'maneuver') {
    strokeColor = '#4ade80'; // Green for maneuver target
    strokeWidth = 4;
  }

  const isAllocateTarget = currentPhase === 'allocate' && owner === playerFaction;

  // Animation classes
  let pathClass = 'territory-path';
  if (isAllocateTarget && !isSelected) pathClass += ' territory-allocate-pulse';
  if (isValidTarget === 'attack') pathClass += ' territory-attack-pulse';
  if (isValidTarget === 'maneuver') pathClass += ' territory-maneuver-pulse';

  // Label positions from territory data or calculate center
  const labelPos = territory.labelPosition || territory.centroid || { x: 0, y: 0 };
  const troopPos = territory.troopPosition || { x: labelPos.x - 25, y: labelPos.y + 35 };
  const pointsPos = territory.pointsPosition || { x: labelPos.x + 35, y: labelPos.y - 25 };

  // Scale text sizes inversely with zoom to maintain readability
  const textScale = Math.max(0.7, Math.min(1.3, 1 / zoom));
  const badgeScale = Math.max(0.8, Math.min(1.2, 1 / zoom));

  return (
    <g className="territory-group">
      {/* Territory fill */}
      <path
        d={territory.polygon.d}
        fill={fillColor}
        fillOpacity={isNaval ? 0.3 : 0.6}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        className={pathClass}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ cursor: 'pointer' }}
      />

      {/* Territory name label */}
      <text
        x={labelPos.x}
        y={labelPos.y}
        textAnchor="middle"
        className="territory-label-name"
        pointerEvents="none"
        style={{ fontSize: `${14 * textScale}px` }}
      >
        {territory.name}
      </text>

      {/* Points indicator (star) */}
      <g pointerEvents="none">
        <text
          x={pointsPos.x}
          y={pointsPos.y}
          textAnchor="middle"
          className="territory-label-points"
          style={{ fontSize: `${13 * textScale}px` }}
        >
          {territory.points}★
        </text>
      </g>

      {/* Troop count badge - always visible, larger */}
      {troopCount > 0 && (
        <g pointerEvents="none">
          <circle
            cx={troopPos.x}
            cy={troopPos.y}
            r={18 * badgeScale}
            fill={ownerBorderColors[owner] || ownerBorderColors.neutral}
            stroke="#ffffff"
            strokeWidth={2.5 * badgeScale}
          />
          <text
            x={troopPos.x}
            y={troopPos.y + (6 * badgeScale)}
            textAnchor="middle"
            className="territory-label-troops"
            style={{ fontSize: `${16 * textScale}px` }}
          >
            {troopCount}
          </text>
        </g>
      )}

      {/* Fort indicator - positioned to avoid troop overlap */}
      {territory.hasFort && (
        <text
          x={troopPos.x + (30 * badgeScale)}
          y={troopPos.y + (6 * badgeScale)}
          textAnchor="middle"
          className="territory-label-fort"
          pointerEvents="none"
          style={{ fontSize: `${20 * textScale}px` }}
        >
          ♜
        </text>
      )}
    </g>
  );
}
