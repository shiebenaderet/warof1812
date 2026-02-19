import React, { useRef, useEffect, useState } from 'react';

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
  currentPhase,
  playerFaction,
}) {
  const bgColor = ownerBgColors[owner] || ownerBgColors.neutral;
  const borderColor = ownerBorderColors[owner] || ownerBorderColors.neutral;
  const isNaval = territory.isNaval;

  // Track troop changes for "+1" animation
  const prevTroopCount = useRef(troopCount);
  const [showPlusOne, setShowPlusOne] = useState(false);
  useEffect(() => {
    if (troopCount > prevTroopCount.current && currentPhase === 'allocate') {
      setShowPlusOne(true);
      const timer = setTimeout(() => setShowPlusOne(false), 600);
      return () => clearTimeout(timer);
    }
    prevTroopCount.current = troopCount;
  }, [troopCount, currentPhase]);

  // Track ownership changes for capture flash
  const prevOwner = useRef(owner);
  const [showFlash, setShowFlash] = useState(false);
  useEffect(() => {
    if (owner !== prevOwner.current && prevOwner.current !== 'neutral') {
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 500);
      return () => clearTimeout(timer);
    }
    prevOwner.current = owner;
  }, [owner]);

  const isAllocateTarget = currentPhase === 'allocate' && owner === playerFaction;

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

  if (isAllocateTarget && !isSelected) {
    extraClass += ' allocate-pulse';
  }
  if (showFlash) {
    extraClass += ' capture-flash';
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
      {showPlusOne && <span className="troop-add-anim">+1</span>}
    </div>
  );
}
