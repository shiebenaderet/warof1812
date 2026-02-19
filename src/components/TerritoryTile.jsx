import React from 'react';

const ownerBgColors = {
  us: '#1e40af',
  british: '#991b1b',
  native: '#78350f',
  neutral: '#4b5563',
};

const ownerBorderColors = {
  us: '#2563eb',
  british: '#dc2626',
  native: '#a16207',
  neutral: '#6b7280',
};

export default function TerritoryTile({
  territory,
  owner,
  troopCount,
  isSelected,
  isValidTarget,
  onClick,
  onMouseEnter,
  onMouseLeave,
  zoomLevel,
}) {
  const bgColor = ownerBgColors[owner] || ownerBgColors.neutral;
  const borderColor = ownerBorderColors[owner] || ownerBorderColors.neutral;
  const isNaval = territory.isNaval;

  let borderStyle = `2px solid ${borderColor}`;
  let boxShadow = 'none';
  let extraClass = '';

  if (isSelected) {
    borderStyle = '2px solid #fbbf24';
    boxShadow = '0 0 12px rgba(251, 191, 36, 0.6), inset 0 0 8px rgba(251, 191, 36, 0.15)';
  } else if (isValidTarget === 'attack') {
    borderStyle = '2px dashed #f87171';
    boxShadow = '0 0 8px rgba(248, 113, 113, 0.4)';
    extraClass = 'board-tile-pulse-red';
  } else if (isValidTarget === 'maneuver') {
    borderStyle = '2px dashed #4ade80';
    boxShadow = '0 0 8px rgba(74, 222, 128, 0.4)';
    extraClass = 'board-tile-pulse-green';
  }

  if (isNaval) {
    borderStyle = borderStyle.replace('solid', 'dashed');
  }

  return (
    <div
      data-territory={territory.id}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`board-tile ${extraClass}`}
      style={{
        gridColumn: territory.gridPosition.col + 1,
        gridRow: territory.gridPosition.row + 1,
        backgroundColor: bgColor,
        border: borderStyle,
        boxShadow,
        opacity: isNaval && !isSelected && !isValidTarget ? 0.8 : 1,
      }}
    >
      {/* Points star */}
      <span className="board-tile-points">{territory.points}</span>

      {/* Territory name */}
      <span className="board-tile-name">{territory.name}</span>

      {/* Theater label (visible when zoomed in) */}
      {zoomLevel >= 1.25 && (
        <span className="board-tile-theater">{territory.theater}</span>
      )}

      {/* Bottom row: troops + fort */}
      <span className="board-tile-bottom">
        {troopCount > 0 && (
          <span
            className="board-tile-troops"
            style={{ backgroundColor: borderColor }}
          >
            {troopCount}
          </span>
        )}
        {territory.hasFort && <span className="board-tile-fort" title="Fort (+1 defense)">&#9730;</span>}
      </span>
    </div>
  );
}
