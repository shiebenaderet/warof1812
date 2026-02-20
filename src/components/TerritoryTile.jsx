import React, { useRef, useEffect, useState } from 'react';
import { HEX_WIDTH, HEX_HEIGHT, hexToPixel } from '../data/territories';

const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

const ownerBgColors = {
  us: '#1e4fbf',
  british: '#b52020',
  native: '#8b4513',
  neutral: '#5f6b7a',
};

const ownerBorderColors = {
  us: '#3b82f6',
  british: '#ef4444',
  native: '#ca8a04',
  neutral: '#8892a0',
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

  // Determine visual state
  let extraClass = '';
  let glowColor = `${borderColor}44`;
  if (isSelected) {
    glowColor = 'rgba(251, 191, 36, 0.6)';
  } else if (isValidTarget === 'attack') {
    glowColor = 'rgba(248, 113, 113, 0.5)';
    extraClass = 'hex-tile-pulse-red';
  } else if (isValidTarget === 'maneuver') {
    glowColor = 'rgba(74, 222, 128, 0.5)';
    extraClass = 'hex-tile-pulse-green';
  }

  if (isAllocateTarget && !isSelected) {
    extraClass += ' allocate-pulse';
  }
  if (showFlash) {
    extraClass += ' capture-flash';
  }

  const hexCells = territory.hexCells || [{ col: 0, row: 0 }];
  const primaryIdx = territory.primaryCell ?? 0;

  return (
    <>
      {hexCells.map((cell, index) => {
        const pos = hexToPixel(cell.col, cell.row);
        const isPrimary = index === primaryIdx;

        return (
          <div
            key={`${territory.id}-${index}`}
            data-territory={isPrimary ? territory.id : undefined}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`hex-tile ${extraClass}`}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: HEX_WIDTH,
              height: HEX_HEIGHT,
              clipPath: HEX_CLIP,
              WebkitClipPath: HEX_CLIP,
              backgroundColor: bgColor,
              opacity: isNaval && !isSelected && !isValidTarget ? 0.8 : 1,
              filter: isSelected
                ? `drop-shadow(0 0 4px rgba(251,191,36,0.8))`
                : `drop-shadow(0 0 2px ${glowColor})`,
              zIndex: isSelected ? 5 : 2,
            }}
          >
            {isPrimary && (
              <>
                {/* Points star */}
                <span className="board-tile-points">{territory.points}</span>

                {/* Territory name */}
                <span className="board-tile-name">{territory.name}</span>

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
              </>
            )}
          </div>
        );
      })}
    </>
  );
}
